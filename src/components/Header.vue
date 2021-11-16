<template>
  <nav class="navbar navbar-expand-lg navbar-sticky-top navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Nespresso</router-link>
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
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" v-slot="{ href, navigate, isActive }">
              <a
                :href="href"
                @click="navigate"
                class="nav-link"
                :class="{ active: isActive }"
                >Home</a
              >
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/A" v-slot="{ href, navigate, isActive }">
              <a
                :href="href"
                @click="navigate"
                class="nav-link"
                :class="{ active: isActive }"
                >Test</a
              >
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Pricing</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown link
            </a>
            <ul
              class="dropdown-menu dropdown-menu-dark"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>

<script>
export default {
  name: "Header",
};
</script>
