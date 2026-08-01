---
name: webgl-forensic-analysis
description: Perform forensic technical analysis, reverse-engineering, and architectural specification of interactive WebGL, Three.js, and GSAP experiences.
---

# WebGL & GSAP Forensic Technical Analysis

This skill provides a systematic framework for reverse-engineering complex 3D web experiences, WebGL canvas architectures, Three.js scene graphs, and GSAP/ScrollTrigger animation pipelines.

## Persona & Standard

Act as a **Lead Creative Technologist**, **Senior WebGL Engineer**, and **GSAP Animation Architect**.

## Reverse-Engineering Methodology

When analyzing a live interactive site, execute these phases in order:

### Phase 1: Static Asset Acquisition

1. Fetch the HTML document source (handle TLS/certificate issues with `verify=False` if needed).
2. Identify and download all linked JS bundles (`build.js`, `app.js`, `vendor.js`, etc.) and CSS files.
   - **CMS-injected code**: For Webflow, Squarespace, or similar CMS sites, look for external code injection services like Slater.app, Finsweet, or custom `<script>` tags with `import()` dynamic loading.
   - **Follow dynamic imports**: If the entry script uses `import("https://...")`, fetch the target module recursively.
3. Detect the bundler type by searching for signature patterns:
   - **Webpack**: `webpackJsonp`, `__webpack_require__`, `__webpack_modules__`
   - **Browserify**: `require=`, module pattern `id:[function(require,module,exports){...},{deps}]`
   - **Rollup/Vite**: `import`, `export`, ESM module graph
   - **Parcel**: `parcelRequire`
   - **No bundler (ESM/CDN)**: Direct CDN script tags (e.g., `cdn.jsdelivr.net/npm/gsap@3.x`), Slater.app modules, or inline ES module scripts.
4. Extract individual modules from the bundle and map module IDs to file paths using dependency dictionaries.
5. Separate application modules from vendor/polyfill modules (filter out `core-js`, `regenerator-runtime`, etc.).
6. Fetch any referenced JSON manifests, configuration files, and 3D asset descriptors.

### Phase 2: Bundle Decomposition & Library Identification

1. Identify library versions by searching for `REVISION` (Three.js), `TweenLite`/`TweenMax`/`gsap` (GSAP), version strings, and library signatures.
2. Extract all GLSL shader modules (search for `gl_Position`, `gl_FragColor`, `varying`, `uniform` keywords).
3. Extract all asset file paths (regex for `.gltf`, `.glb`, `.hdr`, `.jpg`, `.png`, `.mp4`, `.json`, `.bin`, `.ktx2` extensions).
4. **If Three.js is present**: Map `THREE.*` class usage to determine scene graph architecture, loader types, material types, and post-processing passes.
   **If raw WebGL is used (no Three.js)**: Search for `getContext("webgl")` or `getContext("webgl2")` calls, identify custom GLSL vertex/fragment shaders in template literals, extract uniform names (`u_*` pattern), and map canvas `data-*` scene attribute selectors.
5. **Count canvas elements**: Check HTML for multiple `<canvas>` elements. If >1, the site uses a **multi-canvas distributed rendering model** rather than a single-canvas scene graph.
6. Identify custom uniforms in `ShaderMaterial` definitions or raw `gl.uniform*` calls.
7. Map Vue/React/Svelte component trees from module imports.

### Phase 3: Live MCP Chrome Extraction Battery

When auditing a live site via `chrome-devtools-mcp`, execute these extractions using `evaluate_script`. Run independent extractions in parallel where possible.

#### Extraction 1: Navigate & Confirm Route

```javascript
// Navigate to target page via Vue Router / SPA router
const vm = document.querySelector('.c-application')?.__vue__;
vm.$router.push('/target-route');
// VERIFY: slideIndex, url, isReady must all match expected values
```

#### Extraction 2: Scene Graph + Camera + Renderer Stats

