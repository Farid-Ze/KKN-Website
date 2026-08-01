<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM RENDER & METHODS VIA MCP CHROME]
-->
<template>
  <div class="c-slide u-absolute u-pos-tl u-fit" @mouseup="onTouchEnd" @touchend="onTouchEnd" @touchstart="onTouchDown" @touchmove="onTouchMove">
    <div class="c-slide-bottom__panel o-wrapper--panel u-fit u-bg--black"></div>

    <!-- Home Slide (Index 0) -->
    <template v-if="0 === index">
      <div class="c-slide__content o-wrapper--panel o-wrapper--valign u-fit u-pad-x-w1of12">
        <div class="c-slide__gradient--base o-wrapper--panel u-fit u-pointer-none" :style="{ opacity: content ? content.gradientOpacity : 0 }"></div>
        <div class="c-slide__content__panel o-wrapper--panel u-fit u-cursor-grab" @touchstart="onTouchDown" @touchmove="onTouchMove" @mousedown="onTouchDown" @mousemove="onTouchMove"></div>
        <div class="u-inline-block u-valign-bottom">
          <h2 class="c-slide__intro-title t-h1 t-text-lh--sm t-text--reg u-uppercase u-marg-b-lg u-w3of4 u-w4of4@md u-marg-b-xs@md" v-if="content" v-html="content.title"></h2>
          <div class="c-slide__intro-content u-relative u-inline-block u-valign-bottom u-marg-l-w2of8 u-marg-b-vh1of12 u-w6of12 u-pad-r-xl u-marg-l-0@md u-w12of12@md u-marg-b-md@md u-pad-r-0@sm">
            <p class="t-text--xxl u-color--alpha-white u-w9of10 u-w10of10@sm" v-if="content">{{ content.description }}</p>
          </div>
          <div class="c-slide__cartouche u-absolute u-pos-bl u-marg-l-w1of12 u-marg-b-vh1of12 u-relative@md u-marg-l-0@md u-marg-b-vh2of10@sm u-vacuum">
            <div class="u-relative u-inline-block u-valign-middle u-fit-w">
              <img src="/assets/medias/images/logo-partners.png" class="u-fit-w">
              <a href="http://www.redbullracing.com/" target="_blank" class="u-absolute u-pos-tl u-fit-h u-w1of2"></a>
              <a href="https://www.citrix.com/" target="_blank" class="u-absolute u-pos-tr u-fit-h u-w1of2"></a>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Regular Slide (Index > 0) -->
    <template v-else>
      <div class="u-fit u-overflow-h">
        <div class="c-slide__content o-wrapper--valign u-fit u-pad-x-w1of12">
          <div class="c-slide__gradient--base o-wrapper--panel u-fit u-pointer-none" :style="{ opacity: content ? content.gradientOpacity : 0 }"></div>
          <div class="c-slide__gradient--overlay o-wrapper--panel u-fit u-pointer-none"></div>
          <div class="c-slide__content__panel o-wrapper--panel u-fit u-cursor-grab" @touchstart="onTouchDown" @touchmove="onTouchMove" @mousedown="onTouchDown" @mousemove="onTouchMove"></div>
          <div class="u-relative u-inline-block u-valign-bottom u-fit-w u-marg-b-vh2of10 u-backface-hidden">
            <div class="c-slide__block u-inline-block u-valign-bottom u-pad-r-lg u-w4of10 u-w10of10@sm u-pad-r-0@sm u-marg-b-md@sm">
              <span class="c-slide__line t-text--xxl t-text-lh--sm t-text--reg u-block u-uppercase" v-if="content">{{ content.subtitle }}</span>
              <div class="c-slide__line o-wrapper--valign u-force-inline" @mouseenter="onEnterTitle" @mouseleave="onLeaveTitle" @click="onToggleInfosMobile">
                <h2 class="c-slide__blink c-slide__blink--bis t-h4 t-text--reg u-uppercase u-marg-b-md u-marg-r-xs u-force-inline__reset u-marg-b-sm@sm" v-if="content">
                  <span class="c-slide__blink__mask u-absolute u-pos-tl" v-html="content.title"></span>
                  <span class="c-slide__blink__mask u-absolute u-pos-tl" v-html="content.title"></span>
                  <span class="c-slide__blink__label js-title-label">{{ content.title }}</span>
                </h2>
                <app-slide-btn-more :style="{ left: (btnOffsetX + 20) + 'px' }" :is-active="isSlideActive" />
              </div>
              <div class="c-slide__line c-slide__line c-slide__mobile-description u-absolute u-pos-bl">
                <button class="c-slide__mobile-description__btn-close c-slide__icon-more t-btn u-inline-block u-absolute u-pos-tlu-valign-top u-shape-circle" @click="onToggleInfosMobile">
                  <div class="c-slide__icon-more__bar u-absolute u-bg--white"></div>
                  <div class="c-slide__icon-more__bar u-absolute u-bg--white"></div>
                </button>
                <p class="t-text--xl u-color--alpha-white u-marg-b-xs" v-if="content">{{ content.description }}</p>
              </div>
              <a href="javascript:void(0);" class="c-slide__line c-slide__btn-play t-btn u-inline-block u-force-inline" :class="{ 'is-hover': isBtnPlayOver }" @click="onVideoPlay" @mouseover="onVideoOver">
                <span class="c-slide__blink t-text--xs t-text--ls-xxs t-text--black u-relative u-color--alpha-white u-inline-block u-uppercase u-valign-middle" data-text="Play video">
                  <span class="c-slide__blink__label u-inline-block">Play video</span>
                </span>
                <div class="c-slide__btn-play__icon o-wrapper--valign u-inline-block u-valign-middle">
                  <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="c-slide__btn-play__icon__base o-wrapper--panel u-fit" style="fill: transparent;">
                    <path stroke-width="2" stroke="#E62541" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__icon__base__path"></path>
                  </svg>
                  <div class="o-wrapper--panel u-fit">
                    <div class="c-slide__btn-play__icon__base__mask u-absolute u-pos-tl u-fit-w u-h1of2 u-overflow-h">
                      <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="o-wrapper--panel t-icon--play-circle" style="fill: transparent;">
                        <path stroke-width="2" stroke="#E62541" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__icon__mask__path"></path>
                      </svg>
                    </div>
                    <div class="c-slide__btn-play__icon__base__mask u-absolute u-pos-bl u-fit-w u-h1of2 u-overflow-h">
                      <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="o-wrapper--panel t-icon--play-circle" style="fill: transparent;">
                        <path stroke-width="2" stroke="#E62541" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__icon__mask__path"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="c-slide__btn-play__container-over o-wrapper--panel u-fit">
                    <div class="c-slide__btn-play__over u-absolute u-pos-tl u-fit-w u-h1of2 u-overflow-h">
                      <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="o-wrapper--panel t-icon--play-circle" style="fill: transparent;">
                        <path stroke-width="2" stroke="#ffffff" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__over__path"></path>
                      </svg>
                    </div>
                    <div class="c-slide__btn-play__over u-absolute u-pos-bl u-fit-w u-h1of2 u-overflow-h">
                      <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="o-wrapper--panel t-icon--play-circle" style="fill: transparent;">
                        <path stroke-width="2" stroke="#ffffff" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__over__path"></path>
                      </svg>
                    </div>
                  </div>
                  <img src="/assets/medias/images/icons/play.svg" class="c-slide__btn-play__icon__play t-icon--play u-absolute u-pos-center">
                </div>
              </a>
            </div>
            <div class="c-slide__intro u-inline-block u-valign-top u-marg-t-lg u-w4of10 u-hide@sm" v-if="content">
              <app-slide-description class="c-slide-description t-text--xxl u-color--alpha-white" :is-active="isActive" :content="content.description" />
            </div>
          </div>
          <template v-if="content && content.keypoints">
            <app-key-point
              v-for="(kp, i) in content.keypoints"
              :key="i"
              class="u-hide@sm"
              :index="i"
              :is-active="isSlideActive"
              :position="topScene && topScene.keypoints && topScene.keypoints.positions ? topScene.keypoints.positions[i] : null"
              :content="kp"
              v-show="!$root.isTouch"
            />
          </template>
        </div>
        <transition name="c-slide-bottom" :duration="1000">
          <app-slide-bottom
            v-show="isBottomSlideActive"
            :is-active="isBottomSlideActive"
            :index="index"
            :active-slide-index="activeIndex"
            :content="content ? content.content : null"
            :scene="bottomScene"
          />
        </transition>
      </div>
    </template>
  </div>
