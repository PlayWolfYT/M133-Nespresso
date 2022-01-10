<template>
  <div>
    <h1>SETUP</h1>
    <form @submit.prevent="setup">
      <input type="text" v-model="username" />
      <input type="password" v-model="password" />
      <button type="submit">Submit</button>
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
      toast: this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("click", () => this.$swal.close());
        },
      }),
    };
  },
  methods: {
    setup() {
      axios
        .post("/nespresso/api/v2/setup/createUser", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.data.success) {
            this.toast.fire({
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
          this.toast.fire({
            icon: "error",
            title: this.$t("setup.popup.error.title"),
            text: this.$t("setup.popup.error.body", {
              error: err.response.data,
            }),
          });
        });
    },
  },
};
</script>
