// moonRendering.js

import * as THREE from 'three';
import { images } from './resourcePreloader.js';

export function moonRenderer() {
  // DOM element to render into
  const base = document.querySelector('.base');
  const moonArea = document.querySelector('.moon-area');
  const circle = document.querySelector('.circle');

  if (!moonArea || !circle || !base) return;

  // Create scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  // Set renderer size to match circle (100vh)
  const size = window.innerHeight;
  document.documentElement.style.setProperty(
    '--moon-renderer-size',
    `${size}px`
  );
  renderer.setSize(size, size);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Position the renderer
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.right = '0';
  renderer.domElement.style.bottom = '0';
  renderer.domElement.style.margin = 'auto';
  renderer.domElement.style.pointerEvents = 'none';

  // Add renderer to DOM
  circle.appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();

  // Create moon
  const moonGeometry = new THREE.SphereGeometry(3, 64, 64);
  let moon;

  // Configure initial rotation to show specific face
  const initialRotation = {
    x: 0.03489, // ~2 degrees (actual moon's axis tilt is approximately 1.5°)
    y: Math.PI * 1,
    z: 0
  };

  // Variables for moon's rotation
  const rotationSpeed = {
    y: 0.0005 // Moon rotates once every ~27.3 days, but we accelerate this for visual effect
  };

  // Function to load the texture and create the moon
  function loadMoonTexture() {
    // Use cached texture if possible
    const texturePath = images.moonTexture;

    textureLoader.load(
      texturePath,
      function (texture) {
        // Create material with the loaded texture
        const moonMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1
        });
        createMoon(moonMaterial);
      },
      undefined,
      function (error) {
        console.error('Error loading texture:', error);
        // Fallback to a simple material if texture loading fails
        const fallbackMaterial = new THREE.MeshStandardMaterial({
          color: 0xaaaaaa,
          roughness: 0.8
        });
        createMoon(fallbackMaterial);
      }
    );
  }

  // Create the moon with the loaded material
  function createMoon(material) {
    moon = new THREE.Mesh(moonGeometry, material);
    scene.add(moon);

    // Set initial rotation
    moon.rotation.x = initialRotation.x;
    moon.rotation.y = initialRotation.y;
    moon.rotation.z = initialRotation.z;

    // Start animation once moon is created
    animate();
  }

  // Lighting setup explanation:
  // We use three lights to create a visually appealing and realistic rendering of the moon:
  // 1. AmbientLight provides soft, uniform illumination so the moon is never completely dark.
  // 2. DirectionalLight simulates sunlight, casting strong highlights and shadows from one side.
  // 3. RimLight is another directional light placed on the opposite side to create a subtle rim or edge light,
  //    which helps visually separate the moon from the background and adds depth.

  // Ambient light: softens overall scene lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  // Main directional light: simulates sunlight
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
  directionalLight.position.set(25, 25, 25);
  scene.add(directionalLight);

  // Rim light: adds a subtle edge highlight for depth
  const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
  rimLight.position.set(5, 0, 5);
  scene.add(rimLight);

  // Position camera
  camera.position.z = 6;

  // Handle window resize - debounced for optimization
  let resizeTimeout;
  const onWindowResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      const newSize = window.innerHeight;
      document.documentElement.style.setProperty(
        '--moon-renderer-size',
        `${newSize}px`
      );
      renderer.setSize(newSize, newSize);
    }, 100);
  };

  window.addEventListener('resize', onWindowResize);

  // Performance optimization: track if about section is visible
  let isVisible = false;
  const checkVisibility = () => {
    const aboutRect = base.getBoundingClientRect();
    isVisible = baseRect.top <= window.innerHeight && baseRect.bottom >= 0;
  };

  // Set up intersection observer for better performance
  const observer = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0].isIntersecting;
    },
    { threshold: 0.1 }
  );

  observer.observe(base);

  // Animation loop with optimized rendering
  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);

    // Only render when visible
    if (isVisible && moon) {
      // Apply automatic rotation based on real world axis
      moon.rotation.y += rotationSpeed.y;

      renderer.render(scene, camera);
    }
  }

  // Start loading the texture
  loadMoonTexture();

  // Clean up function
  return function cleanup() {
    window.removeEventListener('resize', onWindowResize);
    observer.disconnect();

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    if (circle.contains(renderer.domElement)) {
      circle.removeChild(renderer.domElement);
    }

    // Dispose of Three.js objects to prevent memory leaks
    if (moon) {
      moonGeometry.dispose();
      moon.material.dispose();
      scene.remove(moon);
    }

    renderer.dispose();
  };
}