```javascript
// Traverse Three.js scene graph
const bg = scenesComp?.background;
const sceneObj = bg?.scenes?.levels?.[0]?.[N]; // N = scene index
sceneObj.scene.children.map((c, i) => ({
  index: i, type: c.type, name: c.name, visible: c.visible,
  position: { x: c.position.x, y: c.position.y, z: c.position.z },
  rotation: { x: c.rotation.x, y: c.rotation.y, z: c.rotation.z },
  scale: { x: c.scale.x, y: c.scale.y, z: c.scale.z },
  geometry: c.geometry ? {
    vertexCount: c.geometry.attributes?.position?.count,
    faceCount: c.geometry.index ? c.geometry.index.count / 3 : 0,
    boundingSphere: c.geometry.boundingSphere
  } : null,
  material: c.material ? {
    type: c.material.type,
    uniformKeys: c.material.uniforms ? Object.keys(c.material.uniforms) : []
  } : null
}));
// Also extract: camera.fov, camera.position, camera.rotation, camera.zoom
// Also extract: renderer.info.render.{calls, vertices, faces}, renderer.info.memory.{geometries, textures}
```

#### Extraction 3: DOM Structure + Keypoints + Sub-slides + Word Spans

```javascript
// Extract slide DOM data
document.querySelectorAll('.c-slide').map((slide, i) => ({
  isActive: slide.classList.contains('is-active'),
  h2Text: slide.querySelector('h2')?.textContent?.trim(),
  wordCount: slide.querySelectorAll('.js-word').length,
  words: [...slide.querySelectorAll('.js-word')].map(w => w.textContent.trim()),
  keypoints: [...slide.querySelectorAll('.c-keypoint')].map(kp => ({
    label: kp.querySelector('.c-keypoint__label')?.textContent?.trim(),
    content: kp.querySelector('.c-keypoint__content')?.textContent?.trim(),
    style: kp.style.cssText // Live transform coordinates
  })),
  subSlides: [...slide.querySelectorAll('.c-slide-bottom__slide')].map(ss => ({
    title: ss.querySelector('.c-slide-bottom__slide__title')?.textContent?.trim(),
    text: ss.querySelector('p')?.textContent?.trim()
  }))
}));
```

#### Extraction 4: WebGL Context Parameters

```javascript
const gl = canvas.getContext('webgl');
const ext = gl.getExtension('WEBGL_debug_renderer_info');
// Extract: viewport, clearColor, depthTest, depthFunc, blending params,
// cullFace, frontFace, maxTextureSize, maxVertexAttribs, maxVaryingVectors,
// renderer (UNMASKED_RENDERER_WEBGL), vendor, glVersion, glslVersion,
// extensions list (gl.getSupportedExtensions())
```

#### Extraction 5: GLSL Shader Source Code

```javascript
const currentProg = gl.getParameter(gl.CURRENT_PROGRAM);
const shaders = gl.getAttachedShaders(currentProg);
// For each shader: gl.getShaderSource(shader) → complete GLSL source
// For each uniform: gl.getActiveUniform(prog, i) → name, type, size
// For each uniform: gl.getUniform(prog, loc) → live matrix/value
```

#### Extraction 6: Vue Reactive State + EventHub Channels

```javascript
// VM data keys and values
Object.keys(vm.$data).map(k => ({ key: k, value: vm.$data[k] }));
// EventHub channels
Object.keys(vm.$children[N].eventHub._events);
// Animated uniforms (e.g., flag uTime)
mesh.material.uniforms.uTime.value;
```

#### Extraction 7: Network Resource Manifest

```javascript
performance.getEntriesByType('resource').filter(e =>
  e.name.includes('scene-N') || e.name.includes('slide-0N')
).map(e => ({
  name: e.name.split('/').pop(),
  fullUrl: e.name,
  encodedBodySize: e.encodedBodySize,
  decodedBodySize: e.decodedBodySize,
  type: e.initiatorType
}));
```

#### Extraction 8 (Conditional): Animated/Special Shader Materials

```javascript
// For meshes with unique shaders (e.g., flag uTime):
mesh.material.vertexShader;   // Pre-compilation user GLSL
mesh.material.fragmentShader; // Pre-compilation user GLSL
```

