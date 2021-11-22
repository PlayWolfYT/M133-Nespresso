<template>
  <div class="w-50">
    <div class="login-container py-4 w-100">
      <h2>{{ $t("login.title") }}</h2>
      <form @submit.prevent="login" class="w-75 mx-auto text-start">
        <div class="form-group mb-2 text-danger" v-if="errors.error_name">
          <span>{{ $t("login.errors." + errors.error_name) }}</span>
        </div>
        <div class="form-group mb-2">
          <label for="username">{{ $t("login.form.username") }}</label>
          <input
            type="text"
            name="username"
            id="username"
            v-model="user.username"
            class="form-control"
            :class="{ error: errors.username }"
            :placeholder="$t('login.form.username')"
          />
        </div>
        <div class="form-group mb-4">
          <label for="password">{{ $t("login.form.password") }}</label>
          <input
            type="password"
            name="password"
            id="password"
            v-model="user.password"
            class="form-control"
            :class="{ error: errors.password }"
            :placeholder="$t('login.form.password')"
          />
        </div>
        <div class="form-group mb-2 text-center">
          <button
            type="submit"
            class="btn btn-success bg-gradient w-25 shadow-none"
          >
            {{ $t("login.form.submit") }}
          </button>
        </div>
        <div class="form-group text-center">
          <router-link
            :to="{ name: 'Home' }"
            v-slot="{ href, navigate }"
            custom
            class="btn btn-dark bg-gradient w-25 shadow-none"
          >
            <a :href="href" @click="navigate">
              {{ $t("login.form.back") }}
            </a>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  background-color: #1e2833;
}

.error {
  border-color: var(--bs-danger);
  box-shadow: inset 0px 0px 8px 0px var(--bs-danger);
}
</style>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      errors: {
        username: false,
        password: false,
        error_name: "",
      },
    };
  },
  methods: {
    login() {
      this.errors.username = false;
      this.errors.password = false;
      this.errors.error_name = "";

      axios
        .post("/nespresso/api/v2/login", this.user)
        .then((res) => {
          // Request is okay (Status 200), we should have a token now
          const token = res.data.token;

          localStorage.setItem("auth", token);
          this.$router.push(this.$route.query.redirect || "/");
        })
        .catch((err) => {
          const res = err.response;

          // Check if the login data was incorrect
          if (res.status === 401) {
            this.errors.username = true;
            this.errors.password = true;
            this.errors.error_name = "invalid_data";
          } else {
            this.errors.error_name = "unknown";
          }
        });
    },
  },
};
</script>
