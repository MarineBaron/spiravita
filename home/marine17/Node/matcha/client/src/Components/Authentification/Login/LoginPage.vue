<template>
  <div>
    <h2>{{title}}</h2>
    <login-form v-if="type==='login'"></login-form>
    <ask-form @change-form="changeForm" :type="type" v-else></ask-form>
    <div>
      <div v-if="type==='login'">
        <b-link @click.prevent="changeForm('password')">
          Mot de passe oublié
          </b-link><br />
        <b-link @click.prevent="changeForm('username')">
          Pseudo oublié
          </b-link><br />
        <b-link @click.prevent="changeForm('confirmation')">
          Nouveau lien de confirmation
          </b-link>
      </div>
      <div v-else>
        <b-link v-if="type!=='login'" @click.prevent="changeForm('login')">
          Retour à la page de Connexion
        </b-link>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import LoginForm from './LoginForm.vue'
  import AskForm from './AskForm.vue'

  export default {
    components: {
      LoginForm,
      AskForm
    },
    data() {
      return {
        title: 'Connexion',
        type: 'login'
      }
    },
    methods: {
      changeForm(type) {
        this.type = type
      }
    }
  }
</script>
