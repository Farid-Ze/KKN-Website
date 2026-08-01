"""
WebGL Forensic Analysis - Bundle Analyzer Script (v2.0 - Extended)
====================================================================
Reusable Python script for extracting module maps, library versions,
GLSL shaders, asset paths, and canvas rendering patterns from minified
JavaScript bundles (supports Webpack, Browserify, Rollup/Vite, ESBuild).

Usage:
    python analyze_bundle.py <url_or_local_path> [--output-dir ./output]
"""

import os
import re
import json
import sys
import argparse


def detect_bundler(js_content):
    """Detect the JavaScript bundler used to create the bundle."""
    results = []
    if 'webpackJsonp' in js_content or '__webpack_require__' in js_content or '__webpack_modules__' in js_content:
        results.append('webpack')
    if re.search(r'\d+:\[function\(', js_content):
        results.append('browserify')
    if 'parcelRequire' in js_content:
        results.append('parcel')
    if 'import(' in js_content or 'import.meta' in js_content or 'define(' in js_content:
        results.append('rollup/vite/esbuild (ESM)')
    if not results:
        results.append('unknown (generic minified JS)')
    return results


def detect_libraries(js_content):
    """Identify known libraries, frameworks, and GSAP plugins."""
    libs = {}

    # Three.js
    rev_match = re.findall(r'REVISION\s*[:=]\s*["\']?(\d+)["\']?', js_content)
    if rev_match:
        libs['three.js'] = f'r{rev_match[0]}'
    elif 'THREE' in js_content:
        libs['three.js'] = 'detected (version unknown)'

    # GSAP Core & Plugins
    if 'TweenMax' in js_content or 'TweenLite' in js_content:
        libs['gsap'] = 'v1/v2 (TweenMax/TweenLite)'
    elif 'gsap' in js_content:
        libs['gsap'] = 'v3+'

    for plugin in ['ScrollTrigger', 'CustomEase', 'SplitText', 'Flip', 'Draggable', 'MotionPathPlugin', 'DrawSVGPlugin']:
        if plugin in js_content:
            libs[f'GSAP Plugin ({plugin})'] = 'detected'

    # Scroll & Routing Engines
    if 'Lenis' in js_content or 'lenis' in js_content:
        libs['Lenis Smooth Scroll'] = 'detected'
    if 'barba' in js_content or 'Barba' in js_content:
        libs['Barba.js (SPA Routing)'] = 'detected'
    if 'Swiper' in js_content:
        libs['Swiper.js'] = 'detected'
    if 'Locomotive' in js_content:
        libs['LocomotiveScroll'] = 'detected'

    # CMS / Builders
    if 'Webflow' in js_content or 'w-mod-' in js_content:
        libs['Webflow Runtime'] = 'detected'
    if 'slater' in js_content or 'Slater' in js_content:
        libs['Slater.app Code Runtime'] = 'detected'

    # Frameworks
    if 'Vue' in js_content or '__vue__' in js_content:
        libs['Vue.js'] = 'detected'
    if 'React' in js_content or 'createElement' in js_content:
        libs['React'] = 'detected'

    # Three.js Ecosystem
    for loader in ['DRACOLoader', 'GLTFLoader', 'EffectComposer', 'RGBELoader', 'KTX2Loader']:
        if loader in js_content:
            libs[loader] = 'detected'

    return libs


def extract_browserify_modules(js_content):
    """Extract Browserify module IDs, code, and dependency maps."""
    pattern = re.compile(r'(\d+):\[function\(([^)]*)\)\{([\s\S]*?)\},(\{[\s\S]*?\})\]')
    modules = {}
    for match in pattern.finditer(js_content):
        mod_id = int(match.group(1))
        code = match.group(3)
        deps_str = match.group(4)
        modules[mod_id] = {'code': code, 'deps_str': deps_str}
    return modules


