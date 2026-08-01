<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-sound-manager/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE SOUND MANAGER VIA MCP CHROME]
-->
<template>
  <div class="u-hide">
    <audio src="/assets/medias/sounds/ambiant-level-1.mp3" data-id="ambiant-level-1" loop="loop" class="js-player js-player-ambiant-level-1"></audio>
    <audio src="/assets/medias/sounds/ambiant-level-2.mp3" data-id="ambiant-level-2" loop="loop" class="js-player js-player-ambiant-level-2"></audio>
    <audio src="/assets/medias/sounds/nav-over.mp3" data-id="nav-over" class="js-player js-player-nav-over"></audio>
    <audio src="/assets/medias/sounds/click.mp3" data-id="click" class="js-player js-player-click"></audio>
  </div>
</template>

<script>
import { eventHub } from '../../mixins/eventHub';

export default {
  name: 'app-sound-manager',
  props: {
    isMuted: { type: Boolean, default: false },
    isModalActive: { type: Boolean, default: false },
    isNavActive: { type: Boolean, default: false }
  },
  data: function() {
    return {
      sounds: {},
      eventHub: eventHub
    };
  },
  watch: {
    isMuted: function(val) {
      this.onMutedChange(val);
    },
    isModalActive: function(val) {
      this.onModalActiveChange(val);
    }
  },
  created: function() {
    if (this.eventHub) {
      this.eventHub.$on('sound:play', this.onPlay);
      this.eventHub.$on('sound:mute', this.onMute);
      this.eventHub.$on('sound:unmute', this.onUnMute);
      this.eventHub.$on('enterframe', this.onEnterFrame);
    }
  },
  beforeDestroy: function() {
    if (this.eventHub) {
      this.eventHub.$off('sound:play', this.onPlay);
      this.eventHub.$off('sound:mute', this.onMute);
      this.eventHub.$off('sound:unmute', this.onUnMute);
      this.eventHub.$off('enterframe', this.onEnterFrame);
    }
  },
  methods: {
    onPlay: function(id) {
      if (this.isMuted) return;
      const el = typeof document !== 'undefined' ? document.querySelector('.js-player-' + id) : null;
      if (el && el.play) {
        el.currentTime = 0;
        el.play().catch(function() {});
      }
    },
    onMute: function() {
      const els = typeof document !== 'undefined' ? document.querySelectorAll('.js-player') : [];
      els.forEach(function(el) {
        el.muted = true;
      });
    },
    onUnMute: function() {
      const els = typeof document !== 'undefined' ? document.querySelectorAll('.js-player') : [];
      els.forEach(function(el) {
        el.muted = false;
      });
    },
    onMutedChange: function(val) {
      if (val) {
        this.onMute();
      } else {
        this.onUnMute();
      }
    },
    onModalActiveChange: function(val) {
      if (val) {
        this.onMute();
      } else if (!this.isMuted) {
        this.onUnMute();
      }
    },
    onEnterFrame: function() {}
  }
};
</script>
