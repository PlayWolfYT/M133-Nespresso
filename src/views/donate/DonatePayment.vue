<template>
  <div class="row justify-content-center">
    <h3>{{ $t("donate.payment.title") }}</h3>
    <br /><br />
    <button class="btn btn-danger w-50 mt-4" @click="onPaymentAcceptBypass">
      BYPASS BUTTON FOR TESTING
    </button>
    <div ref="paypal" class="w-75 mt-4"></div>
  </div>
</template>

<style scoped></style>

<script>
import axios from "axios";

export default {
  name: "DonatePayment",
  props: ["selectedUser", "message"],
  methods: {
    onPayPalLoad() {
      window.paypal
        .Buttons({
          style: {
            color: "blue",
            /*layout: "horizontal",*/
            /*tagline: false,*/
          },
          createOrder: (_data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description:
                    "Nespresso Donation: " + this.selectedUser.user_name,
                  amount: {
                    currency_code: "CHF",
                    value: 0.95,
                  },
                },
              ],
            });
          },
          onApprove: this.onPaymentAccept,
          onError: this.onPaymentError,
        })
        .render(this.$refs.paypal);
    },
    onPaymentAccept() {
      this.$toast.fire({
        title: this.$t("donate.popup.confirmation.title"),
        html: this.$t("donate.popup.confirmation.body", {
          name: this.selectedUser.user_name,
        }),
      });
      this.$router.push({ name: "Home" });
    },
    onPaymentError(err) {
      console.log(err);
    },
    onPaymentAcceptBypass() {
      const { selectedUser, message } = this;
      this.$toast
        .fire({
          icon: "warning",
          title: "BYPASS",
          text: "BYPASSING PAYPAL",
          timer: 1500,
          didOpen: () => {
            axios.post("/nespresso/api/v1/paypal/bypass", {
              selectedUser,
              message,
            });
          },
        })
        .then(() => {
          this.onPaymentAccept();
        });
    },
  },
  mounted() {
    // Load paypal library
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=Aeox0aidvgdnYmxB85w2rnRI6n_imQ6NtGsVbu2aLqHkaVNYN7nsuW1tkY99JGZAk4k7V1ZlVyWUO-4C&currency=CHF";
    script.addEventListener("load", this.onPayPalLoad);
    document.body.appendChild(script);
  },
};
</script>
