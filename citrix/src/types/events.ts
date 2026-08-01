/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Extracted via Chrome DevTools MCP on https://thenewmobileworkforce.imm-g-prod.com/
 * ============================================================================ */

export interface Live2017EventChannelListenerCounts {
  'toggle:modal': 1;
  'toggle:bottomSlide': 1;
  'toggle:cursorPointer': 1;
  'toggle:sceneScale': 1;
  'slide:dragging': 1;
  'sound:play': 1;
  'sound:mute': 1;
  'sound:unmute': 1;
  'enterframe': 25;
  'resize': 26;
  'load:assets': 1;
  'keydown': 6;
  'toggle:infos': 6;
  'play:click': 6;
}

export type Live2017EventChannelName = keyof Live2017EventChannelListenerCounts;
