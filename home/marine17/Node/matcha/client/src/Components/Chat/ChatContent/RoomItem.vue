<template>
  <b-card
    :header="title"
  >
  <MessageContainer :room="room" />
  <b-button @click.prevent="closeRoom">Quitter</b-button>
  </b-card>
</template>

<script>
  import { mapState } from 'vuex'
  import { CHAT_CLOSE_ROOM, CHAT_ADD_MESSAGE } from '../../../Store/chat/mutation-types'
  import MessageContainer from './Message/MessageContainer.vue'
  import callApi from '../../../Api/callApi'

  export default {
    components: {
      MessageContainer
    },
    props: {
      room: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        title: 'Chat with ' + this.room.otheruser
      }
    },
    methods: {
      closeRoom(e) {
        this.$store.dispatch(CHAT_CLOSE_ROOM, this.room)
        .then((response) => {
          this.$socket.emit('CHAT_QUIT_ROOM', response.data._id)
        }, (error) => {
          console.log(error)
        })
      }
    },
    computed: {
      ...mapState({
        username: state => state.auth.profile.username
      })
    },
    sockets: {
      CHAT_OPEN_ROOM: function(data) {
        const {id, username} = data
        if (id === this.room.data._id) {
          const message = {
            username: 'server',
            message : username === this.username
              ? 'Bienvenue ' + username + ' !'
              : username + ' rejoint le chat.'
          }
          this.$store.dispatch(CHAT_ADD_MESSAGE, {id: id, message: message})
        }
      },
      CHAT_QUIT_ROOM: function(data) {
        const {id, username} = data
        if (id === this.room.data._id) {
          const message = {
            username: 'server',
            message : username === this.username
              ? 'Au revoir ' + username + ' !'
              : username + ' quitte le chat.'
          }
          this.$store.dispatch(CHAT_ADD_MESSAGE, {id: id, message: message})
        }
      }
    }
  }
</script>
