<template>
  <footer class="footer mt-auto py-3 bg-dark">
    <div class="container d-flex justify-content-between">
      <span
        class="text-white opacity-50"
        v-html="$t('footer.copyright')"
      ></span>
      <span class="text-white opacity-50">{{ $t("footer.author") }}</span>
    </div>
  </footer>
</template>

<style scoped></style>

<script>
export default {};
</script>
