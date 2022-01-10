<template>
  <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'Home' }">
        <img
          src="@/assets/images/logo.jpg"
          alt="Logo"
          height="30px"
          width="30px"
        />
        Nespresso
      </router-link>
      <div>
        <div class="w-100 row">
          <ul class="navbar-nav col-12 justify-content-center px-0">
            <li class="nav-item">
              <router-link
                :to="{ name: 'Donate' }"
                v-slot="{ href, navigate, isExactActive }"
                custom
              >
                <a
                  :href="href"
                  @click="navigate"
                  class="nav-link"
                  :class="{ active: isExactActive }"
                  >{{ $t("nav.donate") }}</a
                >
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                :to="{ name: 'Stats' }"
                v-slot="{ href, navigate, isActive }"
                custom
              >
                <a
                  :href="href"
                  @click="navigate"
                  class="nav-link"
                  :class="{ active: isActive }"
                >
                  {{ $t("nav.stats") }}
                </a>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <ul class="navbar-nav justify-content-end px-0">
          <li class="nav-item" v-if="isLoggedIn()">
            <router-link
              :to="{ name: 'Logout' }"
              v-slot="{ href, navigate }"
              custom
            >
              <a
                :href="href"
                @click="
                  refresh;
                  navigate;
                "
                class="nav-link"
                >{{ $t("nav.logout") }}</a
              >
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav col-1 justify-content-end px-0">
          <li
            class="nav-item d-flex ms-2"
            v-for="language in languages"
            :key="language.code"
            @click="changeLocale(language.code)"
          >
            <flag
              class="align-middle btn"
              :iso="language.flag"
              :title="$t(language.translationKey)"
            ></flag>
          </li>
        </ul>
      </div>
    </div>
  </nav>-->
  <nav
    class="
      navbar navbar-expand-lg navbar-dark
      bg-dark
      fixed-top
      d-flex
      justify-content-between
      px-4
    "
  >
    <div class="navbar-nav col-4 align-items-start">
      <router-link class="navbar-brand" :to="{ name: 'Home' }">
        <img
          src="@/assets/images/logo.jpg"
          alt="Logo"
          height="30px"
          width="30px"
        />
        Nespresso
      </router-link>
    </div>
    <div class="navbar-nav col-4 justify-content-center">
      <ul class="navbar-nav px-0">
        <li class="nav-item">
          <router-link
            :to="{ name: 'Donate' }"
            v-slot="{ href, navigate, isExactActive }"
            custom
          >
            <a
              :href="href"
              @click="navigate"
              class="nav-link"
              :class="{ active: isExactActive }"
              >{{ $t("nav.donate") }}</a
            >
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            :to="{ name: 'Stats' }"
            v-slot="{ href, navigate, isActive }"
            custom
          >
            <a
              :href="href"
              @click="navigate"
              class="nav-link"
              :class="{ active: isActive }"
            >
              {{ $t("nav.stats") }}
            </a>
          </router-link>
        </li>
      </ul>
    </div>

    <!--<button
      class="navbar-toggler ml-auto align-items-end"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNavDropdown"
      aria-controls="navbarNavDropdown"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>-->

    <div
      class="navbar-nav col-4 justify-content-end"
      id="navbarNavDropdown"
    >
      <ul class="navbar-nav">
        <li v-if="isLoggedIn()" class="nav-item">
          <router-link
            :to="{ name: 'Logout' }"
            v-slot="{ href, navigate }"
            custom
            ><a :href="href" @click="navigate" class="nav-link">{{
              $t("nav.logout")
            }}</a></router-link
          >
        </li>
        <li v-if="!isLoggedIn()" class="nav-item">
          <router-link
            :to="{ name: 'Login' }"
            v-slot="{ href, navigate }"
            custom
            ><a :href="href" @click="navigate" class="nav-link">{{
              $t("nav.login")
            }}</a></router-link
          >
        </li>
      </ul>
      <ul class="navbar-nav">
        <li
          class="nav-item d-flex ms-2"
          v-for="language in languages"
          :key="language.code"
          @click="changeLocale(language.code)"
        >
          <flag
            class="align-middle btn"
            :iso="language.flag"
            :title="$t(language.translationKey)"
          ></flag>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped></style>

<script>
import { isLoggedIn } from "@/utils/Auth.js";

export default {
  name: "Header",
  data() {
    return {
      languages: [
        { code: "de", flag: "ch", translationKey: "language.german" },
        { code: "en", flag: "gb", translationKey: "language.english" },
      ],
    };
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("locale", locale);
    },
    isLoggedIn,
  },
};
</script>
