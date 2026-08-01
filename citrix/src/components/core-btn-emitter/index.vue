<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/core-btn-emitter/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <button class="c-btn-emitter t-btn" @click="onClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'core-btn-emitter',
  props: {
    event: { type: String, default: '' }
  },
  data: function() {
    return {
      eventHub: null
    };
  },
  methods: {
    onClick: function() {
      if (this.event && this.eventHub) {
        this.eventHub.$emit(this.event);
      }
    }
  }
};
</script>
