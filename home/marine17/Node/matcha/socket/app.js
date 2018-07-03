const express = require('express')
const app = express()

const server = app.listen(3001, function() {
    console.log('server running on port 3001')
});

const io = require('socket.io')(server)
let nbVisitors = 0
let authUsers = []
let rooms = []

function getUsersNb() {
  return {
    nbVisitors: nbVisitors,
    nbAuthUsers: authUsers.length
  }
}

// Si l'utilisateur est authentifie (sur client), ajout a la liste des authentifies
function authUser(socket, username) {
  if (username) {
    socket.username = username
    const authUser = authUsers.find(u => u.username === username)
    if (authUser) {
      authUser.sockets.push(socket)
    } else {
      authUsers.push({
          username: username,
          sockets: [socket]
        }
      )
    }
    socket.join(username)
  }
  io.emit('NBUSERS_CHANGE', getUsersNb())
}

// Si l'utilisateur est authentifie (sur client), suppression de la liste des authentifies
function disauthUser(socket) {
  if (socket.username) {
    // Enleve l'utilisateur des rooms
    const socketRooms = rooms.filter(r => r.sockets.find(s => s.id === socket.id))
    if (socketRooms) {
      socketRooms.forEach(r => {
        const data = {
          id: r.id,
          username: socket.username
        }
        io.to(r.id).emit('CHAT_QUIT_ROOM', data)
        socket.leave(r.id)
        if (r.sockets.length < 2) {
          rooms.splice(rooms.findIndex(r2 => r2.id === r.id), 1)
        } else {
          r.sockets.splice(r.sockets.findIndex(s => s.id === socket.id), 1)
        }
      })
    }
    // Enleve l'utilisateur des utilisteurs connectes
    const authUser = authUsers.find(u => u.username === socket.username)
    if (authUser) {
      if (authUser.sockets.length < 2) {
        authUsers.splice(authUsers.findIndex(u => u.username === socket.username))
      } else {
        authUser.sockets.splice(authUser.sockets.findIndex(s => s.id === socket.id), 1)
      }
    }
    delete socket.username
  }
  io.emit('NBUSERS_CHANGE', getUsersNb())
}

io.on('connection', function(socket) {
  nbVisitors++

  socket.on('IDENTIFY_USER', function(username) {
    authUser(socket, username)
  })

  socket.on('UNLOAD_USER', function(user) {
    console.log('UNLOAD_USER', user)
    if (user.username) {
      disauthUser(socket)
    }
  })

  // Reception d'un message de login
  socket.on('AUTH_LOGIN', function(data) {
    console.log('AUTH_LOGIN', data.username)
    authUser(socket, data.username)
  })

  // Reception d'un message de logout
  socket.on('AUTH_LOGOUT', function(data) {
    console.log('AUTH_LOGOUT', data)
    disauthUser(socket)
  })

  // Chat Room
  socket.on('CHAT_OPEN_ROOM', function(data) {
    const { room, usernames } = data
    console.log('CHAT_OPEN_ROOM', room._id, socket.username)
    socket.join(room._id)
    let socketRoom = rooms.find(r => r.id === room._id)
    if (socketRoom) {
      if (!socketRoom.sockets.find(s => s.id === socket.id)) {
        socketRoom.sockets.push(socket)
      }
    }
    else {
      rooms.push({
        id: room._id,
        usernames: usernames,
        sockets: [socket]
      })
    }
    socket.join(room._id)
    data = {
      id: room._id,
      username: socket.username
    }
    io.to(room._id).emit('CHAT_OPEN_ROOM', data)
  })

  socket.on('CHAT_QUIT_ROOM', function(id) {
    console.log('CHAT_QUIT_ROOM', id, socket.username)
    let socketRoom = rooms.find(r => r.id === id)
    if (socketRoom) {
      if (socketRoom.sockets.length < 2) {
        rooms.splice(rooms.findIndex(r => r.id === id), 1)
      } else {
        socketRoom.sockets.splice(socketRoom.sockets.findIndex(s => s.id === socket.id), 1)
      }
      const data = {
        id: id,
        username: socket.username
      }
      io.to(id).emit('CHAT_QUIT_ROOM', data)
      socket.leave(id)
    }
  })

  socket.on('CHAT_SEND_MESSAGE', function(data) {
    console.log('CHAT_SENDMESSAGE', data.room, socket.username)
    const socketRoom = rooms.find(r => r.id = data.room)
    const { usernames } = socketRoom
    const otheruserName = usernames[0] === socket.username ? usernames[1] : usernames[0]
    const otheruser = authUsers.find(u => u.username === otheruserName)
    // otheruser n'est pas connecte : on cree une notification en BDD
    // if (!otheruser) {
    //   console.log('emit NOTIFICATION_SEND_BDD', socket)
    //   socket.emit('NOTIFICATION_SEND_BDD', {
    //     username: otheruserName,
    //     message: "Vous avez reçu un message de " + socket.username
    //   })
    // // otheruser est connecte
    // } else {
      // on recherche les sockets sur lesquels il n'est pas connecte au chat pour envoyer une notification immediate
    // if (otheruser)
    //   otheruser.sockets.forEach(os => {
    //     if (!socketRoom.sockets.find(rs => rs === os)) {
    //       console.log('emit NOTIFICATION_RECEIVE')
    //       socket.to(os.id).emit('NOTIFICATION_RECEIVE', {
    //         username: otheruserName,
    //         message: "Vous avez reçu un message de " + socket.username
    //       })
    //     }
    //   })
    // }
    // on envoie le message aux utilisateurs connectes au chat (autre que l'emetteeur)
    socket.broadcast.to(data.room).emit('CHAT_RECEIVE_MESSAGE', data)
  })

  // visite d'un utilisateur sur sa page
  socket.on('USER_VISITADD', function(username) {
    console.log('USER_VISITADD', username)
    io.to(username).emit('AUTH_VISITADD')
  })

  // action de relation (like/unlike)
  socket.on('AUTH_RELATION', function(data) {
    console.log('AUTH_RELATION', data.action, data.actor.username, data.receptor.username)
    let message = data.actor.username + ' vous a '
    message += (data.action === 'unlike') ? 'unliké.' : 'liké.'
    message += ' Vous êtes amis.'
    // si l'utilisateur recepteur est connecte
    if (authUsers.find(u => u.username === data.receptor.username)) {
      io.to(data.receptor.username).emit('AUTH_RELATION', data)
    }
  })

  // envoi d'une notification a username
  socket.on('NOTIFICATION_SEND', function(data) {
    console.log('NOTIFICATION_RECEIVE', data)
    io.to(data.username).emit('NOTIFICATION_RECEIVE', data)
  })


  // Deconnexion d'un utilisateur
  socket.on('disconnect', function() {
    nbVisitors--
    disauthUser(socket)
  })
})
