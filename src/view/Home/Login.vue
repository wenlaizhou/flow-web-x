<template>
  <v-row align="center" justify="center" class="login-view">
    <v-col cols="4">
      <v-card>
        <v-card-title class="justify-center">
          <span class="title font-weight-bold">{{ $t('welcome') }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="email"
              required
              prepend-inner-icon="mdi-account"
          ></v-text-field>

          <v-text-field
              prepend-inner-icon="mdi-key"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="input-group--focused"
              @click:append="showPassword = !showPassword"
          ></v-text-field>

          <span class="error--text caption">{{ error }}</span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn tile
                 block
                 color="primary"
                 @click="onLoginClick">{{ $t('login') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import actions from '@/store/actions'

  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        showPassword: false,
        error: ''
      }
    },
    mounted() {
      this.$store.dispatch(actions.users.hasDefault, {
        onSuccess: this.toCreateDefaultPage
      }).then()
    },
    methods: {
      toCreateDefaultPage(v) {
        if (!v) {
          this.$router.replace('/create')
        }
      },

      onLoginClick() {
        let data = {username: this.email, password: this.password}
        this.$store.dispatch(actions.auth.login, data)
          .then(() => {
            this.$router.replace('/flows')
          })
          .catch((error) => {
            this.error = error.message
          })
      }
    }
  }
</script>

<style lang="scss">
  .login-view {
    .v-input__prepend-inner:after{
      content: '';
      margin-right: 10px;
      position: relative;
    }
  }
</style>
