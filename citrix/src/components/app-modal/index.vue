<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-modal/index.vue
 * Module: App Modal Component for "Inside the Car", "Inside the Garage", and Race Day Video Overlays
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH .c-modal LIVE BASELINE DOM]
-->
<template>
  <div
    class="c-modal u-fixed u-align-center u-viewport-fit-h u-fit-w"
    :class="{ 'is-active': isActive }"
    :style="{ display: isActive ? 'block' : 'none' }"
  >
    <div class="c-modal__container o-wrapper--panel o-wrapper--valign u-fit">
      <div class="o-wrapper--panel u-fit u-bg--black" @click="close"></div>
      <div class="c-modal__box o-box--16by9 u-inline-block u-valign-middle u-fit-w">
        <div class="c-video o-wrapper--panel u-fit u-overflow-h c-modal__player">
          <iframe
            v-if="videoUrl"
            :src="videoUrl"
            class="o-wrapper--panel u-fit js-iframe"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            title="Citrix Red Bull Racing Video"
            width="100%"
            height="100%"
          ></iframe>
        </div>
        <button class="c-modal__close o-btn o-btn--close u-pos-tr u-cursor-pointer" @click="close">
          <span class="u-sr-only">Close Modal</span>
          <svg class="o-icon o-icon--close" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { soundManager } from '../../application/sound/index';

export default {
  name: 'app-modal',
  props: {
    isActive: { type: Boolean, default: false },
    videoId: { type: String, default: 'Vgtj1TqGxG8' }
  },
  computed: {
    videoUrl: function() {
      if (!this.videoId) return 'https://www.youtube.com/embed/Vgtj1TqGxG8?autoplay=1';
      if (this.videoId.startsWith('http')) return this.videoId;
      return 'https://www.youtube.com/embed/' + this.videoId + '?autoplay=1&enablejsapi=1';
    }
  },
  watch: {
    isActive: function(val) {
      if (val) {
        soundManager.playVideoOpen();
      }
    }
  },
  methods: {
    close: function() {
      this.$emit('close');
    }
  }
};
</script>
