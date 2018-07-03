import {
  AUTH_CHECKAUTH_REQUEST,
  AUTH_CHECKAUTH_ERROR,
  AUTH_CHECKAUTH_SUCCESS,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_PROFILE_REQUEST,
  AUTH_PROFILE_ERROR,
  AUTH_PROFILE_SUCCESS,
  AUTH_CONFIRM_REQUEST,
  AUTH_CONFIRM_ERROR,
  AUTH_CONFIRM_SUCCESS,
  AUTH_ASK_REQUEST,
  AUTH_ASK_ERROR,
  AUTH_ASK_SUCCESS,
  AUTH_PASSWORD_RESET_REQUEST,
  AUTH_PASSWORD_RESET_ERROR,
  AUTH_PASSWORD_RESET_SUCCESS,
  AUTH_NOTIFICATION_DELETE,
  AUTH_VISITADD,
  AUTH_RELATION_REQUEST,
  AUTH_RELATION_SUCCESS,
  AUTH_RELATION_ERROR,
  AUTH_RELATION_OTHER,
  AUTH_NOTIFICATION_INSERT,
} from './mutation-types'
import {
  USER_USER_SUCCESS
} from '../user/mutation-types'
import mockApi from '../../Api/mockApi'
import callApi from '../../Api/callApi'
import Vue from 'vue'

function removeLocalStorage() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
}

function removeSessionStorage() {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('username')
}

function removeStorage() {
  removeLocalStorage()
  removeSessionStorage()
}

const state = {
  status: '',
  token: '',
  username: '',
  profile: {},
  hasLoadedOnce: sessionStorage.getItem('token') ? true : false,
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  getProfile: state => state.profile,
  getUsername: state => !state.profile.username ? '' : state.profile.username,
  isProfileLoaded: state => !!state.profile.username
}