#### Extraction 9 (Conditional): EffectComposer / Post-Processing Pass Chain

```javascript
bg.composer.passes.map((pass, i) => ({
  index: i, type: pass.constructor?.name,
  enabled: pass.enabled, renderToScreen: pass.renderToScreen,
  uniformKeys: pass.material?.uniforms ? Object.keys(pass.material.uniforms) : [],
  fragmentShader: pass.material?.fragmentShader, // Complete post-processing GLSL
  uniformValues: { /* capture numeric/texture/vector uniform values */ }
}));
```

### Phase 4: Architectural Reconstruction

1. Reconstruct the full application architecture from module dependencies.
2. Build scene graph hierarchy from mesh/group/light instantiation patterns.
3. Trace camera rig hierarchies and damping/lerp update patterns.
4. Map GSAP timeline construction, nesting, and scroll binding logic.
5. Document state management architecture (Vuex, Redux, EventBus, signals, etc.).
6. **SPA Lifecycle Teardown**: If Barba.js, Swup, or similar SPA routers are present, document the page transition lifecycle: how WebGL contexts are destroyed (`WEBGL_lose_context`), how ScrollTrigger instances are killed, and how Lenis/scroll engines are re-initialized on route change.
7. **GPU Visibility Culling**: Check for `IntersectionObserver` instances attached to canvas elements or scene containers. Document how offscreen canvases pause their `requestAnimationFrame` loops and video playback.

## Runtime Inspection & Analysis Areas

When analyzing an interactive site or codebase, systematically inspect and document:

1. **DOM & Rendering Architecture**: Canvas embedding, stacking contexts, overlay synchronization, HTML-to-WebGL spatial matching.
2. **JavaScript Bundles & Module Structure**: Entry points, bundle splits, dynamic imports, library versions (Three.js, GSAP, R3F, Lenis, Locomotive, etc.). **Extract and map the full module dependency tree.**
3. **Three.js/WebGL Scene Graph**: Scene trees, node hierarchies, mesh composition, custom geometries, materials, uniforms. **For non-Three.js sites**: Raw WebGL context initialization, custom GLSL shader programs, texture upload patterns (`texImage2D` from `<video>` or `<img>` elements), and multi-canvas viewport mapping.
4. **Camera Hierarchy & Rig Architecture**: Camera types (Perspective/Orthographic), rig hierarchies, pivot points, FOV adaptations, smooth damping/lerping logic.
5. **Asset Loading Pipeline**: Asset formats (GLTF/GLB, Draco compression, KTX2/Basis textures, HDR environment maps, video textures), loading order, progress tracking.
6. **Shader Pipeline & Post-Processing**: Custom vertex/fragment shaders, GLSL passes, post-processing composer stack (Bloom, SMAA, Depth of Field, Chromatic Aberration, custom render targets).
7. **GSAP Timelines & Synchronization**: Master timeline construction, nested timelines, labels, relative offsets, duration scaling, callback hooks.
8. **ScrollTrigger Configuration**: Pinning mechanisms, scrub durations, start/end trigger bounds, snapping configurations, refresh lifecycle, media query adapters.
9. **Render Loop & Frame Scheduling**: `requestAnimationFrame` structure, delta time calculations, update execution order (Input -> Physics/Scroll -> Animation -> Camera -> Scene -> Render -> Post-process).
10. **State Management & Scroll Architecture**: Virtual scroll engines, normalized scroll delta tracking, direction detection, state machine hooks.
11. **Responsive & Mobile Adaptation**: Breakpoint-specific asset resolution, pixel ratio caps (`Math.min(window.devicePixelRatio, 2)`), touch interaction fallbacks, drawer/overlay UI shifts.
12. **Performance & Memory Lifecycle**: Draw call batching, instancing, texture resizing, geometry dispose lifecycle (`dispose()`), GPU memory release, event listener unbinds.

## Evidence Tier Labeling (Mandatory)

Every finding in the output specification MUST be explicitly tagged with one of:

