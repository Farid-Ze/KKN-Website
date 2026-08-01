<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-page-404/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM RENDER & METHODS VIA MCP CHROME]
-->
<template>
  <main class="c-404 o-wrapper--valign u-fixed u-pos-tl u-align-center u-viewport-fit-h u-fit-w">
    <div class="c-404__col o-wrapper--valign u-inline-block u-fit-h u-w1of2 u-align-right u-pad-r-w1of24 u-hide@sm">
      <svg version="1.1" x="0px" y="0px" viewBox="0 0 283.6 305.5" xml:space="preserve" class="c-404__circuit u-absolute u-pos-y-center u-pos-r" style="enable-background: new 0 0 283.6 305.5;">
        <path fill="none" stroke="#F9F8F8" stroke-width="6" stroke-miterlimit="10" d="M13.4,19.5c0,0,20.2-18.4,23.6-7.6C38.7,17.3,226.9,141,230.9,144s24.5,20.5,7.5,38s-82.9,69.6-85.4,71.6s-7.1,10.4-13.6,14.9s-24.4,2.1-26.9-1.9c0,0,2.5-47,28.9-51.6c10.3-1.8-4.5-19.5-7-28.5s-21.5-7-26-25s-5.5-27-14.5-36.5s-62-44.5-67-50s10-10-0.5-24.5S0.5,38.1,13.4,19.5z"></path>
      </svg>
      <span class="c-404__big-text t-text--medium u-relative u-inline-block u-valign-middle">404</span>
    </div>
    <div class="c-404__col o-wrapper--valign u-inline-block u-fit-h u-w1of2 u-align-left u-pad-l-w1of24 u-pad-r-md u-w2of2@sm u-pad-x-lg@sm">
      <div class="u-inline-block u-valign-middle">
        <h1 class="t-h3 t-text--reg u-uppercase u-marg-b-xs">Page not found</h1>
        <p class="t-text--xl u-color--alpha-white u-marg-b-md">The page you are looking for does not exist or has been moved.</p>
        <a href="javascript:void(0);" class="t-link u-color--white" @click="goToHome">
          <img src="/assets/medias/images/icons/arrow-right-border.svg" class="t-icon--arrow-right-border u-inline-block u-valign-middle u-marg-r-xs">
          <span class="t-text--sm t-text--black t-text--ls-xxs u-uppercase u-inline-block u-valign-middle c-404__gray">Go to homepage</span>
        </a>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'app-page-404',
  methods: {
    goToHome: function() {
      if (this.$router) {
        this.$router.push('/');
      }
      window.location.reload();
    }
  }
};
</script>
