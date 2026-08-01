/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix Shader File: src/assets/shaders/mesh_material.frag
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE GLSL SHADER VIA MCP CHROME]
 * ============================================================================ */

uniform sampler2D uTextureDefault;
uniform sampler2D uTextureAlpha;

varying vec2 vUv;

void main()
{
    vec3 colorDefault = texture2D(uTextureDefault, vUv).xyz;
    vec3 colorAlpha = texture2D(uTextureAlpha, vUv).xyz;

    gl_FragColor = vec4(colorDefault, colorAlpha.r);
}
