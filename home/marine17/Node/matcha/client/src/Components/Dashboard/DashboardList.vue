<template>
  <b-list-group>
    <dashboard-item v-for="item in items" :key="item.index" :item="item" :type="type"/>
  </b-list-group>
</template>

<script>
  import DashboardItem from './DashboardItem.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      DashboardItem
    },
    props: ['type'],
    computed: {
      items() {
        const user = this.getProfile
        if (!user) {
          return []
        }
        switch (this.type) {
          case 'notifications':
            return user.notifications
          break
          case 'friends':
            return user.friends
          break
          case 'likes':
            return user.likes
          break
          case 'likers':
            return user.likers
          break
          default:
            return []
          break
        }
      },
      ...mapGetters([
        'getProfile'
      ])
    }
  }
</script>