const actions = {
  [AUTH_CHECKAUTH_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_CHECKAUTH_REQUEST)
      // si l'utilisateur a un token, on tente de récupérer son profil
      if (state.token) {
        callApi.defaults.headers.common['Authorization'] = state.token
        dispatch(AUTH_PROFILE_REQUEST)
        .then((resp) => {
          commit(AUTH_CHECKAUTH_SUCCESS)
          resolve()
        }, (error) => {
          commit(AUTH_CHECKAUTH_ERROR)
          reject()
        })
      } else {
        resolve()
      }
    })
  },
  [AUTH_LOGIN_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGIN_REQUEST)
      // enregistrement du remember_me en localStorage
      if (user.remember_me) {
        localStorage.setItem('remember_me', true)
      } else {
        localStorage.removeItem('remember_me')
        removeLocalStorage()
      }
      callApi({url: 'auth/login', data: user, method: 'POST'})
      .then((resp, err) => {
        if (!resp.data.success) {
          commit(AUTH_LOGIN_ERROR)
          // suppression des variables dans les storages
          removeStorage()
          reject(resp.data.message)
        } else {
          const data = resp.data
          // enregistrement des variables dans les storages
          sessionStorage.setItem('token', data.token)
          if (localStorage.getItem('remember_me')) {
            localStorage.setItem('token', data.token)
          }
          callApi.defaults.headers.common['Authorization'] = data.token
          commit(AUTH_LOGIN_SUCCESS, data.token)
          dispatch(AUTH_PROFILE_REQUEST)
          resolve(resp)
        }
      })
      .catch((err) => {
        commit(AUTH_LOGIN_ERROR)
        // suppression des variables dans les storages
        removeStorage()
        reject(err)
      })
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}, username) => {
    return new Promise((resolve, reject) => {
      callApi({url: '/auth/logout', data: {username: username}, method: 'POST'})
      .then((resp) => {
        commit(AUTH_LOGOUT)
        // suppression des variables dans les storages
        removeStorage()
        resolve()
      }, (err) => {
        reject()
      })
    })
  },
  [AUTH_PROFILE_REQUEST]: ({commit, dispatch}) => {
    commit(AUTH_PROFILE_REQUEST)
    return new Promise((resolve, reject) => {
      callApi({url: 'auth/profile'})
      .then(resp => {
        // enregistrement des variables dans les storages
        const username = resp.data.data.username
        sessionStorage.setItem('username', username)
        if (localStorage.getItem('remember_me')) {
          localStorage.setItem('username', username)
        }
        commit(AUTH_PROFILE_SUCCESS, resp.data.data)
        commit(USER_USER_SUCCESS, resp.data.data)
        resolve()
      }, err => {
        commit(AUTH_PROFILE_ERROR)
        // suppression des variables dans les storages
        removeStorage()
        dispatch(AUTH_LOGOUT)
        reject()
      })
    })
  },
  [AUTH_CONFIRM_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_CONFIRM_REQUEST)
      callApi({url: 'auth/confirm', data, method: 'POST'})
      .then((resp) => {
        if (resp.data.success === 0) {
          let message = ''
          switch(resp.message) {
            case 'BAD TOKEN':
              message = 'Votre token est invalide.'
            break;
            case 'BAD USERNAME':
              message = 'Votre token ne correspond pas à votre pseudo.'
            break;
            case 'USER NOT FOUND':
              message = 'Votre pseudo ne correspond à aucun utilisateur enregistré.'
            break;
            default :
              message = 'La confirmation de votre inscription a échoué.'
            break;
          }
          commit(AUTH_CONFIRM_ERROR)
          reject(message)
        } else {
          commit(AUTH_CONFIRM_SUCCESS)
          resolve(resp)
        }
      }, (error) => {
          commit(AUTH_CONFIRM_ERROR)
          reject(message)
      })
      .catch(err => {
        commit(AUTH_CONFIRM_ERROR)
        reject(err)
      })
    })
  },
  [AUTH_ASK_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_ASK_REQUEST)
      callApi({url: 'auth/ask', data, method: 'POST'})
      .then((resp) => {
        if (!resp.data.success) {
          commit(AUTH_ASK_ERROR)
          reject(resp.data.message)
        }
        commit(AUTH_ASK_SUCCESS)
        resolve(resp)
      }, (error) => {
        commit(AUTH_ASK_ERROR)
        reject(error)
      })
      .catch(err => {
        commit(AUTH_ASK_ERROR)
        reject(error)
      })
    })
  },
  [AUTH_PASSWORD_RESET_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_PASSWORD_RESET_REQUEST)
      callApi({url: 'auth/passwordreset', data, method: 'POST'})
      .then((resp) => {
        if (!resp.data.success) {
          commit(AUTH_PASSWORD_RESET_ERROR)
          reject(resp.data.message)
        }
        commit(AUTH_PASSWORD_RESET_SUCCESS)
        resolve(resp)
      }, (error) => {
        commit(AUTH_PASSWORD_RESET_ERROR)
        reject(error)
      })
      .catch(err => {
        commit(AUTH_PASSWORD_RESET_ERROR)
        reject(error)
      })
    })
  },
  [AUTH_RELATION_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_RELATION_REQUEST)
      callApi({url: 'user/relation', data: data, method: 'POST'})
      .then((resp) => {
        if (!resp.data.success) {
          commit(AUTH_RELATION_SUCCESS)
          reject(resp.data.message)
        } else {
          commit(AUTH_RELATION_SUCCESS, resp.data.data)
          resolve(resp)
        }
      }, (err) => {
        commit(AUTH_RELATION_ERROR)
        reject(err)
      })
    })
  },
}

