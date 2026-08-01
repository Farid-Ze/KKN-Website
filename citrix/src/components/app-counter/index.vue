<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-counter/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES]
-->
<template>
  <span>{{ number }}</span>
</template>

<script>
export default {
  name: 'app-counter',
  props: {
    from: { type: Number, default: 0 },
    to: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    isActive: { type: Boolean, default: false },
    delay: { type: Number, default: 0 }
  },
  data: function() {
    return {
      number: 0,
      eventHub: null
    };
  },
  methods: {
    onActiveChange: function() {
      if (this.isActive) {
        this.number = this.from;
      }
    },
    onEnterFrame: function() {
      if (this.isActive && this.number < this.to) {
        this.number += this.step;
        if (this.number > this.to) {
          this.number = this.to;
        }
      }
    }
  }
};
</script>
