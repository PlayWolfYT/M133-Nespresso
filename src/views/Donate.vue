<template>
  <div class="row">
    <h1>{{ $t("donate.title") }}</h1>

    <!-- TODO: Display list of users -->
    <label for="userList" class="form-label">{{
      $t("donate.input-text")
    }}</label>

    <div class="col-8">
      <table class="table table-striped table-dark">
        <thead>
          <tr>
            <th id="check-col"></th>
            <th class="text-start">{{ $t("donate.username") }}</th>
          </tr>
        </thead>
        <tbody v-if="users_display.length > 0">
          <tr
            v-for="user in users_display"
            :key="user.user_id"
            class="animate__animated user-row"
            :class="{ 'd-none': animation }"
          >
            <td>
              <div class="form-check">
                <input
                  type="radio"
                  class="form-check-input"
                  v-model="selectedUser"
                  :value="user"
                />
              </div>
            </td>
            <td class="text-start">{{ user.user_name }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="2">{{ $t("donate.no_users_available") }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="search-menu col-4">
      <input
        type="text"
        class="form-control mx-0 d-inline mb-3 w-100"
        v-model="search"
        :placeholder="$t('donate.search')"
      />
      <!--<button
        class="btn d-inline"
        :class="{
          'btn-success': selectedUser > 0,
          'btn-secondary disabled': selectedUser == -1,
        }"
        @click="donate"
      >
        <b-icon icon="arrow-right-circle"></b-icon>
      </button>-->
      <button
        class="btn btn-secondary w-100 mx-0 px-0 transition"
        :class="{ disabled: selectedUser === undefined }"
        @click="goToMessage"
      >
        {{ $t("donate.continue") }}
      </button>
      <!--<div
        class="w-100 mx-0 px-0"
        ref="paypal"
        v-show="selectedUser !== undefined"
      ></div>-->
    </div>
  </div>
</template>

<style scoped>
#check-col {
  width: 1%;
}

.search-menu {
  position: sticky;
  top: 50%;
  height: 0;
}

.search-menu div {
  width: 25%;
  margin-left: 4%;
}

.search-menu input {
  width: 70%;
}

.transition {
  transition: 200ms all linear;
}
</style>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "Donate",
  data() {
    return {
      users: [],
      selectedUser: undefined,
      search: "",
      animation: true,
    };
  },
  watch: {
    users: function (newUsers) {
      setTimeout(() => {
        $(".user-row").each(async (index, row) => {
          if (!this.animation) return;
          setTimeout(() => {
            $(row)
              .removeClass("d-none")
              .addClass("animate__animated animate__fadeIn");
          }, index * 15);
        });
      }, newUsers.length / 4);
    },
    search: function () {
      this.animation = false;
    },
  },
  methods: {
    goToMessage() {
      this.$router.push({
        name: "DonateMessage",
        params: {
          selectedUser: this.selectedUser,
        },
      });
    },
  },
  mounted() {
    // Load users from API
    axios.get("/nespresso/api/v2/users/donatable").then((res) => {
      this.users = res.data;
    });
  },
  computed: {
    users_display() {
      return this.users.filter((user) =>
        user.user_name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
};
</script>
