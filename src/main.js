import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import i18n from "./i18n";
import FlagIcon from "vue-flag-icon";
import VueSweetalert2 from "vue-sweetalert2";
import Swal from "sweetalert2";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;

/********** FONTAWESOME ***********/
library.add(faSyncAlt);

Vue.component("font-awesome-icon", FontAwesomeIcon);

/********** BOOTSTRAP **********/

// Import Bootstrap an BootstrapVue CSS files (order is important)
//import "bootstrap/dist/css/bootstrap.css";
//import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/bootstrap-custom.scss";
import "bootstrap/dist/js/bootstrap.bundle.js";

/********** ANIMATE.CSS **********/
import "animate.css";
const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

const animateCSSMixin = {
  methods: {
    animateCSS,
  },
};

Vue.mixin(animateCSSMixin);

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

// Flag Icons
Vue.use(FlagIcon);

// SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css";
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";
Vue.use(VueSweetalert2);

// Authentication mixin
//Vue.use(AuthMixin);

router.vm = vm;

let setupError = false;

axios
  .get("/nespresso/api/v1/setup")
  .then((res) => {
    if (res.data.error) {
      setupError = true;
      alert("API-Communication failed. Please try again later.");
      return;
    } else {
      if (res.data.setup) {
        // Send user to setup page.
        router.push({ name: "Setup" });
      }
    }
  })
  .catch(() => {
    setupError = true;
    alert("API-Communication failed. Please try again later.");
    return;
  });

Vue.prototype.$toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("click", () => Swal.close());
  },
});

const vm = new Vue({
  router,
  i18n,
  render: (h) => {
    if (!setupError) return h(App);
    else return undefined;
  },
}).$mount("#app");
