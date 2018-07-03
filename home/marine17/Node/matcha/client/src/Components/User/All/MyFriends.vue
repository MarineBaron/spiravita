<template>
    <b-card v-if="friends.length" class="card my-4">
      <b-row class="text-center"
      >
        <b-col>
        <h5>{{ title }} {{ username.toUpperCase() }}</h5>
        </b-col>
      </b-row>
      <b-row class="text-center">
        <b-col md="6" class="p-4" v-for="user in friends" :key="user.username">
          <b-link :to="{path: '/user/' + user.username}">
          {{user.username}}   </b-link>
          <b-img v-if="user.avatar" :src="'http://localhost:5000/images/' + user.avatar.image.name" fluid alt="user.avatar" />
        </b-col>
      </b-row>
    </b-card>

</template>
<script>
  import { USER_FRIENDS_REQUEST } from '../../../Store/user/mutation-types'
  import { mapGetters, mapState } from 'vuex'

  export default {
    components: {},
    props: ['username'],
    data() {
      return {
        title: 'Les Amis de ',
        friends: [],
        error: '',
      }
    },

    methods: {
      onClick(e) {

      }
    },
    mounted() {
      this.$store.dispatch(USER_FRIENDS_REQUEST, this.username)
      .then((response) => {
        console.log(response)
          this.friends = response ? response : []
      }, (error) => {
          console.log(error)
      })
    }
  }
</script>
