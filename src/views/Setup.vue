<template>
  <div>
    <h1>SETUP</h1>
    <form @submit.prevent="setup">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          class="form-control"
          type="text"
          v-model="username"
        /><br />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input class="form-control" type="password" v-model="password" /><br />
      </div>
      <button class="btn btn-primary" type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped></style>

<script>
import axios from "axios";
export default {
  name: "Setup",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    setup() {
      axios
        .post("/nespresso/api/v1/setup/createUser", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.data.success) {
            this.$toast.fire({
              icon: "success",
              title: this.$t("setup.popup.success.title"),
              text: this.$t("setup.popup.success.body", {
                username: this.username,
              }),
            });
            this.$router.push({ name: "Login" });
          }
        })
        .catch((err) => {
          this.$toast.fire({
            icon: "error",
            title: this.$t("setup.popup.error.title"),
            text: this.$t("setup.popup.error.body", {
              error: err,
            }),
          });
        });
    },
  },
};
</script>
