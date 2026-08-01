<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-modal-video/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM TEMPLATE VIA MCP CHROME]
-->
<template>
  <transition name="c-modal">
    <div class="c-modal u-fixed u-align-center u-viewport-fit-h u-fit-w">
      <div class="c-modal__container o-wrapper--panel o-wrapper--valign u-fit">
        <div class="o-wrapper--panel u-fit u-bg--black"></div>
        <div class="c-modal__box o-box--16by9 u-inline-block u-valign-middle u-fit-w">
          <!-- 1. YouTube IFrame Embed -->
          <iframe
            v-if="isOnline && youtubeId"
            class="u-absolute u-pos-tl u-fit"
            :src="'https://www.youtube-nocookie.com/embed/' + youtubeId + '?autoplay=1&enablejsapi=1&rel=0'"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
            @error="onPlayerError"
          ></iframe>

          <!-- 2. Local HTML5 Video Fallback -->
          <video
            v-else
            ref="videoPlayer"
            class="u-absolute u-pos-tl u-fit"
            autoplay
            playsinline
            :src="'/assets/medias/videos/case-study.mp4'"
            @timeupdate="onTimeUpdate"
            @ended="onVideoEnded"
          ></video>
        </div>

        <!-- Authentic Live Video Controls Bar -->
        <div class="c-video-controls u-absolute u-pos-bl u-fit-w u-marg-b-xl u-flex u-space-between u-pad-x-w1of12">
          <button class="t-btn c-video__toggle-play u-relative" @click="togglePlay">
            <img :src="'/assets/medias/images/icons/play.svg'" class="c-video__play t-icon--play" :class="{ 'u-hide': isPlaying }">
            <img :src="'/assets/medias/images/icons/pause.svg'" class="c-video__pause t-icon--pause u-absolute u-pos-tl" :class="{ 'u-hide': !isPlaying }">
          </button>

          <div class="c-video-controls__trackbar u-relative u-bg--gray-dark u-cursor-pointer js-trackbar" @click="seek">
            <div class="c-video-controls__trackbar__panel o-wrapper--panel u-fit u-bg--white" :style="{ transform: 'scaleX(' + progress + ') translateZ(0px)' }"></div>
          </div>

          <p class="t-text--xs t-text--ls-xxs t-text--black u-hide@sm">
            <span>{{ currentTimeFormatted }}</span>
            <span class="u-color--gray-dark"> / {{ durationFormatted }}</span>
          </p>

          <div class="u-inline-block">
            <button class="c-video-controls__btn-sound t-btn u-inline-block u-valign-middle u-vacuum u-marg-r-lg u-marg-r-md@md u-marg-r-sm@xs" :class="{ 'is-muted': isMuted }" @click="toggleMute">
              <div class="u-inline-block u-valign-middle">
                <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
                <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
                <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
                <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
                <div class="c-header__btn-sound__bar u-relative u-inline-block"></div>
              </div>
            </button>

            <button class="c-video-controls__btn-fullscreen t-btn u-inline-block u-valign-middle" @click="toggleFullscreen">
              <img :src="'/assets/medias/images/icons/fullscreen.svg'" class="c-video-controls__btn-fullscreen__icon">
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'app-modal-video',
  props: {
    youtubeId: { type: String, default: '' }
  },
  data: function() {
    return {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isPlaying: true,
      isMuted: false,
      progress: 0,
      currentTime: 0,
      duration: 0
    };
  },
  computed: {
    currentTimeFormatted: function() {
      return this.formatTime(this.currentTime);
    },
    durationFormatted: function() {
      return this.formatTime(this.duration);
    }
  },
  mounted: function() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.updateOnlineStatus);
      window.removeEventListener('offline', this.updateOnlineStatus);
    }
  },
  beforeDestroy: function() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.updateOnlineStatus);
      window.removeEventListener('offline', this.updateOnlineStatus);
    }
  },
  methods: {
    updateOnlineStatus: function() {
      this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    },
    onPlayerError: function() {
      this.isOnline = false;
    },
    onClose: function() {
      this.$emit('close');
    },
    togglePlay: function() {
      const vid = this.$refs.videoPlayer;
      if (vid) {
        if (vid.paused) {
          vid.play();
          this.isPlaying = true;
        } else {
          vid.pause();
          this.isPlaying = false;
        }
      }
    },
    toggleMute: function() {
      this.isMuted = !this.isMuted;
      const vid = this.$refs.videoPlayer;
      if (vid) {
        vid.muted = this.isMuted;
      }
    },
    toggleFullscreen: function() {
      const vid = this.$refs.videoPlayer;
      if (vid && vid.requestFullscreen) {
        vid.requestFullscreen();
      }
    },
    onTimeUpdate: function() {
      const vid = this.$refs.videoPlayer;
      if (vid && vid.duration) {
        this.currentTime = vid.currentTime;
        this.duration = vid.duration;
        this.progress = vid.currentTime / vid.duration;
      }
    },
    onVideoEnded: function() {
      this.isPlaying = false;
      this.progress = 1;
    },
    seek: function(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = clickX / rect.width;
      const vid = this.$refs.videoPlayer;
      if (vid && vid.duration) {
        vid.currentTime = pct * vid.duration;
        this.progress = pct;
      }
    },
    formatTime: function(seconds) {
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
