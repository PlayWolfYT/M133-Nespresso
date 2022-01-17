<template>
  <div id="app">
    <Header />
    <div
      id="content-container"
      class="d-flex align-items-center justify-content-center"
    >
      <transition
        mode="out-in"
        v-bind:enter-class="
          [view_transition.fromHidden ? 'opacity-0' : ''].join(' ')
        "
        enter-active-class="animate__animated"
        leave-active-class="animate__animated"
        :enter-to-class="view_transition.in"
        :leave-to-class="view_transition.out"
        v-on:before-leave="viewTransitionBeforeLeave"
        v-on:after-enter="viewTransitionAfterEnter"
      >
        <router-view id="content" class="text-center"></router-view>
      </transition>
    </div>
    <Footer />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#content-container {
  padding-top: 3.6rem; /* Size of header */
  min-height: 94.2vh; /* Size of actual page content (fill screen minus header and footer) */
}

/* SWEETALERT OVERRIDES */
.swal2-backdrop-show.swal2-center {
  background: rgb(0 0 0 / 50%) !important;
}
</style>

<script>
import $ from "jquery";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      view_transition: {
        mode: "out-in",
        in: "animate__fadeInRight /*animate__faster*/",
        out: "animate__fadeOutLeft /*animate__faster*/",
        fromHidden: true,
      },
    };
  },
  mounted() {
    const locale = localStorage.getItem("locale");
    if (locale) {
      this.$i18n.locale = locale;
    }
  },
  methods: {
    viewTransitionBeforeLeave() {
      $("#app").parent().addClass("overflow-hidden");
    },
    viewTransitionAfterEnter() {
      $("#app").parent().removeClass("overflow-hidden");
    },
  },
};
</script>
