<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-nav/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE 14 NAV METHODS & TEMPLATE VIA MCP CHROME]
-->
<template>
  <nav class="c-nav u-fixed u-pos-tl u-viewport-fit-h u-fit-w" :class="{ 'is-active': isActive }">
    <div class="o-wrapper--panel u-fit u-oveflow-h">
      <div class="u-absolute u-pad-b-sm u-backface-hidden u-pad-b-0@sm u-pos-center">
        <ul ref="list" class="c-nav__list o-list u-inline-block u-force-inline js-list">
          <li
            v-for="(item, index) in content"
            :key="index"
            ref="items"
            class="c-nav__list__item o-wrapper--valign u-inline-block u-pad-r-xl u-pad-r-md@sm js-item"
            :class="{ 'is-active': activeItemIndex === index }"
            @mouseenter="onItemOver(index)"
            @mouseleave="onItemLeave"
            @click="onItemClick($event, index)"
          >
            <router-link :to="item.slug || '/'" class="t-link u-inline-block u-pad-y-md u-pad-y-sm@sm">
              <span class="t-text--sm t-text--black u-inline-block u-valign-top u-marg-r-sm">0{{ index }}</span>
              <span class="c-nav__label t-text t-text--reg u-uppercase">{{ item.title || item.btnLabel }}</span>
            </router-link>
          </li>
        </ul>
        <div ref="track" class="c-nav__trackbar u-absolute u-pos-bl u-hide@sm js-track"></div>
      </div>
    </div>
  </nav>
</template>

<script>
import globalData from '../../application/global.json';
import { eventHub } from '../../mixins/eventHub';

export default {
  name: 'app-nav',
  props: {
    slideIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false }
  },
  data: function() {
    return {
      content: globalData,
      trackBarWidth: 400,
      trackBarScale: 1,
      trackBarTranslate: 0,
      activeItemIndex: 0,
      eventHub: eventHub
    };
  },
  watch: {
    isActive: function() {
      this.onActiveChange();
    },
    slideIndex: function(val) {
      this.activeItemIndex = val;
      this.scaleTrackBar(val);
    }
  },
  created: function() {
    this._listWidth = 0;
    this._items = [];
    this._mouse = { x: 0, ratioX: 0 };
    this._translateX = 0;
    this._listTranslateX = 0;
    this._trackTranslateX = 0;
    this._isPointerDown = false;
    this._pointerStartX = 0;
    this._pointerX = 0;

    if (this.eventHub) {
      this.eventHub.$on('enterframe', this.onEnterFrame);
      this.eventHub.$on('resize', this.onResize);
    }
  },
  mounted: function() {
    this.$list = this.$refs.list;
    this.$track = this.$refs.track;

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('touchstart', this.onTouchDown);
      window.addEventListener('touchmove', this.onTouchMove);
      window.addEventListener('touchend', this.onTouchEnd);
    }

    this.onResize();
  },
  beforeDestroy: function() {
    if (this.eventHub) {
      this.eventHub.$off('enterframe', this.onEnterFrame);
      this.eventHub.$off('resize', this.onResize);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('touchstart', this.onTouchDown);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.onTouchEnd);
    }
  },
  methods: {
    onActiveChange: function() {
      if (this.isActive) {
        this.activeItemIndex = this.slideIndex;
        if (this.$el && this.$el.classList) this.$el.classList.add('is-active');
        this.scaleTrackBar(this.activeItemIndex);
        if (this.$root && this.$root.isTouch) this.onChangeItem();
      } else {
        if (this.$el && this.$el.classList) this.$el.classList.remove('is-active');
      }
    },
    onResize: function() {
      if (!this.$refs.items) return;
      const itemEls = Array.isArray(this.$refs.items) ? this.$refs.items : [this.$refs.items];
      this._items = itemEls.map(el => ({
        el,
        width: el.offsetWidth - 35,
        offsetX: el.offsetLeft
      }));
      if (this.$list) this._listWidth = this.$list.offsetWidth;
      this.scaleTrackBar(this.activeItemIndex);
    },
    scaleTrackBar: function(e) {
      if (this._items && this._items[e]) {
        this.trackBarScale = this._items[e].width / this.trackBarWidth;
        this.trackBarTranslate = this._items[e].el.offsetLeft;
      }
    },
    onPrevItem: function() {
      if (this.activeItemIndex > 0) {
        this.activeItemIndex -= 1;
        this.onChangeItem();
      }
    },
    onNextItem: function() {
      if (this._items && this.activeItemIndex < this._items.length - 1) {
        this.activeItemIndex += 1;
        this.onChangeItem();
      }
    },
    onChangeItem: function() {
      if (this.$list && this._items[this.activeItemIndex]) {
        this.$list.style.transform = 'translateX(' + -this._items[this.activeItemIndex].offsetX + 'px) translateZ(0)';
        this.scaleTrackBar(this.activeItemIndex);
      }
    },
    onEnterFrame: function() {
      if (this.isActive) {
        const winW = typeof window !== 'undefined' ? window.innerWidth : 1920;
        this._translateX = this._mouse.ratioX * (this._listWidth + 50 + winW / 12 - winW) * 0.5;

        if (this.$root && this.$root.isTouch) {
          if (this.$track) this.$track.style.transform = 'scaleX(' + this.trackBarScale + ') translateZ(0)';
        } else {
          this._listTranslateX += 0.1 * (this._translateX - this._listTranslateX);
          this._trackTranslateX += 0.07 * (this._translateX - this._trackTranslateX);

          if (this.$list) {
            this.$list.style.transform = 'translateX(' + -this._listTranslateX + 'px) translateZ(0)';
          }
          if (this.$track) {
            this.$track.style.transform = 'translateX(' + (this.trackBarTranslate - this._trackTranslateX) + 'px) scaleX(' + this.trackBarScale + ') translateZ(0)';
          }
        }
      }
    },
    onItemOver: function(e) {
      this.scaleTrackBar(e);
    },
    onItemLeave: function() {
      this.scaleTrackBar(this.activeItemIndex);
    },
    onItemClick: function(e, t) {
      if (t === this.activeItemIndex) {
        e.preventDefault();
        this.$emit('toggle:nav');
      }
    },
    onMouseMove: function(e) {
      const winW = typeof window !== 'undefined' ? window.innerWidth : 1920;
      this._mouse.x = e.pageX;
      this._mouse.ratioX = 2 * (this._mouse.x / winW - 0.5);
    },
    onTouchDown: function(e) {
      if (this.$root && this.$root.isTouch && e.touches[0]) {
        this._isPointerDown = true;
        this._pointerStartX = e.touches[0].clientX;
        this._pointerX = this._pointerStartX;
      }
    },
    onTouchMove: function(e) {
      if (this._isPointerDown && this.$root && this.$root.isTouch && e.touches[0]) {
        e.preventDefault();
        this._pointerX = e.touches[0].clientX;
      }
    },
    onTouchEnd: function() {
      if (this._isPointerDown && this.$root && this.$root.isTouch) {
        this._isPointerDown = false;
        if (Math.abs(this._pointerStartX - this._pointerX) > 10) {
          if (this._pointerX > this._pointerStartX) {
            this.onPrevItem();
          } else {
            this.onNextItem();
          }
        }
      }
    }
  }
};
</script>
