import { useEffect, useRef } from 'react';
import {
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  WebGLRenderer,
} from 'three';

const vertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform float uTime;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash(i);
  float n100 = hash(i + vec3(1.0,0.0,0.0));
  float n010 = hash(i + vec3(0.0,1.0,0.0));
  float n110 = hash(i + vec3(1.0,1.0,0.0));
  float n001 = hash(i + vec3(0.0,0.0,1.0));
  float n101 = hash(i + vec3(1.0,0.0,1.0));
  float n011 = hash(i + vec3(0.0,1.0,1.0));
  float n111 = hash(i + vec3(1.0,1.0,1.0));
  return mix(
    mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y),
    mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y),
    f.z
  );
}

void main() {
  vec3 p = position;
  float n1 = noise(normal * 1.9 + uTime * 0.22);
  float n2 = noise(normal * 4.25 - uTime * 0.14);
  float displacement = (n1 - 0.5) * 5.5 + (n2 - 0.5) * 1.8;
  p += normal * displacement;

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorldPosition = world.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(vec3(0.55, 0.75, 1.0));
  float diffuse = max(dot(normal, lightDir), 0.0);
  float rim = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.3);
  float vertical = clamp((vWorldPosition.y + 30.0) / 60.0, 0.0, 1.0);
  vec3 base = mix(uColorB, uColorA, vertical);
  base *= 0.34 + diffuse * 0.78 + rim * 0.18;
  gl_FragColor = vec4(base, 0.96);
}
`;

export default function DisplacementSphere() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const mouseRef = useRef(new Vector2(0.5, 0.5));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const scene = new Scene();
    const camera = new PerspectiveCamera(46, 1, 0.1, 200);
    camera.position.z = 58;

    const geometry = new SphereGeometry(31, 144, 144);
    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: { x: 0.06, y: 0.52, z: 0.57 } },
        uColorB: { value: { x: 0.04, y: 0.17, z: 0.21 } },
      },
      vertexShader,
      fragmentShader,
    });

    const sphere = new Mesh(geometry, material);
    sphere.position.set(23, 11, 0);
    sphere.rotation.z = -0.15;
    scene.add(sphere);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 1.15;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (width <= 700) {
        sphere.scale.setScalar(0.66);
        sphere.position.set(16, 15, 0);
      } else if (width <= 1050) {
        sphere.scale.setScalar(0.82);
        sphere.position.set(20, 13, 0);
      } else {
        sphere.scale.setScalar(1);
        sphere.position.set(23, 11, 0);
      }
    };

    const onMouseMove = (event) => {
      mouseRef.current.x = event.clientX / window.innerWidth;
      mouseRef.current.y = event.clientY / window.innerHeight;
    };

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      material.uniforms.uTime.value = performance.now() * 0.00055;

      const targetX = (mouseRef.current.y - 0.5) * 0.65;
      const targetY = (mouseRef.current.x - 0.5) * 0.85;
      sphere.rotation.x += (targetX - sphere.rotation.x) * 0.035;
      sphere.rotation.y += (targetY - sphere.rotation.y) * 0.035;
      sphere.rotation.z += 0.0013;
      renderer.render(scene, camera);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="sphere-canvas" aria-hidden="true" />;
}
