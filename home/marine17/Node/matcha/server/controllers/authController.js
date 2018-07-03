const jwt = require('jsonwebtoken')
const async = require('async')
const lodash = require('lodash')
const User = require('../models/user')
const userController = require('./userController')
const notificationController = require('./notification/notificationController')

module.exports = {
  login: function(username, password, callback) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0,
          message: 'INEXISTANT LOGIN'
        })
        return
      }
      if (user.confirmed === false) {
        callback(null, {
          success: 0,
          message: 'UNCONFIRMED USER'
        })
        return
      }
      if (user.banished === true) {
        callback(null, {
          success: 0,
          message: 'BANISHED USER'
        })
        return
      }
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          callback(err, null)
          return
        }
        if (!isMatch) {
          callback(null, {
            success: 0,
            message: 'BAD CREDENTIALS'
          })
          return
        }
        const authToken = jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
        const date = new Date()
        user.last_login = date
        user.save(function(err, user) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, {
            success: 1,
            token: authToken
          })
        })
      })
    })
  },

  profile: function(id, callback) {
    User.findById(id)
    .select('_id username role email visited is_completed firstname lastname age resume city zip visibility')
    .populate({
      path: 'avatar.image'
    })
    .populate({
      path: 'gallery.image'
    })
    .populate('gender')
    .populate('orientation')
    .populate('interests')
    .exec(function (err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0
        })
      } else {
        async.parallel({
          notifications: (callback) => {
            notificationController.getAllByUser(user.username, callback)
          },
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
          const likes = lodash.differenceBy(results.likes, friends, 'username')
          const likers = lodash.differenceBy(results.likers, friends, 'username')
          const data = {
            _id: user._id,
            username: user.username,
            role: user.role,
            email: user.email,
            visited: user.visited,
            is_completed: user.is_completed,
            firstname: user.firstname,
            lastname: user.lastname,
            age: user.age,
            resume: user.resume,
            city: user.city,
            zip: user.zip,
            visibility: user.visibility,
            likes: likes ? likes : [],
            likers: likers ? likers : [],
            friends: friends ? friends : [],
            notifications: results.notifications.data.filter(n => !n.read)
          }
          callback(null, {
            success: 1,
            data: data
          })
        })
      }
    })
  },

  logout: function(username, callback) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0
        })
        return
      }
      const date = new Date()
      user.last_logout = date
      user.save(function(err, user) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, {
          success: 1
        })
      })
    })
  },

  confirm: function(username, token, callback) {
    jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {

      if (err) {
        callback(null, {
          success: 0,
          message: 'BAD TOKEN'
        })
        return
      }
      if (decoded.username !== username) {
        callback(null, {
          success: 0,
          message: 'BAD USERNAME'
        })
        return
      }
      User.findOneAndUpdate({username: username}, {confirmed: true}, function(err, user) {
        if (err) {
          callback(err, null)
          return
        }
        if (!user) {
          callback(null, {
            success: 0,
            message: 'USER NOT FOUND'
          })
          return
        }
        callback(null, {
          success: 1
        })
      })
    })
  },

  ask: function(type, email, callback) {
    User.findOne({email: email}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0,
          message: 'USER NOT FOUND'
        })
        return
      }
      if (user.banished === true) {
        callback(null, {
          success: 0,
          message: 'BANISHED USER'
        })
        return
      }
      if (type === 'confirmation' && user.confirmed) {
        callback(null, {
          success: 0,
          message: 'CONFIRMED USER'
        })
        return
      }
      const authToken = jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
      switch(type) {
        case 'password':
          userController.sendEmailPasswordReset(user, authToken)
        break;
        case 'username':
          userController.sendEmailAskUsername(user, authToken)
        break
        case 'confirmation':
          userController.sendEmailConfirmation(user, authToken)
        break;
      }
      callback(null, {
        success: 1
      })
    })
  },

  passwordreset: function(username, token, password, callback) {
    jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
      if (err) {
        callback(null, {
          success: 0,
          message: 'BAD TOKEN'
        })
        return
      }
      if (decoded.username !== username) {
        callback(null, {
          success: 0,
          message: 'BAD TOKEN'
        })
        return
      }
      User.findOne({username: username}, function(err, user) {
        if (err) {
          callback(err, null)
          return
        }
        if (!user) {
          callback(null, {
            success: 0,
            message: 'USER NOT FOUND'
          })
          return
        }
        if (user.banished) {
          callback(null, {
            success: 0,
            message: 'BANISHED USER'
          })
          return
        }
        if (!user.confirmed) {
          callback(null, {
            success: 0,
            message: 'UNCONFIRMED USER'
          })
          return
        }
        user.comparePassword(password, function (err, isMatch) {
          if (err) {
            callback(err, null)
            return
          }
          if (isMatch) {
            callback(null, {
              success: 1,
            })
            return
          }
          user.password = password
          user.save(function(err, user) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, {
              success: 1,
            })
          })
        })
      })
    })
  },
}
