import JWT from "jsonwebtoken";
import axios from "axios";
require("dotenv").config();

function isLoggedIn() {
  return localStorage.getItem("auth") != undefined;
}

function logout() {
  localStorage.removeItem("auth");
}

function login(token) {
  localStorage.setItem("auth", token);
}

function getUserToken() {
  if (isLoggedIn()) {
    return localStorage.getItem("auth");
  } else return undefined;
}

function getUserData() {
  if (isLoggedIn()) {
    let tokenData = JWT.decode(getUserToken());
    return tokenData || undefined;
  } else return undefined;
}

function authenticatedGet(url) {
  return axios
    .get(url, {
      headers: { Authorization: "nespresso_token " + getUserToken() },
    })
    .then((res) => {
      if (res.headers.authorization) {
        // JWT was renewed, update the current jwt
        login(res.headers.authorization);
      }

      return res;
    });
}

function authenticatedPost(url, data = undefined) {
  return axios
    .post(url, data, {
      headers: { Authorization: "nespresso_token " + getUserToken() },
    })
    .then((res) => {
      if (res.headers.authorization) {
        // JWT was renewed, update the current jwt
        login(res.headers.authorization);
      }

      return res;
    });
}

const AuthMixin = {
  methods: {
    isLoggedIn,
    logout,
    login,
    getUserToken,
    getUserData,
    authenticatedGet,
    authenticatedPost,
  },
};

export {
  isLoggedIn,
  logout,
  login,
  getUserToken,
  getUserData,
  authenticatedGet,
  authenticatedPost,
  AuthMixin,
};
