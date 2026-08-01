/**
 * MCP Chrome Live Site Forensic Extraction Battery
 * Standard JS Snippets for chrome-devtools-mcp -> evaluate_script tool
 * Target Framework: Three.js + Vue.js + GSAP + Custom WebGL Shaders
 */

// ============================================================================
// 1. ROUTE NAVIGATION & INITIAL STATE VERIFICATION
// ============================================================================
(() => {
  const appEl = document.querySelector('.c-application');
  const vm = appEl?.__vue__;
  if (!vm) return { error: 'No Root Vue Instance (__vue__)' };

  // Navigate to target route
  const targetRoute = '/on-race-day'; // Update as needed
  if (vm.$router) {
    vm.$router.push(targetRoute);
  } else {
    vm.slideIndex = 1;
  }

  return {
    slideIndex: vm.slideIndex,
    url: window.location.href,
    isReady: vm.isReady,
    isTouch: vm.isTouch,
    isMuted: vm.isMuted
  };
})();

// ============================================================================
// 2. THREE.JS SCENE GRAPH, CAMERA RIG & RENDERER STATS EXTRACTION
// ============================================================================
(() => {
  const appEl = document.querySelector('.c-application');
  const vm = appEl?.__vue__;
  const scenesComp = vm?.$children.find(c => c.$options?._componentTag === 'app-scenes');
  const bg = scenesComp?.background;
  
  // Select active scene by index N
  const sceneIdx = 1; // 0..5
  const sceneObj = bg?.scenes?.levels?.[0]?.[sceneIdx] || bg?.scenes?.active;

  if (!sceneObj || !sceneObj.scene) return { error: 'Scene not found', availableScenes: bg?.scenes?.levels?.[0]?.length };

  // Map Scene Graph Children (Meshes, Lights, Groups)
  let totalVerts = 0, totalFaces = 0;
  const children = sceneObj.scene.children.map((c, i) => {
    const item = {
      index: i,
      type: c.type || c.constructor?.name,
      name: c.name || '',
      visible: c.visible,
      position: c.position ? { x: +c.position.x.toFixed(4), y: +c.position.y.toFixed(4), z: +c.position.z.toFixed(4) } : null,
      rotation: c.rotation ? { x: +c.rotation.x.toFixed(4), y: +c.rotation.y.toFixed(4), z: +c.rotation.z.toFixed(4) } : null,
      scale: c.scale ? { x: +c.scale.x.toFixed(4), y: +c.scale.y.toFixed(4), z: +c.scale.z.toFixed(4) } : null
    };

    if (c.geometry) {
      const g = c.geometry;
      const vCount = g.attributes?.position?.count || g.vertices?.length || 0;
      const fCount = g.index ? g.index.count / 3 : (g.faces?.length || 0);
      totalVerts += vCount;
      totalFaces += fCount;
      item.geometry = {
        type: g.type || g.constructor?.name,
        vertexCount: vCount,
        faceCount: fCount,
        boundingSphere: g.boundingSphere ? {
          center: { x: +g.boundingSphere.center.x.toFixed(3), y: +g.boundingSphere.center.y.toFixed(3), z: +g.boundingSphere.center.z.toFixed(3) },
          radius: +g.boundingSphere.radius.toFixed(3)
        } : null
      };
    }

    if (c.material) {
      const m = c.material;
      item.material = {
        type: m.type || m.constructor?.name,
        transparent: m.transparent,
        depthTest: m.depthTest,
        depthWrite: m.depthWrite,
        side: m.side,
        blending: m.blending,
        uniformKeys: m.uniforms ? Object.keys(m.uniforms) : []
      };
      if (m.uniforms) {
        item.materialUniforms = {};
        Object.keys(m.uniforms).forEach(k => {
          const v = m.uniforms[k]?.value;
          if (v === null || typeof v === 'number' || typeof v === 'boolean') item.materialUniforms[k] = v;
          else if (typeof v === 'string') item.materialUniforms[k] = v;
          else if (v && v.isTexture) item.materialUniforms[k] = `[Texture: ${v.image?.src?.split('/').pop() || 'loaded'}]`;
          else if (v && v.isVector3) item.materialUniforms[k] = [+v.x.toFixed(4), +v.y.toFixed(4), +v.z.toFixed(4)];
        });
      }
    }
    return item;
  });

  // Extract Camera Rig Details
  const cam = sceneObj.camera;
  const camera = cam ? {
    type: cam.type || cam.constructor?.name,
    fov: cam.fov, near: cam.near, far: cam.far,
    aspect: +cam.aspect.toFixed(5), zoom: cam.zoom,
    position: { x: +cam.position.x.toFixed(5), y: +cam.position.y.toFixed(5), z: +cam.position.z.toFixed(5) },
    rotation: { x: +cam.rotation.x.toFixed(6), y: +cam.rotation.y.toFixed(6), z: +cam.rotation.z.toFixed(6), order: cam.rotation.order }
  } : null;

  // Extract Renderer Stats
  const r = bg.renderer;
  const rendererStats = r ? {
    frame: r.info?.render?.frame,
    calls: r.info?.render?.calls,
    vertices: r.info?.render?.vertices,
    faces: r.info?.render?.faces,
    memoryGeometries: r.info?.memory?.geometries,
    memoryTextures: r.info?.memory?.textures
  } : null;

  return {
    sceneIndex: sceneObj.index,
    childCount: children.length,
    children, camera, rendererStats,
    totalVerts, totalFaces
  };
})();

