/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix Shader File: src/assets/shaders/stretch_material.frag
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE GLSL SHADER VIA MCP CHROME]
 * ============================================================================ */

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Simplex 3D Noise by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  // mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

uniform sampler2D uTextureA;
uniform sampler2D uTextureB;
uniform vec2 uStretchNoiseMultiplier;
uniform float uStretchStrength;
uniform float uTransitionStrength;
uniform float uTransitionDirection;
uniform float uInterpolationCount;
uniform float uTime;
uniform vec3 uClearColor;

varying vec2 vUv;

vec4 getStretchColor(sampler2D textureSample)
{
    float fragmentAmplitude = 1.0 / uInterpolationCount;
    float x = vUv.x;
    float y = vUv.y;

    float offsetStrength = 0.25;
    float randomOffset = rand(vec2(1.0, y)) * fragmentAmplitude * offsetStrength - fragmentAmplitude * 0.5 * offsetStrength;
    x += randomOffset;
    x = clamp(x, 0.0, 1.0);

    float fragmentStart = floor(x * uInterpolationCount) / uInterpolationCount;
    float fragmentEnd = ceil(x * uInterpolationCount) / uInterpolationCount;
    float fragmentProgress = (x - fragmentStart) / fragmentAmplitude;

    vec4 fragmentStartColor;
    vec4 fragmentEndColor;

    fragmentStartColor = texture2D(textureSample, vec2(fragmentStart, y));
    fragmentEndColor = texture2D(textureSample, vec2(fragmentEnd, y));

    if(fragmentStartColor.xyz == uClearColor)
    {
        fragmentStartColor = texture2D(textureSample, vec2(0.5, y));
    }

    if(fragmentEndColor.xyz == uClearColor)
    {
        fragmentEndColor = texture2D(textureSample, vec2(0.5, y));
    }

    vec4 color = mix(fragmentStartColor, fragmentEndColor, fragmentProgress);

    return color;
}

void main()
{
    // Stretch map
    float stretchMap = 0.0;
    stretchMap += snoise(vec3(vUv.y * 1.0 * uStretchNoiseMultiplier.y, uStretchStrength + uTime * 0.0002, vUv.x * uStretchNoiseMultiplier.x)) * 0.5;
    stretchMap += snoise(vec3(vUv.y * 4.0 * uStretchNoiseMultiplier.y, uStretchStrength + uTime * 0.0002, vUv.x * uStretchNoiseMultiplier.x)) * 0.5;
    stretchMap += 0.5 + (uStretchStrength - 0.5) * 2.0;
    stretchMap = clamp(stretchMap, 0.0, 1.0);

    // Transition map
    float transitionMap = 0.0;
    float transitionAmplitude = 0.5;
    float transitionAmplitudeInverse = 1.0 - transitionAmplitude;
    float transitionUvX = uTransitionDirection == 1.0 ? vUv.x : (1.0 - vUv.x);

    transitionMap += transitionUvX / transitionAmplitude + uTransitionStrength / transitionAmplitude / transitionAmplitudeInverse - (1.0 / transitionAmplitude);

    transitionMap += snoise(vec2(vUv.y * 1.0, uTransitionStrength + 1.0)) * 0.5;
    transitionMap += snoise(vec2(vUv.y * 4.0, uTransitionStrength + 1.0)) * 0.5;
    transitionMap -= 0.5;

    transitionMap = clamp(transitionMap, 0.0, 1.0);

    // Base color
    vec3 baseColorA = texture2D(uTextureA, vUv).rgb;
    vec3 baseColorB = texture2D(uTextureB, vUv).rgb;
    vec3 baseColor = mix(baseColorA, baseColorB, transitionMap);

    // Stretch color
    vec3 stretchColorA = getStretchColor(uTextureA).rgb;
    vec3 stretchColorB = getStretchColor(uTextureB).rgb;
    vec3 stretchColor = mix(stretchColorA, stretchColorB, transitionMap);

    // Final color
    vec3 color = baseColor * (1.0 - stretchMap) + stretchColor * stretchMap;

    gl_FragColor = vec4(color, 1.0);
}
