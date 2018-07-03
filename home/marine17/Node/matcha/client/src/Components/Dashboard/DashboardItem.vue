<template>
  <b-list-group-item>
    <dashboard-item-notif v-if="type === 'notifications'" :item="item" />
    <dashboard-item-user v-else :item="item" />
  </b-list-group-item>
</template>

<script>
  import DashboardItemNotif from './DashboardItemNotif.vue'
  import DashboardItemUser from './DashboardItemUser.vue'

  export default {
    components: {
      DashboardItemNotif,
      DashboardItemUser
    },
    props: ['item', 'type']
  }
</script>
