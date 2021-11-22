import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Stats from "../views/Stats.vue";
import Login from "../views/Login.vue";
import Donate from "../views/Donate.vue";

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
];

const router = new VueRouter({
  routes,
  mode: "history",
});

/***  AUTH MIDDLEWARE  ***/
router.beforeEach((to, _from, next) => {
  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    // Check for login
    const token = localStorage.getItem("auth");
    if (!token) {
      // User is not logged in. send to login page
      next({ name: "Login", query: { redirect: to.fullPath } });
    } else {
      // User is logged in

      // Validate JWT

      next();
    }
  } else {
    next();
  }
});

export default router;