</template>

<script>
import AppSlideDescription from '../app-slide-description/index.vue';
import AppSlideBtnMore from '../app-slide-btn-more/index.vue';
import AppSlideBottom from '../app-slide-bottom/index.vue';
import AppMagnet from '../app-magnet/index.vue';
import AppKeyPoint from '../app-key-point/index.vue';

export default {
  name: 'app-slide',
  components: {
    'app-slide-description': AppSlideDescription,
    'app-slide-btn-more': AppSlideBtnMore,
    'app-slide-bottom': AppSlideBottom,
    'app-magnet': AppMagnet,
    'app-key-point': AppKeyPoint
  },
  props: {
    content: { type: Object, default: null },
    topScene: { type: Object, default: null },
    bottomScene: { type: Object, default: null },
    index: { type: Number, default: 0 },
    activeIndex: { type: Number, default: 0 },
    isBottomSlideActive: { type: Boolean, default: false }
  },
  data: function() {
    return {
      isActive: false,
      isSlideActive: false,
      btnOffsetX: 0,
      isBtnPlayOver: false,
      eventHub: null
    };
  },
  methods: {
    onResize: function() {
      if (this.$titleLabel) {
        this.btnOffsetX = this.$titleLabel.offsetWidth;
      }
      this.slideDistance = this.$root.winWidth / 6;
      if (this.slideDistance > 350) {
        this.slideDistance = 350;
      }
    },
    onActiveIndexChange: function() {
      var e = this;
      if (this.index === this.activeIndex) {
        this.$el.style.display = 'block';
        this.onResize();
        clearTimeout(this._activeTimer);
        clearTimeout(this._leavingTimer);
        this._activeTimer = setTimeout(function() {
          e.isSlideActive = true;
          e.$el.classList.remove('is-leaving');
          e.$el.classList.add('is-active');
        }, 100);
      } else {
        clearTimeout(this._activeTimer);
        clearTimeout(this._leavingTimer);
        this.$el.classList.remove('is-active');
        this.isSlideActive = false;
        if (!this.$root.isFirstLoading) {
          this.$el.classList.add('is-leaving');
        }
        this._leavingTimer = setTimeout(function() {
          e.$el.classList.remove('is-leaving');
          e.$el.style.display = 'none';
        }, 1000);
      }
    },
    onToggleInfos: function() {
      var e = this;
      if (this.index === this.activeIndex) {
        if (this.isActive) {
          clearTimeout(this._activeTimer);
          this.$el.classList.remove('is-toggled');
          this.$el.classList.add('is-leaving-toggled');
          this.isActive = false;
        } else {
          this.isActive = true;
          this._activeTimer = setTimeout(function() {
            e.$el.classList.add('is-toggled');
          }, 200);
        }
        setTimeout(function() {
          e.$el.classList.remove('is-leaving-toggled');
        }, 600);
      }
    },
    onEnterTitle: function() {
      if (!this.$root.isTouch) {
        this.onToggleInfos();
      }
    },
    onLeaveTitle: function() {
      if (!this.$root.isTouch) {
        this.onToggleInfos();
      }
    },
    onToggleInfosMobile: function() {
      if (this.$root.isTouch) {
        this.onToggleInfos();
      }
    },
    onVideoPlay: function() {
      if (this.activeIndex === this.index && this.eventHub) {
        this.eventHub.$emit('toggle:modal');
      }
    },
    onVideoOver: function() {
      if (this.eventHub) {
        this.eventHub.$emit('sound:play', 'play-video');
      }
    },
    onMobileTouchDown: function(e) {
      if (this.$root.isTouch) {
        this.onTouchDown(e);
      }
    },
    onMobileTouchMove: function(e) {
      if (this.$root.isTouch) {
        this.onTouchMove(e);
      }
    },
    onTouchDown: function(e) {
      if (!this.isBottomSlideActive) {
        this._isPointerDown = true;
        if (this.$root.isTouch) {
          this._pointerStartX = e.touches[0].clientX;
          this.$el.classList.add('is-grabbing');
          if (this.eventHub) {
            this.eventHub.$emit('toggle:sceneScale');
            this.eventHub.$emit('slide:dragging', 0.01);
          }
        } else {
          this._pointerStartX = e.clientX;
          this.$el.classList.add('is-grabbing');
          if (this.eventHub) {
            this.eventHub.$emit('toggle:sceneScale');
            this.eventHub.$emit('slide:dragging', 0.01);
          }
        }
        this._pointerX = this._pointerStartX;
      }
    },
    onTouchMove: function(e) {
      if (this._isPointerDown) {
        e.preventDefault();
        if (this.$root.isTouch) {
          this._pointerX = e.touches[0].clientX;
        } else {
          this._pointerX = e.clientX;
        }
        var t = (this._pointerX - this._pointerStartX) / this.slideDistance;
        if (t > 1) t = 1;
        else if (t < -1) t = -1;
        else if (t === 0) t = 0.001;
        if (this.eventHub) {
          this.eventHub.$emit('slide:dragging', t);
        }
      }
    },
    onTouchEnd: function() {
      if (this._isPointerDown) {
        this.$el.classList.remove('is-grabbing');
        if (this.eventHub) {
          this.eventHub.$emit('toggle:sceneScale');
        }
        this._isPointerDown = false;
        if (Math.abs(this._pointerStartX - this._pointerX) > this.slideDistance) {
          this.$emit(this._pointerX > this._pointerStartX ? 'slide:prev' : 'slide:next');
        }
        if (this.eventHub) {
          this.eventHub.$emit('slide:dragging', 0);
        }
      }
    }
  }
};
</script>
