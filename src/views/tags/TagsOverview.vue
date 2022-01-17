<template>
  <div>
    <h1>{{ $t("tags.overview.title") }}</h1>
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th>Tag</th>
          <th v-if="isAdmin()">User</th>
          <th>Create</th>
          <th>Modify</th>
          <th><!-- Unclaim--></th>
          <th v-if="isAdmin()"><!-- Delete --></th>
        </tr>
      </thead>
      <tbody v-if="tags.length > 0">
        <tr v-for="tag in tags" :key="tag.cup_id">
          <td>{{ tag.cup_id }}</td>
          <td v-if="isAdmin()">{{ tag.user_name }}</td>
          <td>{{ formatDate(tag.cup_create_date) }}</td>
          <td>{{ formatDate(tag.cup_modify_date) }}</td>
          <td>
            <button class="btn btn-danger" @click="unclaimTag(tag)">
              {{ $t("tags.overview.unclaim_tag") }}
            </button>
          </td>
          <td v-if="isAdmin()">
            <button class="btn btn-danger" @click="deleteTag(tag)">
              {{ $t("tags.overview.delete_tag") }}
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="isAdmin() ? 6 : 4">
            {{ $t("tags.overview.no_tags") }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>

<script>
import { isAdmin, authenticatedGet } from "@/utils/Auth.js";

export default {
  name: "TagsOverview",
  data() {
    return {
      tags: [],
    };
  },
  mounted() {
    authenticatedGet("/nespresso/api/v1/tag/get")
      .then((res) => {
        this.tags = res.data;
        console.log(res.data);
      })
      .catch(() => {
        this.$toast.fire({
          icon: "error",
          title: "Error",
          html: "Error",
        });
      });
  },
  methods: {
    isAdmin,
    formatDate(timestamp) {
      console.log(timestamp);
      return new Date(timestamp * 1000).toLocaleString();
    },
    unclaimTag(tag) {
      console.log("Unclaim " + tag.tag);
    },
    deleteTag(tag) {
      console.log("Delete " + tag.tag);
    },
  },
};
</script>
