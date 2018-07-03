import {
  CHAT_OPEN_ROOM_REQUEST,
  CHAT_OPEN_ROOM_ERROR,
  CHAT_OPEN_ROOM_SUCCESS,
  CHAT_SEND_MESSAGE_REQUEST,
  CHAT_SEND_MESSAGE_ERROR,
  CHAT_SEND_MESSAGE_SUCCESS,
  CHAT_CLOSE_ROOM,
  CHAT_CLOSE_ALLROOMS,
  CHAT_WATCH_ROOM,
  CHAT_WATCH_ALLROOMS,
  CHAT_UNWATCH_ROOM,
  CHAT_UNWATCH_ALLROOMS,
  CHAT_ADD_MESSAGE,
} from './mutation-types'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
  rooms: []
}

const getters = {
  getRooms: state => state.rooms,
  getActiveRooms: state => state.rooms.filter(r => r.status === 'actived')
}

const actions = {
  [CHAT_OPEN_ROOM_REQUEST]: ({commit, dispatch}, usernames) => {
    return new Promise((resolve, reject) => {
      commit(CHAT_OPEN_ROOM_REQUEST)
      let room = {}
      if (this.rooms && (room = this.rooms.find(room => room.otheruser === usernames[1]))) {
        commit(CHAT_OPEN_ROOM_SUCCESS, usernames[1])
        resolve(room)
      } else {
        const data = {
          username1: usernames[0],
          username2: usernames[1],
        }
        callApi({url: 'chat/room', data: data, method: 'POST'})
        .then((resp) => {
          commit(CHAT_OPEN_ROOM_SUCCESS, resp.data.data)
          resolve(resp.data.data)
        }, (error) => {
          commit(CHAT_OPEN_ROOM_ERROR)
          reject(error)
        })
      }
    })
  },
  [CHAT_SEND_MESSAGE_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(CHAT_SEND_MESSAGE_REQUEST)
      callApi({url: 'chat/message', data: data, method: 'POST'})
      .then((resp) => {
        resp.data.data.username = data.username
        commit(CHAT_SEND_MESSAGE_SUCCESS, resp.data.data)
        resolve(resp.data.data)
      }, (error) => {
        commit(CHAT_SEND_MESSAGE_ERROR)
        reject(error)
      })
    })
  },
  [CHAT_WATCH_ALLROOMS]: ({commit, dispatch}) => {
    commit(CHAT_WATCH_ALLROOMS)
  },
  [CHAT_UNWATCH_ALLROOMS]: ({commit, dispatch}) => {
    commit(CHAT_UNWATCH_ALLROOMS)
  },
  [CHAT_CLOSE_ROOM]: ({commit, dispatch}, room) => {
    commit(CHAT_CLOSE_ROOM, room.otheruser)
    return(room)
  },
  [CHAT_CLOSE_ALLROOMS]: ({commit, dispatch}) => {
    commit(CHAT_CLOSE_ALLROOMS)
  },
  [CHAT_CLOSE_ROOM]: ({commit, dispatch}, room) => {
    commit(CHAT_CLOSE_ROOM, room.otheruser)
    return(room)
  },
  [CHAT_CLOSE_ALLROOMS]: ({commit, dispatch}) => {
    commit(CHAT_CLOSE_ALLROOMS)
  },
  [CHAT_ADD_MESSAGE]: ({commit, dispatch}, data) => {
    commit(CHAT_ADD_MESSAGE, data)
  }
}

const mutations = {
  [CHAT_OPEN_ROOM_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [CHAT_OPEN_ROOM_SUCCESS]: (state, data) => {
    state.status = 'success'
    const otheruser = data.usernames[1]
    let room = state.rooms.find(room => room.otheruser === otheruser)
    if (room) {
      room.status = 'actived'
      room.data = data.room
    }
    else {
      state.rooms.push({
        otheruser: otheruser,
        status: 'actived',
        data: data.room
      })
    }
  },
  [CHAT_OPEN_ROOM_ERROR]: (state) => {
    state.status = 'error'
  },
  [CHAT_SEND_MESSAGE_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [CHAT_SEND_MESSAGE_SUCCESS]: (state, data) => {
    let index = state.rooms.findIndex(r => r.data._id === data.room)
    if (index !== -1) {
      if(!state.rooms[index].data.messages) {
        Vue.set(state.rooms[index].data, 'messages', [])
      }
      Vue.set(state.rooms[index].data.messages, state.rooms[index].data.messages.length, {
        username: data.username,
        message: data.message
      })
    }
    state.status = 'success'
  },
  [CHAT_SEND_MESSAGE_ERROR]: (state) => {
    state.status = 'error'
  },
  [CHAT_WATCH_ALLROOMS]: (state) => {
    state.rooms.forEach(r => {r.status = 'actived'})
  },
  [CHAT_UNWATCH_ALLROOMS]: (state) => {
    state.rooms.forEach(r => {r.status = 'closed'})
  },
  [CHAT_CLOSE_ROOM]: (state, otheruser) => {
    state.status = 'success'
    state.rooms.splice(state.rooms.findIndex(room => room.otheruser === otheruser), 1)
  },
  [CHAT_CLOSE_ALLROOMS]: (state) => {
    state.status = 'success'
    Vue.set(state, 'rooms', [])
  },
  [CHAT_ADD_MESSAGE]: (state, data) => {
    state.status = 'success'
    let index = state.rooms.findIndex(r => r.data._id === data.id)
    if (index !== -1) {
      if (!state.rooms[index].data.messages) {
        Vue.set(state.rooms[index].data, 'messages', [])
      }
      Vue.set(state.rooms[index].data.messages, state.rooms[index].data.messages.length, data.message)
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