def extract_asset_paths(js_content):
    """Extract all referenced asset file paths (3D, video, audio, textures)."""
    pattern = re.compile(
        r'["\']([^"\']+\.(?:gltf|glb|hdr|exr|jpg|jpeg|png|webp|avif|mp4|hevc\.mp4|webm|json|bin|basis|ktx2|woff2?|svg|mp3|ogg|wav))["\']',
        re.IGNORECASE
    )
    return sorted(set(pattern.findall(js_content)))


def extract_glsl_shaders(js_content):
    """Identify and extract inline GLSL vertex/fragment shaders."""
    shaders = []
    # Search for template literal GLSL blocks
    shader_blocks = re.findall(r'(`[^`]*?(?:gl_Position|gl_FragColor|precision mediump|varying vec2)[^`]*?`)', js_content)
    for block in shader_blocks:
        shaders.append(block.strip('`'))
    return shaders


def extract_canvas_scenes(js_content):
    """Extract scene data attributes referenced in multi-canvas architectures."""
    return sorted(set(re.findall(r'\[data-([a-zA-Z0-9_-]+-scene)\]', js_content)))


def main():
    parser = argparse.ArgumentParser(description='WebGL Forensic Bundle Analyzer v2.0')
    parser.add_argument('source', help='Path to local JS file or URL to fetch')
    parser.add_argument('--output-dir', default='./bundle_analysis', help='Output directory')
    args = parser.parse_args()

    # Load JS content
    if args.source.startswith('http'):
        try:
            import urllib3
            import requests
            urllib3.disable_warnings()
            r = requests.get(args.source, verify=False)
            js_content = r.text
            print(f"Fetched {len(js_content)} bytes from {args.source}")
        except ImportError:
            print("ERROR: requests library required for URL fetching. Install with: pip install requests")
            sys.exit(1)
    else:
        with open(args.source, 'r', encoding='utf-8', errors='ignore') as f:
            js_content = f.read()
        print(f"Loaded {len(js_content)} bytes from {args.source}")

    os.makedirs(args.output_dir, exist_ok=True)

    # 1. Detect bundler
    bundlers = detect_bundler(js_content)
    print(f"\n--- Bundler Detection ---")
    print(f"  Detected: {', '.join(bundlers)}")

    # 2. Detect libraries
    libs = detect_libraries(js_content)
    print(f"\n--- Library Detection ---")
    for name, version in libs.items():
        print(f"  {name}: {version}")

    # 3. Canvas Scenes
    canvas_scenes = extract_canvas_scenes(js_content)
    if canvas_scenes:
        print(f"\n--- Multi-Canvas Scene Targets ({len(canvas_scenes)}) ---")
        for cs in canvas_scenes:
            print(f"  [data-{cs}]")

    # 4. Extract asset paths
    assets = extract_asset_paths(js_content)
    print(f"\n--- Asset Paths ({len(assets)}) ---")
    for a in assets[:25]:
        print(f"  {a}")
    if len(assets) > 25:
        print(f"  ... and {len(assets) - 25} more")

    with open(os.path.join(args.output_dir, 'assets.json'), 'w') as f:
        json.dump(assets, f, indent=2)

    # 5. Extract GLSL shaders
    shaders = extract_glsl_shaders(js_content)
    print(f"\n--- Inline GLSL Shader Blocks ({len(shaders)}) ---")
    if shaders:
        with open(os.path.join(args.output_dir, 'shaders.txt'), 'w', encoding='utf-8') as f:
            for i, s in enumerate(shaders):
                f.write(f"=== GLSL SHADER #{i+1} ===\n{s}\n\n")

    # Save summary report
    report = {
        'bundlers': bundlers,
        'libraries': libs,
        'canvas_scenes': canvas_scenes,
        'asset_count': len(assets),
        'shader_block_count': len(shaders),
    }
    with open(os.path.join(args.output_dir, 'summary.json'), 'w') as f:
        json.dump(report, f, indent=2)

    print(f"\n--- Analysis complete. Results saved to {args.output_dir}/ ---")


if __name__ == '__main__':
    main()
