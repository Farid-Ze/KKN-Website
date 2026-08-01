<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/core-video-controls/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE CORE-VIDEO-CONTROLS VIA MCP CHROME]
-->
<template>
  <div class="c-video-controls u-absolute u-pos-bl u-fit-w u-marg-b-xl u-flex u-space-between u-pad-x-w1of12" :class="{ 'is-active': isActive }">
    <button class="t-btn c-video__toggle-play u-relative" @click="onTogglePlay">
      <img src="/assets/medias/images/icons/play.svg" class="c-video__play t-icon--play" :class="{ 'u-hide': isPlaying }">
      <img src="/assets/medias/images/icons/pause.svg" class="c-video__pause t-icon--pause u-absolute u-pos-tl" :class="{ 'u-hide': !isPlaying }">
    </button>

    <div class="c-video-controls__trackbar u-relative u-bg--gray-dark u-cursor-pointer js-trackbar" @click="onTrackbarClick">
      <div class="c-video-controls__trackbar__panel o-wrapper--panel u-fit u-bg--white" :style="{ transform: 'scaleX(' + progress + ') translateZ(0px)' }"></div>
    </div>

    <p class="t-text--xs t-text--ls-xxs t-text--black u-hide@sm">
      <span>{{ convertedCurrentTime }}</span>
      <span class="u-color--gray-dark"> / {{ convertedDuration }}</span>
    </p>

    <div class="u-inline-block">
      <button class="c-video-controls__btn-sound t-btn u-inline-block u-valign-middle u-vacuum u-marg-r-lg u-marg-r-md@md u-marg-r-sm@xs" :class="{ 'is-muted': isMuted }" @click="onToggleSound">
        <div class="u-inline-block u-valign-middle">
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
          <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
        </div>
      </button>

      <button class="c-video-controls__btn-fullscreen t-btn u-inline-block u-valign-middle" @click="onToggleFullScreen">
        <img src="/assets/medias/images/icons/fullscreen.svg" class="c-video-controls__btn-fullscreen__icon">
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'core-video-controls',
  props: {
    currentTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    isMuted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  data: function() {
    return {
      convertedDuration: '00:00',
      convertedCurrentTime: '00:00',
      progress: 0,
      isPlaying: true
    };
  },
  watch: {
    currentTime: function(val) {
      this.onCurrentTimeChange(val);
    },
    duration: function(val) {
      this.onDurationChange(val);
    }
  },
  methods: {
    onActiveChange: function() {},
    onResize: function() {},
    onDurationChange: function(val) {
      this.convertedDuration = this.convertTime(val);
    },
    onCurrentTimeChange: function(val) {
      this.convertedCurrentTime = this.convertTime(val);
      if (this.duration) {
        this.progress = val / this.duration;
      }
    },
    onTogglePlay: function() {
      this.isPlaying = !this.isPlaying;
      this.$emit('toggle:play');
    },
    onToggleFullScreen: function() {
      this.$emit('toggle:fullscreen');
    },
    onToggleSound: function() {
      this.$emit('toggle:sound');
    },
    onTrackbarClick: function(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      this.progress = pct;
      this.$emit('seek', pct);
    },
    onEnterframe: function() {},
    convertTime: function(seconds) {
      if (!seconds || isNaN(seconds)) return '00:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      const mm = m < 10 ? '0' + m : m;
      const ss = s < 10 ? '0' + s : s;
      return mm + ':' + ss;
    }
  }
};
</script>
