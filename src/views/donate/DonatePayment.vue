<template>
  <div class="row">
    DonatePayment
    <br /><br />
    <div ref="paypal"></div>
    <button class="btn btn-secondary" @click="onPaymentAccept">
      BYPASS BUTTON FOR TESTING
    </button>
  </div>
</template>

<style scoped></style>

<script>
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
    onPaymentAccept(data = undefined, actions = undefined) {
      console.log(data, actions);
      console.log("Payment accepted");
      console.log(this.selectedUser.user_name);
      this.$swal.fire({
        title: this.$t("donate.popup.confirmation.title"),
        html: this.$t("donate.popup.confirmation.body", {
          name: this.selectedUser.user_name,
        }),
      });
    },
    onPaymentError(err) {
      console.log(err);
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
