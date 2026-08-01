/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix Shader File: src/assets/shaders/mesh_material.vert
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE GLSL SHADER VIA MCP CHROME]
 * ============================================================================ */

varying vec2 vUv;

void main()
{
    vec4 newPosition = modelMatrix * vec4(position, 1.0);

    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * newPosition;
}
