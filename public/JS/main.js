// main.js

import { initializeCustomCursor } from './customCursor.js';
import { preloadResources } from './resourcePreloader.js';
import { moonRenderer } from './moonRendering.js';
import { initializeNavigation, hoverEffect } from './animations.js';
import { setBackground } from './backgroundHandler.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize Custom Cursor
    initializeCustomCursor();

    // Preload Resources
    await preloadResources();

    // Interactive Features
    setBackground();
    moonRenderer();
    initializeNavigation();
    hoverEffect();
  } catch (error) {
    console.error('Initialization error:', error);
  }
});
