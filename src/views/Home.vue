<template>
  <div>
    <div>
      <h1>{{ $t("home.title") }}</h1>
      <i18n
        :path="isLoggedIn() ? 'home.subtitle.text' : 'home.subtitle.guest'"
        tag="h4"
      >
        <template v-slot:login>
          <router-link
            :to="{ name: 'Login' }"
            v-slot="{ href, navigate }"
            custom
          >
            <a :href="href" @click="navigate">{{
              $t("home.subtitle.login")
            }}</a>
          </router-link>
        </template>
        <template v-slot:donate>
          <router-link
            :to="{ name: 'Donate' }"
            v-slot="{ href, navigate }"
            custom
          >
            <a :href="href" @click="navigate">{{
              $t("home.subtitle.donate")
            }}</a>
          </router-link>
        </template>
      </i18n>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #77a7ed;
}
</style>

<script>
import { isLoggedIn } from "@/utils/Auth.js";

export default {
  name: "Home",
  methods: {
    isLoggedIn,
  },
};
</script>
