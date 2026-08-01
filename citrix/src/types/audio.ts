/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Extracted via Chrome DevTools MCP on https://thenewmobileworkforce.imm-g-prod.com/
 * ============================================================================ */

export interface Live2017AudioFileManifest {
  ambientLevel1: 'ambiant-level-1.mp3';
  ambientLevel2: 'ambiant-level-2.mp3';
  uiSfx: {
    navOver: 'nav-over.mp3';
    tick: 'tick.mp3';
    tickReverb: 'tick-reverb.mp3';
    playVideo: 'play-video.mp3';
  };
  slideSfx: [
    'slide-01.mp3',
    'slide-02.mp3',
    'slide-03.mp3',
    'slide-04.mp3',
    'slide-05.mp3'
  ];
}

export interface Live2017SoundManagerComponentProps {
  isMuted: boolean;
  isModalActive: boolean;
  isNavActive: boolean;
}
