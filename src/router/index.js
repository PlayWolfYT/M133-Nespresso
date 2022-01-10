import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Stats from "../views/Stats.vue";
import Login from "../views/Login.vue";
import Donate from "../views/Donate.vue";
import Setup from "../views/Setup.vue";
import DonateMessage from "../views/donate/DonateMessage.vue";
import DonatePayment from "../views/donate/DonatePayment.vue";
import { isLoggedIn } from "../utils/Auth.js";
import axios from "axios";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/stats",
    name: "Stats",
    component: Stats,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/donate",
    name: "Donate",
    component: Donate,
  },
  {
    path: "/donate/message",
    name: "DonateMessage",
    component: DonateMessage,
    props: true,
  },
  {
    path: "/donate/payment",
    name: "DonatePayment",
    component: DonatePayment,
    props: true,
  },
  {
    path: "/logout",
    name: "Logout",
    component: {
      beforeRouteEnter(_to, _from, next) {
        localStorage.removeItem("auth");
        next({ name: "Home" }, () => {});
        location.reload();
      },
    },
  },
  {
    path: "/setup",
    name: "Setup",
    component: Setup,
    beforeEnter: (_to, _from, next) => {
      axios
        .get("/nespresso/api/v2/setup")
        .then((res) => {
          if (res.data.error) {
            next(false);
            alert("API-Communication failed. Please try again later.");
            return;
          } else {
            if (res.data.setup) {
              // Send user to setup page.
              next();
            } else {
              next({ name: "Home" });
            }
          }
        })
        .catch(() => {
          next(false);
          alert("API-Communication failed. Please try again later.");
          return;
        });
    },
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

/***  AUTH MIDDLEWARE  ***/
router.beforeEach((to, _from, next) => {
  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    // Check for login
    if (!isLoggedIn()) {
      // User is not logged in. send to login page
      next({ name: "Login", query: { redirect: to.fullPath } }, () => {});
    } else {
      // User is logged in
      next();
    }
  } else {
    next();
  }
});

export default router;
