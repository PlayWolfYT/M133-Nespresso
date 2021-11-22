<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
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
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <div class="w-100 row">
          <ul class="navbar-nav col-11 justify-content-center px-0">
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
          <ul class="navbar-nav col-1 justify-content-end px-0">
            <!-- Language Selection -->
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
    </div>
  </nav>
</template>

<style scoped></style>

<script>
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
  },
};
</script>
