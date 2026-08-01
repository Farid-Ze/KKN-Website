<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-header/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE 4 HEADER METHODS & TEMPLATE VIA MCP CHROME]
-->
<template>
  <header class="c-header u-absolute u-pos-tl u-fit-w u-pad-x-w1of12 u-flex u-space-between u-valign-items u-marg-t-vh1of12 u-marg-t-md@sm">
    <router-link to="/" class="c-header__logo t-link u-inline-block">
      <img :src="'/assets/medias/images/logo-citrix-clear.svg'" class="u-inline-block">
    </router-link>

    <div class="u-inline-block">
      <button class="c-header__btn-sound t-btn u-inline-block u-valign-middle u-vacuum" :class="{ 'is-muted': isMuted }" @click="onToggleSound" @mouseenter="onBtnNavOver">
        <div class="u-inline-block u-valign-middle u-marg-r-sm u-hide@sm">
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
        </div>
        <span class="t-text--xs t-text--ls-xxs t-text--black u-inline-block u-uppercase u-valign-middle">Sound</span>
      </button>

      <button class="c-header__btn-menu t-btn u-relative u-inline-block u-valign-middle u-vacuum" @click="onToggleNav" @mouseenter="onBtnNavOver">
        <div class="c-header__btn-menu__dot u-inline-block u-bg--white"></div>
        <div class="c-header__btn-menu__dot u-inline-block u-bg--white"></div>
        <div class="c-header__btn-menu__dot u-inline-block u-bg--white"></div>
        <div class="c-header__btn-menu__bar u-absolute u-pos-center u-inline-block"></div>
        <div class="c-header__btn-menu__bar u-absolute u-pos-center u-inline-block"></div>
        <div class="c-header__btn-menu__circle u-absolute u-shape-circle"></div>
        <div class="c-header__btn-menu__content u-absolute u-pos-tl u-backface-hidden u-hide@sm">
          <p class="c-header__btn-menu__content__label t-text--xs t-text--ls-xxs t-text--black u-absolute u-pos-tl u-uppercase u-force-inline">
            <span class="c-header__btn-menu__content__label__word u-inline-block">Open</span>
            <span class="c-header__btn-menu__content__label__word u-inline-block">Menu</span>
          </p>
          <p class="c-header__btn-menu__content__label t-text--xs t-text--ls-xxs t-text--black u-absolute u-pos-tl u-uppercase u-force-inline">
            <span class="c-header__btn-menu__content__label__word u-inline-block">Close</span>
            <span class="c-header__btn-menu__content__label__word u-inline-block">Menu</span>
          </p>
        </div>
      </button>
    </div>
  </header>
</template>

<script>
import globalData from '../../application/global.json';
import { eventHub } from '../../mixins/eventHub';

export default {
  name: 'app-header',
  props: {
    slideIndex: { type: Number, default: 0 },
    isMuted: { type: Boolean, default: false }
  },
  data: function() {
    return {
      content: globalData,
      eventHub: eventHub
    };
  },
  methods: {
    onToggleNav: function() {
      if (this.$root && this.$root.isModalActive) {
        this.$emit('toggle:modal');
      } else {
        this.$emit('toggle:nav');
      }
    },
    onToggleSound: function() {
      this.$emit('toggle:sound');
    },
    onToggleBottomSlide: function() {
      this.$emit('toggle:bottomSlide');
    },
    onBtnNavOver: function() {
      if (this.eventHub) {
        this.eventHub.$emit('sound:play', 'nav-over');
      }
    }
  }
};
</script>