- **[VERIFIED OBSERVATION]**: Directly observable from live runtime via Chrome DevTools MCP (`evaluate_script`, `list_network_requests`, `take_snapshot`, `list_console_messages`).
- **[EVIDENCE-BASED INFERENCE]**: Supported by module signatures, dependency patterns, or industry-standard architectural conventions. State the rationale.
- **[UNKNOWN FROM OBSERVABLE EVIDENCE]**: Cannot be confirmed. Provide:
  1. The most likely industry-standard implementation
  2. Technical rationale
  3. Confidence level: **High**, **Medium**, or **Low**
  4. Supporting evidence

## Quantitative Evidence Standard (Mandatory)

Every finding in the output specification MUST satisfy:

1. **Every numeric value** (vertex count, face count, FOV, position coordinates, draw calls, texture sizes, byte sizes) must originate from a live `evaluate_script` return value.
2. **No assumptions**: Do not assume values based on patterns from other pages/scenes.
3. **No generic code**: Do not copy GLSL or pseudocode from templates. Extract the actual source via `gl.getShaderSource()` or `material.fragmentShader`.
4. **No speculative interpretation**: If a value cannot be extracted, mark it `[UNKNOWN FROM OBSERVABLE EVIDENCE]` with confidence level.
5. **Page-specific tailoring**: Each audit must be 100% tailored to the specific page being audited. Scene graph, meshes, keypoints, word counts, sub-slides, and transforms are unique per page.

### Output Quality Benchmarks (from Act 1 & Act 2 gold standard)

| Metric | Minimum Target | Gold Standard (Act 2) |
| -------- | --------------- | ---------------------- |
| Total Lines | 600+ | 1,137 |
| Total Bytes | 25,000+ | 50,196 |
| Sections | 20 | 20 |
| GLSL Shader Programs Extracted | 2 (mesh + post-process) | 3 (mesh + flag + StretchPass) |
| Scene Graph Nodes (per-node data) | All children | 25 (with positions, rotations, scales, verts, faces, bounding spheres) |
| Vue Reactive State Keys | 10+ | 17 |
| EventHub Channels | 10+ | 15 |
| Network Assets with Byte Sizes | 5+ | 14 |
| WebGL Extensions Listed | All | 35 |
| GPU Hardware Identified | Yes | `NVIDIA GeForce RTX 3050 6GB...` |
| Active Uniform Matrices Captured | projectionMatrix + viewMatrix | Yes (full mat4 values) |

## Specification Deliverables Checklist

A complete forensic analysis specification must produce:

1. **Complete Application Architecture Diagram**
2. **Scene Graph Hierarchy**
3. **Module Dependency Graph**
4. **Initialization Sequence**
5. **Runtime Execution Flow**
6. **Event Flow Diagram**
7. **State Management Architecture**
8. **Camera Rig Implementation**
9. **Scroll Synchronization Architecture**
10. **Master GSAP Timeline Structure**
11. **Nested Timeline Organization**
12. **ScrollTrigger Registration Logic**
13. **Animation Sequencing Strategy**
14. **HTML/WebGL Synchronization Architecture**
15. **Render Loop Pseudocode**
16. **Resize Lifecycle**
17. **Asset Loading Lifecycle**
18. **Performance Optimization Strategy**
19. **Resource Cleanup Lifecycle**
20. **Fully Annotated Production-Ready Pseudocode**

## Output Artifact Format

The specification MUST be delivered as a single markdown artifact (`.md`) containing:

- **Mermaid diagrams** for architecture, sequence, and flow diagrams
- **Fenced code blocks** with language annotations for pseudocode and shader snippets
- **Structured headers** (`# Section N. Title`) for each of the 20 deliverables
- **Evidence tier tags** inline with findings (e.g., `[VERIFIED OBSERVATION]`, `[EVIDENCE-BASED INFERENCE]`)
- A **Technical Audit Summary** header section identifying the verified technology stack
- A **Subsystem Evidence Ledger** section defining evidence categorization methodology

## Subsystem Documentation Standard

For every subsystem:

- Explain **why** the architecture is structured that way.
- Identify dependencies.
- Describe update order and data flow.
- Explain synchronization with other systems.
- Highlight performance considerations and memory impacts.
