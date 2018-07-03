<template>
  <div>
    <b-form-input
      v-model="message"
      type="text"
      placeholder="Entrez votre message"
      @keyup.native="checkKey"
    />
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { CHAT_SEND_MESSAGE_REQUEST } from '../../../../Store/chat/mutation-types'
  import { NOTIFICATION_CREATE_REQUEST } from '../../../../Store/notification/mutation-types'
  import callApi from '../../../../Api/callApi'

  export default {
    props: ['room'],
    data() {
      return {
        message: ''
      }
    },
    methods: {
      checkKey(e) {
        if(this.message.trim().length && e.keyCode === 13) {
          const data = {
            roomId: this.room.data._id,
            otheruser:this.room.otheruser,
            username: this.getProfile.username,
            message: this.message.trim()
          }
          this.message = ''
          // creation du message en BDD
          this.$store.dispatch(CHAT_SEND_MESSAGE_REQUEST, data)
          .then((response) => {
            // envoi du message via socket
            this.$socket.emit('CHAT_SEND_MESSAGE', response)
            // creation de la notification en BDD
            const notif = {
              username: data.otheruser,
              type: 'chat',
              room: data.roomId,
              message: data.username + ' vous a envoyé un message.'
            }
            this.$store.dispatch(NOTIFICATION_CREATE_REQUEST, notif)
            .then((response) => {
              // envoi de la notification
              this.$socket.emit('NOTIFICATION_SEND', response)
            }, (error) => {
              console.log('MessageInput.vue ERROR: ', error)
            })
          }, (error) => {
            console.log('MessageInput.vue ERROR: ', error)
          })
        }
      }
    },
    computed: {
      ...mapGetters([
        'getProfile',
      ])
    }
  }
</script>
