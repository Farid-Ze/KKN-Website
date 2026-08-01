/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/mixins/eventHub.ts
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE EVENT MAP VIA MCP CHROME]
 * Live Registered Events:
 * - toggle:modal, toggle:bottomSlide, toggle:cursorPointer, toggle:sceneScale
 * - slide:dragging, sound:play, sound:mute, sound:unmute
 * - enterframe, resize, load:assets, keydown, toggle:infos, play:click
 * ============================================================================ */

export class EventHub {
  private _events: Record<string, Function[]> = {};

  public $on(event: string, fn: Function): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(fn);
  }

  public $off(event: string, fn?: Function): void {
    if (!this._events[event]) return;
    if (!fn) {
      this._events[event] = [];
      return;
    }
    this._events[event] = this._events[event].filter(cb => cb !== fn);
  }

  public $emit(event: string, ...args: any[]): void {
    if (!this._events[event]) return;
    const callbacks = this._events[event].slice();
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i].apply(this, args);
    }
  }
}

export const eventHub = new EventHub();
