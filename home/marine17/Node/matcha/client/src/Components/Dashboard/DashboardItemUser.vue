<template>
  <div>
    <div class="d-flex justify-content-between">
      <b-img v-if="item.avatar" :src="'http://localhost:5000/images/' + item.avatar.image.name" fluid :alt="item.avatar.alt" />
      <b-link :to="{path: '/user/' + item.username}">{{item.username}}</b-link>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['item'],
  }
</script>
