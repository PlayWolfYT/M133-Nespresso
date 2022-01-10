<template>
  <div class="row w-25">
    <form @submit.prevent="submitMessage">
      <div class="form-group">
        <label for="user">{{ $t("donate.message.user") }}</label>
        <input
          type="text"
          id="user"
          class="form-control disabled"
          disabled
          :value="selectedUser.user_name"
        />
      </div>
      <div class="form-group position-relative">
        <label for="message"></label>
        <textarea
          class="form-control"
          maxlength="90"
          id="message"
          rows="6"
          :placeholder="$t('donate.message.message')"
          v-model="message"
          @keyup="updateMessageLength"
        ></textarea>
        <span
          class="pull-right label label-default position-absolute px-2"
          id="count_message"
          v-text="message.length + '/90'"
        ></span>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-secondary">SUBMIT</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
}

#count_message {
  background-color: var(--bs-gray);
  bottom: 0.5rem;
  right: 0.5rem;
}
</style>

<script>
export default {
  name: "DonateMessage",
  props: ["selectedUser"],
  data() {
    return {
      message: "",
      messageLength: 0,
      date: new Date().toISOString(),
    };
  },
  mounted() {
    console.log(this.selectedUser);
  },
  methods: {
    submitMessage() {
      console.log(this.selectedUser, this.message, this.date);
      this.$router.push({
        name: "DonatePayment",
        params: { selectedUser: this.selectedUser, message: this.message },
      });
    },
    updateMessageLength() {
      this.messageLength = this.message.length;
    },
  },
};
</script>
