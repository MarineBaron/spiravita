<template>
  <div class="float-right">
    <div class="d-flex flex-row" id="dashboard">
      <dashboard-element
        v-for="element in elements"
        :key="element.name"
        :element="element"
        @change-type="changeType"
      />
    </div>
    <b-popover :show.sync="show" target="dashboard" :title="title">
      <dashboard-list v-if="type" :type="type"  @change-type="changeType"/>
    </b-popover>
  </div>
</template>

<script>
  import DashboardElement from './DashboardElement.vue'
  import DashboardList from './DashboardList.vue'
  import { CHAT_ADD_MESSAGE } from '../../Store/chat/mutation-types'
  import { AUTH_VISITADD, AUTH_RELATION_OTHER } from '../../Store/auth/mutation-types'
  import { NOTIFICATION_CREATE_REQUEST,  NOTIFICATION_DELETE_REQUEST} from '../../Store/notification/mutation-types'
  import { mapState } from 'vuex'

  export default {
    components: {
      DashboardElement,
      DashboardList
    },
    data() {
      return ({
        type: '',
        show: false
      })
    },
    methods: {
      changeType(type) {
        this.type = type
      }
    },
    computed: {
      elements() {
        return [
          {
            name: 'notifications',
            color: 'info',
            title: 'Notifications',
            icon: 'bell',
            value: this.nbNotifications
          },
          {
            name: 'visits',
            color: 'info',
            title: 'Visites',
            icon: 'eye',
            value: this.nbVisited
          },
          {
            name: 'likes',
            color: 'info',
            title: 'Je les aime !',
            icon: 'heart',
            value: this.nbLikes
          },
          {
            name: 'likers',
            color: 'info',
            title: "Ils m'aiment !",
            icon: 'heart',
            value: this.nbLikers
          },
          {
            name: 'friends',
            color: 'info',
            title: 'Nous nous aimons',
            icon: 'user',
            value: this.nbFriends
          },
        ]
      },
      title() {
          return this.type === ''
            ? ''
            : this.elements.find(e => e.name === this.type).title
      },
      ...mapState({
        nbNotifications: state => state.auth.profile.notifications ? state.auth.profile.notifications.length : 0,
        nbFriends: state => state.auth.profile.friends ? state.auth.profile.friends.length : 0,
        nbLikers: state => state.auth.profile.likers ? state.auth.profile.likers.length : 0,
        nbLikes: state => state.auth.profile.likes ? state.auth.profile.likes.length : 0,
        nbVisited: state => state.auth.profile.visited ? state.auth.profile.visited : 0,
        rooms: state => state.chat.rooms ? state.chat.rooms : []
      })
    },
    sockets: {
      // reception d'un message
      CHAT_RECEIVE_MESSAGE: function(data) {
        const {room, username, message} = data
        const newMessage = {
          username: username,
          message : message
        }
        this.$store.dispatch(CHAT_ADD_MESSAGE, {id: room, message: newMessage})
      },
      // visite de ma page par un utilisateur
      AUTH_VISITADD: function() {
        this.$store.commit(AUTH_VISITADD)
      },
      // réecption d'une action de relation d'un autre utilisateur
      AUTH_RELATION: function(data) {
        this.$store.commit(AUTH_RELATION_OTHER, data)
      },
      // réception d'une nouvelle notification
      NOTIFICATION_RECEIVE: function(data) {
        // si l'utilisateur est connecté à la room, on supprime le message en BDD
        if (data.type
          && data.type === 'chat'
          && this.rooms.length
          && this.rooms.find(r => r.data._id === data.room && r.status === 'actived')) {
            this.$store.dispatch('NOTIFICATION_DELETE_REQUEST', data._id)
        // sinon on ajoute le messqge à la liste des messages
        } else {
          this.$store.commit('AUTH_NOTIFICATION_INSERT', data)
        }
      }
    }
  }
</script>
