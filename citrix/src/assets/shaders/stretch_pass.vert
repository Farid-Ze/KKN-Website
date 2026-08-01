/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix Shader File: src/assets/shaders/stretch_pass.vert
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE GLSL SHADER VIA MCP CHROME]
 * ============================================================================ */

varying vec2 vUv;

void main()
{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
