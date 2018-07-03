<template>
  <div>
    <div class="d-flex justify-content-between">
      <small>{{item.created | moment("DD/MM/YY HH:mm")}}</small>
      <b-link @click.prevent="deleteMessage">
        <icon name="trash"></icon>
      </b-link>
    </div>
    <p>{{item.message}}</p>
  </div>
</template>

<script>
  import { NOTIFICATION_DELETE_REQUEST } from '../../Store/notification/mutation-types'
  export default {
    props: ['item'],
    methods: {
      deleteMessage() {
        this.$store.dispatch(NOTIFICATION_DELETE_REQUEST, this.item._id)
      }
    }
  }
</script>
