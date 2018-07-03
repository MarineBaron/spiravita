<template>

  <div>
    <div v-if="isAuthenticated && !isUser" class="float-right">
      <user-button-action v-if="!isLiked && !isFriend"
        type="like"
        :actor="getUsername"
        :receptor="userDest"
      />
      <user-button-action v-if="isLiked||isFriend"
        type="unlike"
        :actor="getUsername"
        :receptor="userDest"
      />
    </div>
    UserPage: {{relation}}
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import callApi from '../../../Api/callApi'
  import Vue from 'vue'
  import store from '../../../Store/store'
  import { NOTIFICATION_CREATE_REQUEST } from '../../../Store/notification/mutation-types'
  import UserButtonAction from '../All/UserButtonAction.vue'

  export default {
    data() {
      return ({
        userDest: this.$route.params.username
      })
    },
    components: {
      UserButtonAction
    },
    mounted() {
      callApi({url: '/user/addvisit/' + this.userDest})
      .then((resp) => {
        this.$socket.emit('USER_VISITADD', this.userDest)
        const notif = {
          username: this.userDest,
          type: 'visit',
          message: this.visitor + ' a visité votre profil.'
        }
        store.dispatch(NOTIFICATION_CREATE_REQUEST, notif)
        .then((response) => {
          this.$socket.emit('NOTIFICATION_SEND', response)
        }, (error) => {
          console.log('UserPage mounted ERROR: ', error)
        })
      }, (err) => {
        console.log(err)
      })
    },
    computed: {
      ...mapGetters([
        'isAuthenticated',
        'getUsername'
      ]),
      ...mapState({
        likes: state => state.auth.profile.likes ? state.auth.profile.likes : [],
        likers: state => state.auth.profile.likers ? state.auth.profile.likers : [],
        friends: state => state.auth.profile.friends ? state.auth.profile.friends : [],
        username: state => this.isAuthenticated ? state.auth.profile.username : '',
      }),
      visitor() {
        return this.isAuthenticated ? this.getUsername : 'Un visiteur anonyme'
      },
      isLiked() {
        return this.likes.find(u => u.username === this.userDest) ? true : false
      },
      isLiker() {
        return this.likers.find(u => u.username === this.userDest) ? true : false
      },
      isFriend() {
        return this.friends.find(u => u.username === this.userDest) ? true : false
      },
      isUser() {
        return this.username === this.userDest
      },
      relation() {
        if (this.isUser === true) {
          return this.username
        }
        if (this.username === this.userDest) {
          return this.username + " : c'est vous !"
        }
        if (this.isFriend === true) {
          return this.userDest + ' est votre ami.'
        }
        if (this.isLiker === true) {
          return this.userDest + ' aimerait devenir votre ami.'
        }
        if (this.isLiked === true) {
          return this.userDest + ', que vous aimez tant !!!'
        }
        return this.userDest
      }
    }
  }
</script>
