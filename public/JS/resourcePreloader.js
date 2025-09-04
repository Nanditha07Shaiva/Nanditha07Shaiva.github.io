// resourcePreloader.js

export const images = {
  footerMoon: 'public/images/moon.webp',
  moonTexture: 'public/images/moon_texture.jpg',
  stars: 'public/images/stars.webp',
  one: 'public/images/projects/one.png',
  two: 'public/images/projects/two.jpg',
  three: 'public/images/projects/three.png'
};

export async function preloadResources() {
  const projectImages = document.querySelectorAll('.project-image img');
  const imageUrls = Array.from(projectImages).map((img) => img.src);

  // Preload images
  const imagePromises = [...imageUrls, ...Object.values(images)].map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  });

  try {
    await Promise.all(imagePromises);
  } catch (error) {
    throw error;
  }
}