const mutations = {
  [AUTH_CHECKAUTH_REQUEST]: (state) => {
    state.status = 'loading'
    state.token = sessionStorage.getItem('token')
        ? sessionStorage.getItem('token')
        : (localStorage.getItem('token') ? localStorage.getItem('token') : '')
    state.username = sessionStorage.getItem('username')
        ? sessionStorage.getItem('username')
        : (localStorage.getItem('username') ? localStorage.getItem('username') : '')
  },
  [AUTH_CHECKAUTH_SUCCESS]: (state) => {
    state.status = 'success'
    //Vue.set(state, 'token', token)
    state.hasLoadedOnce = true
  },
  [AUTH_CHECKAUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGIN_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_LOGIN_SUCCESS]: (state, token) => {
    state.status = 'success'
    Vue.set(state, 'token', token)
    state.hasLoadedOnce = true
  },
  [AUTH_LOGIN_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
  },
  [AUTH_PROFILE_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_PROFILE_SUCCESS]: (state, data) => {
    state.status = 'success'
    Vue.set(state, 'profile', {
      username: data.username,
      role: data.role,
      visited: data.visited,
      is_completed: data.is_completed,
      //visibility: data.visibility,
      likes: data.likes,
      likers: data.likers,
      friends: data.friends,
      notifications: data.notifications
    })
  },
  [AUTH_PROFILE_ERROR]: (state) => {
    state.status = 'error'
    state.profile = {}
  },
  [AUTH_CONFIRM_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_CONFIRM_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [AUTH_CONFIRM_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_ASK_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_ASK_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [AUTH_ASK_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_PASSWORD_RESET_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_PASSWORD_RESET_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [AUTH_PASSWORD_RESET_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_NOTIFICATION_DELETE]: (state, id) => {
    state.profile.notifications.splice(state.profile.notifications.findIndex(n => n._id === id), 1)
  },
  [AUTH_VISITADD]: (state) => {
    state.profile.visited++
  },
  [AUTH_RELATION_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_RELATION_SUCCESS]: (state, data) => {
    state.status = 'success'
    if (data) {
      switch(data.action) {
        case 'like':
          state.profile.likes.push(data.receptor)
        break
        case 'relike':
          state.profile.likers.splice(state.profile.likers.findIndex(u => u.username === data.receptor.username), 1)
          state.profile.friends.push(data.receptor)
        break
        case 'unlike':
          const index = state.profile.friends.findIndex(u => u.username === data.receptor.username)
          // s'il est mon ami, on l'enleve des amis, et on le mets dans la liste des likers
          if (index != -1) {
            state.profile.friends.splice(index,1)
            state.profile.likers.push(data.receptor)
          // sinon on l'enleve des likes
          } else {
            state.profile.likes.splice(state.profile.likes.findIndex(u => u.username === data.receptor.username), 1)
          }
        break
      }
    }
  },
  [AUTH_RELATION_OTHER]: (state, data) => {
    state.status = 'success'
    if (data) {
      let index
      switch(data.action) {
        case 'like':
          index = state.profile.likes.findIndex(u => u.username === data.actor.username)
          // si je l'aimais, il devient mon ami
          if (index != -1) {
            state.profile.likes.splice(index, 1)
            state.profile.friends.push(data.actor)
          // sinon, il m'aime
          } else {
            state.profile.likers.push(data.actor)
          }
        break
        case 'relike':
          state.profile.likes.splice(state.profile.likes.findIndex(u => u.username === data.actor.username), 1)
          state.profile.friends.push(data.actor)
        break
        case 'unlike':
          index = state.profile.friends.findIndex(u => u.username === data.actor.username)
          // s'il est mon ami, on l'enleve des amis, et on le mets dans la liste des likes
          if (index != -1) {
            state.profile.friends.splice(index, 1)
            state.profile.likes.push(data.actor)
          // sinon on l'enleve des likers
          } else {
            state.profile.likers.splice(state.profile.likers.findIndex(u => u.username === data.actor.username), 1)
          }
        break
      }
    }
  },
  [AUTH_RELATION_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_NOTIFICATION_INSERT]: (state, data) => {
    state.profile.notifications.splice(0, 0, data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
