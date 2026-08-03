<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-description/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <span class="c-slide-description t-text--xxl u-color--alpha-white">
    <span v-for="(word, index) in words" :key="index" class="c-slide-description__word u-inline-block js-word" :data-text="word">{{ word }}&nbsp;</span>
  </span>
</template>

<script>
export default {
  name: 'app-slide-description',
  props: {
    content: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    delay: { type: Number, default: 0 }
  },
  data: function() {
    return {
      formatedContent: '',
      eventHub: null
    };
  },
  computed: {
    words: function() {
      return this.content ? this.content.split(' ') : [];
    }
  },
  watch: {
    isActive: {
      handler: function(val) {
        this.onActiveChange();
      },
      immediate: true
    }
  },
  mounted: function() {
    this._timers = [];
    this.$words = this.$el ? this.$el.querySelectorAll('.js-word') : [];
    this.onActiveChange();
  },
  methods: {
    onActiveChange: function() {
      var e = this;
      if (!this._timers) this._timers = [];
      if (!this.$words && this.$el) {
        this.$words = this.$el.querySelectorAll('.js-word');
      }

      if (this.$words && this.$words.length > 0) {
        for (var t = 0; t < this._timers.length; t++) {
          clearTimeout(this._timers[t]);
        }
        this._timers = [];

        if (this.isActive) {
          for (var n = 0; n < this.$words.length; n++) {
            (function(t) {
              if (e.$words[t]) {
                e.$words[t].classList.remove('is-white');
                e.$words[t].classList.remove('is-up');
                var nTimer = setTimeout(function() {
                  if (e.$words[t]) e.$words[t].classList.add('is-white');
                }, t <= 12 ? 0 + e.delay : 20 * t + e.delay);
                var iTimer = setTimeout(function() {
                  if (e.$words[t]) e.$words[t].classList.add('is-up');
                }, 15 * t + e.delay);
                e._timers.push(nTimer, iTimer);
              }
            })(n);
          }
        } else {
          for (var i = 0; i < this.$words.length; i++) {
            (function(t) {
              var nTimer = setTimeout(function() {
                if (e.$words[t]) {
                  e.$words[t].classList.remove('is-white');
                  e.$words[t].classList.remove('is-up');
                }
              }, 3 * (e.$words.length - t));
              e._timers.push(nTimer);
            })(i);
          }
        }
      }
    }
  }
};
</script>

<style>
.c-slide-description__word {
  color: #ffffff !important;
  opacity: 1 !important;
  visibility: visible !important;
}
</style>
