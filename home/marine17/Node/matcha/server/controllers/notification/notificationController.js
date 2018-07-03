const Notification = require('../../models/notification/notification')
const User = require('../../models/user')

module.exports = {
  getOne: function(id, callback) {
    Notification.findById(id, function(err, message){
      if (err) {
        callback(err, null)
        return
      }
      if (!message) {
        callback(null, {
          success: 0,
          message: 'INEXISTANT NOTIFICATION'
        })
        return
      }
      callback(null, {
        success: 1,
        data: message
      })
    })
  },
  getAllByUser: function(username, callback) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      Notification.find({user: user._id})
      .sort({created: -1})
      .exec(function (err, notifications) {
        if (err) {
          callback(err, null)
          return
        }
        if (!notifications) {
          callback(null, {
            success: 1,
            data: []
          })
          return
        }
        callback(null, {
          success: 1,
          data: notifications
        })
      })
    })
  },
  getAllUnreadByUser: function(username, callback) {
    this.getAllByUser(username, function(err, result) {
      if (err) {
        callback(err, null)
        return
      }
      if (!result.data.length) {
        callback(err, result)
        return
      }
      callback(null, {
        success: 1,
        data: result.data.filter(n => n.read === false)
      })
    })
  },
  create: function(body, callback) {
    User.findOne({username: body.username}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      let notification = new Notification({
        user: {_id: user._id},
        message: body.message,
        type: body.type,
        created: new Date()
      })
      if (body.type === 'chat') {
        notification.room = {_id: body.room}
      }
      notification.save(function(err, notification) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, {
          success: 1,
          data: {
            _id: notification._id,
            type: notification.type,
            room: notification.room,
            username: body.username,
            message: notification.message,
            created: notification.created
          }
        })
      })
    })
  },
  setRead: function(id, read, callback) {
    Notification.findById(id, function(err, notification) {
      if (err) {
        callback(err, null)
        return
      }
      notification.read = read
      notification.save(function(err, notification) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, {
          success: 1,
          data: notification
        })
      })
    })
  },
  delete: function(id, callback) {
    Notification.deleteOne({_id: id}, function(err) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, {
          success: 1
      })
    })
  },

  deleteAllByUser: function(username, callback) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      Notification.deleteMany({user: user._id}, function(err) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, {
            success: 1
        })
      })
    })
  }
}
