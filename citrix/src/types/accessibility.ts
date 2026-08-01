/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Extracted via Chrome DevTools MCP on https://thenewmobileworkforce.imm-g-prod.com/
 * ============================================================================ */

export interface Live2017AllExternalLinksCatalog {
  redBullRacing: 'http://www.redbullracing.com/';
  citrixHome: 'https://www.citrix.com/';
  citrixHdx: 'https://www.citrix.com/virtualization/hdx/';
  citrixXenDesktop: 'https://www.citrix.com/products/xenapp-xendesktop/';
  citrixReceiver: 'https://www.citrix.com/products/receiver/';
  citrixNetscaler: 'https://www.citrix.com/products/netscaler-adc/';
  citrixXenServer: 'https://www.citrix.com/products/xenserver/';
}

export interface Live2017AllImagePathsCatalog {
  logoPartners: '/assets/medias/images/logo-partners.png';
  gradientCircle: '/assets/medias/images/gradient-circle.svg';
  iconPlay: '/assets/medias/images/icons/play.svg';
  iconPause: '/assets/medias/images/icons/pause.svg';
  iconFullscreen: '/assets/medias/images/icons/fullscreen.svg';
  iconArrowRightBorderRed: '/assets/medias/images/icons/arrow-right-border-red.svg';
  iconArrowTallTop: '/assets/medias/images/icons/arrow-tall-top.svg';
  iconArrowTallBottom: '/assets/medias/images/icons/arrow-tall-bottom.svg';
  iconArrowYTopEnd: '/assets/medias/images/icons/arrow-y-top-end.svg';
  iconArrowXRightEnd: '/assets/medias/images/icons/arrow-x-right-end.svg';
  iconArrowXRightEndGray: '/assets/medias/images/icons/arrow-x-right-end-gray.svg';
  logoCitrixClear: '/assets/medias/images/logo-citrix-clear.svg';
}

export interface Live2017InteractiveDOMElementClasses {
  redBullPartnerLink: 'u-absolute u-pos-tl u-fit-h u-w1of2';
  citrixPartnerLink: 'u-absolute u-pos-tr u-fit-h u-w1of2';
  slideIconMoreBtn: 'c-slide__icon-more t-btn u-inline-block u-absolute u-pos-t u-marg-l-xxs u-valign-top u-shape-circle u-marg-t-xs u-marg-t-0@sm';
  slideMobileCloseBtn: 'c-slide__mobile-description__btn-close c-slide__icon-more t-btn u-inline-block u-absolute u-pos-tlu-valign-top u-shape-circle';
  slidePlayVideoLink: 'c-slide__line c-slide__btn-play t-btn u-inline-block u-force-inline';
  keypointHotspotBtn: 'c-keypoint__btn t-btn o-wrapper--panel u-fit js-btn';
  slideBottomPlayVideoLink: 'c-slide-bottom__link c-slide__btn-play t-btn u-inline-block u-force-inline u-marg-b-lg';
  slideBottomHdxLink: 'c-slide-bottom__link t-link u-block u-valign-middle u-hide@sm';
  slideBottomArrowTopLink: 'c-slide-bottom__arrow c-slide-bottom__arrow--top u-relative u-inline-block u-align-center u-fit-w u-marg-b-sm u-marg-b-xs@sm';
  slideBottomArrowBottomLink: 'c-slide-bottom__arrow c-slide-bottom__arrow--bottom u-relative u-inline-block u-align-center u-fit-w';
  headerLogo: 'c-header__logo t-link u-inline-block router-link-exact-active router-link-active';
  headerBtnSound: 'c-header__btn-sound t-btn u-inline-block u-valign-middle u-vacuum';
  headerBtnMenu: 'c-header__btn-menu t-btn u-relative u-inline-block u-valign-middle u-vacuum';
}

export interface Live2017AccessibilityAuditMetrics {
  /** Total interactive elements (<a>, <button>) found in DOM */
  totalInteractiveElements: number;
  /** Total image and SVG elements found in DOM */
  totalImageSvgElements: number;
  /** Number of elements with aria-label attribute */
  elementsWithAriaLabel: number;
  /** Number of elements with custom tabindex attribute */
  elementsWithCustomTabIndex: number;
  /** Number of img elements with non-null alt attribute */
  imagesWithAltAttribute: number;
  /** User system prefers-reduced-motion media query status */
  prefersReducedMotion: boolean;
  /** Calculated accessibility deficit ratio (1.0 = 100% missing WCAG AA attributes) */
  accessibilityDeficitRatio: number;
}

/** Empirical constant metrics snapshot extracted live from DOM */
export const LIVE_2017_ACCESSIBILITY_AUDIT_DEFAULTS = {
  totalInteractiveElements: 61,
  totalImageSvgElements: 107,
  elementsWithAriaLabel: 0,
  elementsWithCustomTabIndex: 0,
  imagesWithAltAttribute: 0,
  prefersReducedMotion: false,
  accessibilityDeficitRatio: 1.0
} as const;

export interface Live2017InteractiveElementAudit {
  tag: 'a' | 'button' | 'input';
  className: string;
  text: string;
  href: string | null;
  tabIndex: number | null;
  ariaLabel: string | null;
}

export interface Live2017ImageElementAudit {
  tag: 'img' | 'svg';
  alt: string | null;
  ariaHidden: string | null;
  src: string | null;
}
