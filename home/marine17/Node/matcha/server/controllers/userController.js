const async = require('async')
const jwt = require('jsonwebtoken')
const lodash = require('lodash')

const User = require('../models/user')
const Like = require('../models/likes')
const Image = require('../models/image')
const mailController = require('./mailController')

module.exports = {
  findAll: function(callback){
    User.find(function(err, users) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, {
        success: 1,
        data: users
      })
    })
  },
  findById: function(id, callback) {
    User.findById(id, function (err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0
        })
      } else {
          callback(null, {
            success: 1,
            data: {
              username: user.username,
              role: user.role,
            }
        })
      }
    })
  },
  findByUsername: function(username, callback) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0
        })
      } else {
          delete user.password
          callback(null, {
            success: 1,
            data: user
        })
      }
    })
  },
  findCompleteByUsername: function(username, callback) {

    User.findOne({username: username})
    // .populate({
    //   path: 'friends',
    //   populate: {
    //     path: 'avatar.image'
    //   }
    // })
    // .populate('friends')
    // .populate: {
    //   path: 'avatar.image'
    // }
    .populate({
      path: 'avatar.image'
    })
    .populate({
      path: 'gallery.image'
    })
      .exec(function (err, user) {
      if (err) {
        // console.log(err)
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0
        })
      } else {
        // console.log(`Et ? ... ${user}`)
        callback(null, {
          success: 1,
          data: user
        })
      }
    })
  },



  findFriendsByUsername: function(username, callback){
    User.findOne({username: username})
      .exec(function (err, user) {
        if (err){
          callback(err, null)
          return
        }
        if (!user){
          callback(null, {
            success: 0
          })
        } else {
          async.parallel({
            likes: (callback) => {
              user.getLikes(user._id, callback)
            },
            likers: (callback) => {
              user.getLikers(user._id, callback)
            },
          }, function(err, results) {
            if (err) {
              callback(err, null)
              return
            }
            const friends = lodash.intersectionBy(results.likes, results.likers, 'username')
            callback(null, {
              success: 1,
              data: friends ? friends : []
            })
          })
        }
      })

  },



  create: function (username, email, password, callback) {
    const self = this
    User.findOne({username: username}, function (err, user) {
      if (err) {
          callback(err, null)
          return
      }
      if (user) {
        if (user.confirmed === false) {
          callback(null, {
            success: 0,
            message: 'NOT CONFIRMED'
          })
          return
        }
        callback(null, {
          success: 0,
          message: 'DUPLICATE USERNAME'
        })
        return
      }
      const newUser = new User({
        username: username,
        password: password,
        email: email,
        role: 'user',
        confirmed: false,
        banished: false
      })
      newUser.save(function(err, user) {
        if (err) {
          callback(err, null)
          return
        }
        const authToken = jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
        self.sendEmailConfirmation(user, authToken)
        callback(null, {
          success: 1,
          token: authToken
        })
      })
    })
  },

  update: function (user, callback){
    User.findOneAndUpdate({username: user.username}, user, {new: true}, function(err, newUser) {
      if (err){
        callback(err, null)
        return
      }
      callback(null, {
        success: 1,
        data: newUser
      })
    })
  },

  updateRelation: function (data, callback) {
    async.parallel({
      // on recherche les 2 users
      actor: (callback) => User.getItemByUsername(data.actor, callback),
      receptor: (callback) => User.getItemByUsername(data.receptor, callback),
    }, function (err, results) {
      if (err){
        callback(err, null)
        return
      }
      const users = {
        liker: results.actor._id,
        liked: results.receptor._id
      }
      data.actor = results.actor
      data.receptor = results.receptor
      switch(data.action) {
        case 'like':
          // on recherche si la paire existe
          Like.findOne(users, function(err, result) {
            if (err){
              callback(err, null)
              return
            }
            // La paire existe, on renvoie un message
            if (result) {
              callback(null, {
                success: 0,
                message: 'ALREADY LIKED'
              })
              return
            }
            // On cree la paire
            const like = new Like(users)
            like.save(function(err, result) {
              if (err){
                callback(err, null)
                return
              }
              // On recherche la paire inverse
              Like.findOne({
                liker: results.receptor._id,
                liked: results.actor._id
              }, function(err, result) {
                if (err){
                  callback(err, null)
                  return
                }
                // La paire inverse existe (=> relike)
                if (result) {
                  data.action = 'relike'
                }
                callback(null, {
                  success: 1,
                  data: data
                })
                return
              })
            })
          })
        break
        case 'unlike':
          Like.findOne(users, function(err, result) {
            if (err){
              callback(err, null)
              return
            }
            if (!result) {
              callback(null, {
                success: 0,
                message: 'NOT LIKED'
              })
              return
            }
            Like.deleteOne(users, function(err, result) {
              if (err){
                callback(err, null)
                return
              }
              callback(null, {
                success: 1,
                data: data
              })
              return
            })
          })
        break
      }
    })
  },

  addVisit: function(username, callback) {
    User.findOneAndUpdate({username: username}, {$inc: {visited: 1}}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, {
        success: 1
      })
    })
  },



  sendEmailConfirmation: function(user, authToken) {
    const url = encodeURI(process.env.URL_CLIENT + '/confirmation/' + user.username + '/' + authToken)
    const text = 'Bonjour,\nVous devez confirmer votre inscription en copiant cette url dans votre navigateur: '
      + url + '\nBonne journée !'
    const html = '<p>Bonjour,</p><p>Vous devez confirmer votre inscription en cliquant sur le lien suivant : <a href="'
      + url + '">' + url + '</a></p><p>Bonne journée !</p>'
    mailController.send('user', {
      subject: '[Matcha][' + user.username + '] Confirmation de votre inscription',
      text: text,
      html: html
    })
  },
  sendEmailPasswordReset: function(user, authToken) {
    const url = encodeURI(process.env.URL_CLIENT + '/passwordreset/' + user.username + '/' + authToken)
    const text = 'Bonjour,\nVous pourrez modifier votre mot de passe en copiant cette url dans votre navigateur: '
      + url + '\nBonne journée !'
    const html = '<p>Bonjour,</p><p>Vous pourrez modifier votre mot de passe en cliquant sur le lien suivant : <a href="'
      + url + '">' + url + '</a></p><p>Bonne journée !</p>'
    mailController.send('user', {
      subject: '[Matcha][' + user.username + '] Modification de votre mot de passe',
      text: text,
      html: html
    })
  },
  sendEmailAskUsername: function(user) {
    const text = 'Bonjour,\nLe pseudo associé à votre adresse email est : ' + user.username
      + '\nBonne journée !'
    const html = '<p>Bonjour,</p><p>Le pseudo associé à votre adresse email est : ' + user.username
      + '</p><p>Bonne journée !</p>'
    mailController.send('user', {
      subject: '[Matcha][' + user.username + '] Demande de pseudo',
      text: text,
      html: html
    })
  },
}
