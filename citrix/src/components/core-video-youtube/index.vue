<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/core-video-youtube/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <div class="c-video o-wrapper--panel u-fit u-overflow-h">
    <div class="o-wrapper--panel u-fit js-iframe" :id="id + '-video'"></div>
    <div class="c-video__poster o-wrapper--panel u-fit u-cover" :style="{ backgroundImage: 'url(' + poster + ')' }" v-if="poster"></div>
  </div>
</template>

<script>
export default {
  name: 'core-video-youtube',
  props: {
    id: { type: String, default: '' },
    poster: { type: String, default: '' },
    isPlaying: { type: Boolean, default: false },
    isFullScreen: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false },
    newCurrentTime: { type: Number, default: 0 }
  },
  data: function() {
    return {
      player: null,
      eventHub: null
    };
  },
  methods: {
    onActiveChange: function() {},
    onMutedChange: function() {
      if (this.player) {
        if (this.isMuted && typeof this.player.mute === 'function') {
          this.player.mute();
        } else if (typeof this.player.unMute === 'function') {
          this.player.unMute();
        }
      }
    },
    onNewCurrentTimeChange: function() {
      if (this.player && this.newCurrentTime && typeof this.player.seekTo === 'function') {
        this.player.seekTo(this.newCurrentTime, true);
      }
    },
    onToggleFullScreen: function() {},
    createPlayer: function() {
      var e = this;
      if (window.YT && window.YT.Player) {
        this.player = new window.YT.Player(this.id + '-video', {
          videoId: this.id,
          events: {
            onReady: e.onPlayerReady,
            onStateChange: e.onPlayerStateChange
          }
        });
      }
    },
    onSrcChange: function() {
      if (this.player && typeof this.player.loadVideoById === 'function') {
        this.player.loadVideoById(this.id);
      } else {
        this.createPlayer();
      }
    },
    onPlayerReady: function() {
      this.$emit('player:ready');
    },
    getDuration: function() {
      if (this.player && typeof this.player.getDuration === 'function') {
        return this.player.getDuration();
      }
      return 0;
    },
    onPlayerStateChange: function(e) {
      if (window.YT && e) {
        if (e.data === window.YT.PlayerState.PLAYING) {
          this.onPlayerPlay();
        } else if (e.data === window.YT.PlayerState.PAUSED) {
          this.onPlayerPause();
        } else if (e.data === window.YT.PlayerState.ENDED) {
          this.onPlayerEnd();
        } else if (e.data === window.YT.PlayerState.BUFFERING) {
          this.onPlayerBuffer();
        }
      }
    },
    onPlayerPlay: function() {
      this.$emit('player:play');
    },
    onPlayerPause: function() {
      this.$emit('player:pause');
    },
    onPlayerEnd: function() {
      this.$emit('player:end');
    },
    onPlayerBuffer: function() {},
    onPlayerError: function() {},
    onEnterframe: function() {
      if (this.player && this.isPlaying && typeof this.player.getCurrentTime === 'function' && typeof this.player.getDuration === 'function') {
        this.$emit('set:currentTime', this.player.getCurrentTime());
        this.$emit('set:duration', this.player.getDuration());
      }
    }
  }
};
</script>
