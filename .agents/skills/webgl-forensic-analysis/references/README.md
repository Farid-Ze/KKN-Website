# Reference Library: Forensic Technical Analysis Gold Standards

This directory contains reference examples of completed forensic technical analyses.

## Reference Example 1: Red Bull Racing + Citrix Experience

- **Target URL**: `https://thenewmobileworkforce.imm-g-prod.com/`
- **Architecture**: Single-Canvas 3D Scene Graph + Custom Post-Processing Composer
- **Technology Stack**: Vue.js 2.5 + Three.js r85 + GSAP v1.20 + Browserify Bundle
- **Key Features**: F1 Car CAD model breakdown, camera spline paths, custom Blinn-Phong & MatCap shaders, 2D HTML pin projections.
- **Artifact File**: `forensic_technical_analysis.md`

---

## Reference Example 2: Son Daven Design Resort Hotel Experience

- **Target URL**: `https://sondaven.com/en`
- **Architecture**: Multi-Canvas WebGL Halftone Procedural Shader Engine + Webflow CMS
- **Technology Stack**: Webflow DOM + Slater.app ES Modules + Lenis v1.3.15 + GSAP v3.13 + Barba.js SPA
- **Key Features**: 16 WebGL `<canvas>` elements running custom procedural GLSL halftone matrix fragment shaders over transparent MP4/HEVC video textures, summer/winter theme crossfading, Barba.js page transitions, `IntersectionObserver` GPU auto-pausing, DPR 1.5 capping.
- **Artifact File**: `sondaven_forensic_technical_analysis.md`

---

### Key Methodology Invariants Across References

1. **Strict Evidence Tiering**: Tagging every finding with `[VERIFIED]`, `[EVIDENCE-BASED INFERENCE]`, or `[UNKNOWN FROM OBSERVABLE EVIDENCE]`.
2. **20 Mandatory Deliverables**: Including Mermaid architecture diagrams, sequence flows, GLSL shader code, render loops, and annotated production pseudocode.
3. **Subsystem Documentation Standard**: Documenting *why*, *dependencies*, *update order*, *data flow*, *synchronization*, and *performance considerations* for every module.
