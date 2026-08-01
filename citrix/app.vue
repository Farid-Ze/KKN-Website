<template>
  <div class="c-application u-fixed u-pos-tl u-fit-w u-viewport-fit-h u-color--white is-ready">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.c-application {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #0B101E;
}
</style>
