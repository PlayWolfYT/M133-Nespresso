<template>
  <div>
    <h3>{{ $t("tags.claim.title") }}</h3>

    <table class="table table-dark table-striped mx-auto">
      <thead>
        <tr>
          <th>Tag</th>
          <th>{{ $t("tags.claim.date") }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="unclaimed_tags.length > 0">
        <tr
          v-for="tag in unclaimed_tags"
          :key="tag.cup_id"
          class="align-middle"
        >
          <td>{{ tag.cup_id }}</td>
          <td>{{ formatDate(tag.cup_modify_date) }}</td>
          <td>
            <button @click="claimTag(tag)" class="btn btn-success">
              {{ $t("tags.claim.claim_button") }}
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="3">{{ $t("tags.claim.no_tags") }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="loadTags" class="btn btn-success">
      <font-awesome-icon icon="sync-alt" class="me-1"></font-awesome-icon>
      {{ $t("tags.claim.reload_tags") }}
    </button>
  </div>
</template>

<style scoped></style>

<script>
import { authenticatedGet, authenticatedPost } from "@/utils/Auth.js";
export default {
  name: "ClaimTag",
  data() {
    return {
      unclaimed_tags: [],
    };
  },
  methods: {
    claimTag(tag) {
      authenticatedPost("/nespresso/api/v1/tag/claim/" + tag.cup_id)
        .then(() => {
          this.$toast.fire({
            icon: "success",
            title: this.$t("tags.claim.popup.success.title"),
            text: this.$t("tags.claim.popup.success.body", {
              tag: tag.cup_id,
            }),
          });

          // Update list
          this.loadTags();
        })
        .catch((err) => {
          this.$toast.fire({
            icon: "error",
            title: this.$t("tags.claim.popup.error.title"),
            text: this.$t("tags.claim.popup.error.body", {
              error: this.$t(
                "tags.claim.popup.error." + err.response.data.error
              ),
            }),
          });
        });
    },
    formatDate(timestamp) {
      return new Date(timestamp * 1000).toLocaleString();
    },
    loadTags() {
      authenticatedGet("/nespresso/api/v1/tag/get/unowned").then((res) => {
        this.unclaimed_tags = res.data;
      });
    },
  },
  mounted() {
    this.loadTags();
  },
};
</script>
