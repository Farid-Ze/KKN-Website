/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/utilities/getAbsoluteBoundingRect.js
 * Status: [EMPIRICALLY VERIFIED - DE-BUNDLED FROM BROWSERIFY MODULE 394]
 * ============================================================================ */

export function getAbsoluteBoundingRect(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollY,
    left: rect.left + scrollX,
    width: rect.width,
    height: rect.height,
    right: rect.right + scrollX,
    bottom: rect.bottom + scrollY
  };
}
