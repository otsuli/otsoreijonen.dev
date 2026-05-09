// @ts-ignore
import * as THREE from 'three';

export const sphereShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    iTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float iTime;
    varying vec2 vUv;

    mat2 Rot(float a) {
      float s = sin(a);
      float c = cos(a);
      return mat2(c, -s, s, c);
    }

    vec2 hash(vec2 p) {
      p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
      return fract(sin(p) * 43758.5453);
    }

    float noise(in vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float n = mix(
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
      return 0.5 + 0.5 * n;
    }

    float filmGrainNoise(in vec2 uv) {
      return length(hash(uv));
    }

    void main() {
      vec2 uv = vUv;

      // Transformed uv
      vec2 tuv = uv - 0.5;

      // Rotate with noise
      float degree = noise(vec2(iTime * 0.05, tuv.x * tuv.y));
      tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));

      // Wave warp with sine
      float frequency = 5.0;
      float amplitude = 30.0;
      float speed = iTime * 2.0;
      tuv.x += sin(tuv.y * frequency + speed) / amplitude;
      tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

      // Fire/autumn colors
      vec3 deepRed = vec3(128.0, 9.0, 9.0) / 255.0;
      vec3 orange = vec3(240.0, 127.0, 19.0) / 255.0;
      vec3 amber = vec3(240.0, 160.0, 30.0) / 255.0;
      vec3 darkBrown = vec3(80.0, 25.0, 5.0) / 255.0;
      vec3 yellow = vec3(255.0, 220.0, 50.0) / 255.0;

      // Cycle between fire tones
      float cycle = sin(iTime * 0.5);
      float t = (sign(cycle) * pow(abs(cycle), 0.6) + 1.0) / 2.0;

      // Mix across all colors using tuv position
      vec3 color1 = mix(deepRed, orange, smoothstep(-0.5, 0.5, tuv.x + tuv.y));
      vec3 color2 = mix(amber, yellow, smoothstep(-0.5, 0.5, tuv.x - tuv.y));
      vec3 color3 = mix(darkBrown, deepRed, smoothstep(-0.3, 0.3, tuv.y));

      vec3 layer1 = mix(color1, color2, smoothstep(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
      vec3 layer2 = mix(color2, color3, smoothstep(-0.3, 0.2, (tuv * Rot(radians(45.0))).x));

      vec3 color = mix(layer1, layer2, smoothstep(0.5, -0.3, tuv.y + sin(iTime * 0.3) * 0.2));

      // Apply film grain
      color = color - filmGrainNoise(uv) * 0.05;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
});