// ============================================================================
// 3. DOM SNAPSHOT, KEYPOINTS & SUB-SLIDE EXTRACTION
// ============================================================================
(() => {
  const appEl = document.querySelector('.c-application');
  const vm = appEl?.__vue__;

  const slides = Array.from(document.querySelectorAll('.c-slide')).map((slide, i) => {
    const keypoints = Array.from(slide.querySelectorAll('.c-keypoint')).map(kp => ({
      label: kp.querySelector('.c-keypoint__label')?.textContent?.trim(),
      content: kp.querySelector('.c-keypoint__content')?.textContent?.trim(),
      style: kp.style.cssText,
      classes: kp.className
    }));

    const subSlides = Array.from(slide.querySelectorAll('.c-slide-bottom__slide')).map(ss => ({
      title: ss.querySelector('.c-slide-bottom__slide__title')?.textContent?.trim(),
      text: ss.querySelector('p')?.textContent?.trim()
    }));

    const words = Array.from(slide.querySelectorAll('.js-word')).map(w => w.textContent.trim());

    return {
      index: i,
      isActive: slide.classList.contains('is-active'),
      h2Text: slide.querySelector('h2')?.textContent?.trim(),
      descriptionText: slide.querySelector('.c-slide-description')?.textContent?.trim(),
      wordCount: words.length,
      words,
      keypointCount: keypoints.length,
      keypoints,
      subSlideCount: subSlides.length,
      subSlides
    };
  });

  return {
    activeSlideIndex: vm?.slideIndex,
    slideData: slides[vm?.slideIndex || 0],
    totalSlides: slides.length
  };
})();

// ============================================================================
// 4. WEBGL CONTEXT PARAMETERS & GPU HARDWARE IDENTIFICATION
// ============================================================================
(() => {
  const canvas = document.querySelector('canvas');
  if (!canvas) return { error: 'No canvas found' };
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return { error: 'No WebGL context' };

  const ext = gl.getExtension('WEBGL_debug_renderer_info');

  return {
    canvasDimensions: [canvas.width, canvas.height],
    viewport: Array.from(gl.getParameter(gl.VIEWPORT)),
    clearColor: Array.from(gl.getParameter(gl.COLOR_CLEAR_VALUE)).map(v => +v.toFixed(4)),
    depthTest: gl.isEnabled(gl.DEPTH_TEST),
    depthFunc: gl.getParameter(gl.DEPTH_FUNC),
    blending: gl.isEnabled(gl.BLEND),
    blendSrcRGB: gl.getParameter(gl.BLEND_SRC_RGB),
    blendDstRGB: gl.getParameter(gl.BLEND_DST_RGB),
    cullFace: gl.isEnabled(gl.CULL_FACE),
    frontFace: gl.getParameter(gl.FRONT_FACE),
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
    maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
    maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
    gpuRenderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    gpuVendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
    glVersion: gl.getParameter(gl.VERSION),
    glslVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    extensions: gl.getSupportedExtensions()
  };
})();

