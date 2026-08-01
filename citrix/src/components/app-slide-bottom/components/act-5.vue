<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-bottom/components/act-5.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT]
-->
<template>
  <div class="c-slide-bottom-5 u-absolute u-pos-tl u-viewport-fit-h">
    <div
      v-for="(kp, i) in keypoints"
      :key="i"
      class="c-slide-bottom-5__keypoint u-absolute u-pos-tl u-cursor-pointer"
      :class="{ 'is-active': kp[2] }"
      :style="{ transform: 'translateX(' + kp[0] + 'px) translateY(' + kp[1] + 'px) translateZ(0)' }"
    >
      <span class="c-slide-bottom-5__label t-text--xl t-text--medium u-absolute u-pos-y-center u-force-inline" v-html="cities[i]"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-slide-bottom-5',
  props: {
    scene: { type: Object, default: null },
    activeSlideIndex: { type: Number, default: 0 }
  },
  data: function() {
    return {
      keypoints: [],
      cities: [
        'Australian Grand Prix, Melbourne',
        'Chinese Grand Prix, Shanghai',
        'Bahrain Grand Prix, Sakhir',
        'Azerbaijan Grand Prix, Baku',
        'Spanish Grand Prix, Barcelona',
        'Monaco Grand Prix, Monte Carlo',
        'Canadian Grand Prix, Montreal',
        'French Grand Prix, Le Castellet',
        'Austrian Grand Prix, Spielberg',
        'British Grand Prix, Silverstone',
        'German Grand Prix, Hockenheim',
        'Hungarian Grand Prix, Budapest',
        'Belgian Grand Prix, Stavelot',
        'Italian Grand Prix, Monza',
        'Singapore Grand Prix, Singapore',
        'Russian Grand Prix, Sochi',
        'Japanese Grand Prix, Suzuka',
        'United States Grand Prix, Austin',
        'Mexican Grand Prix, Mexico City',
        'Brazilian Grand Prix, Sao Paulo',
        'Abu Dhabi Grand Prix, Abu Dhabi',
        'Red Bull Racing Headquarters, Milton Keynes, UK',
        'Red Bull Ring, Home Track, Spielberg, Austria',
        'Circuit Paul Ricard, Test Track, Le Castellet, France'
      ]
    };
  },
  methods: {
    onActiveSlideIndexChange: function() {},
    onEnterFrame: function() {
      if (this.scene && this.scene.keypoints) {
        for (var e in this.scene.keypoints.values) {
          var idx = parseInt(e);
          var t = this.scene.keypoints.values[idx];
          if (void 0 === this.keypoints[idx]) {
            this.keypoints[idx] = [];
          }
          this.$set(this.keypoints, idx, [t[0], t[1], t[2]]);
        }
      }
    }
  }
};
</script>