// ============================================================================
// 5. GLSL SHADER SOURCE CODE & ACTIVE UNIFORMS EXTRACTION
// ============================================================================
(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) return { error: 'No WebGL context' };

  const currentProg = gl.getParameter(gl.CURRENT_PROGRAM);
  if (!currentProg) return { error: 'No active bound GL program' };

  const shaders = gl.getAttachedShaders(currentProg);
  const shaderSources = shaders.map((shader, i) => ({
    index: i,
    type: gl.getShaderParameter(shader, gl.SHADER_TYPE) === gl.VERTEX_SHADER ? 'VERTEX_SHADER' : 'FRAGMENT_SHADER',
    source: gl.getShaderSource(shader),
    length: gl.getShaderSource(shader)?.length || 0
  }));

  const numUniforms = gl.getProgramParameter(currentProg, gl.ACTIVE_UNIFORMS);
  const uniforms = [];
  for (let i = 0; i < numUniforms; i++) {
    const info = gl.getActiveUniform(currentProg, i);
    const loc = gl.getUniformLocation(currentProg, info.name);
    let val = null;
    try { val = gl.getUniform(currentProg, loc); } catch(e) {}
    uniforms.push({
      name: info.name, type: info.type, size: info.size,
      value: val instanceof Float32Array ? Array.from(val).map(v => +v.toFixed(4)) : val
    });
  }

  return { shaderSources, uniformCount: uniforms.length, uniforms };
})();

// ============================================================================
// 6. VUE REACTIVE STATE & EVENTHUB CHANNELS
// ============================================================================
(() => {
  const appEl = document.querySelector('.c-application');
  const vm = appEl?.__vue__;
  if (!vm) return { error: 'No VM' };

  const vmData = {};
  Object.keys(vm.$data || {}).forEach(k => {
    const v = vm.$data[k];
    if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'string' || v === null) {
      vmData[k] = v;
    } else if (Array.isArray(v)) {
      vmData[k] = `[Array:${v.length}]`;
    } else if (typeof v === 'object' && v) {
      vmData[k] = `{Object:${Object.keys(v).join(',')}}`;
    }
  });

  const scenesComp = vm.$children.find(c => c.$options?._componentTag === 'app-scenes');
  const eventHubEvents = scenesComp?.eventHub?._events ? Object.keys(scenesComp.eventHub._events) : [];

  return {
    vmDataKeys: Object.keys(vm.$data),
    vmData,
    eventHubEvents,
    childComponents: vm.$children.map(c => c.$options?._componentTag || c.$options?.name || 'anonymous')
  };
})();

// ============================================================================
// 7. NETWORK RESOURCE MANIFEST & BYTE SIZES
// ============================================================================
(() => {
  const entries = performance.getEntriesByType('resource');
  const manifest = entries.map(e => ({
    name: e.name.split('/').pop(),
    url: e.name,
    type: e.initiatorType,
    encodedBodySize: e.encodedBodySize,
    decodedBodySize: e.decodedBodySize,
    duration: +e.duration.toFixed(1)
  })).filter(e =>
    e.url.includes('.webp') || e.url.includes('.json') ||
    e.url.includes('.mp3') || e.url.includes('.png')
  );

  return {
    totalResources: entries.length,
    filteredAssetCount: manifest.length,
    manifest
  };
})();
