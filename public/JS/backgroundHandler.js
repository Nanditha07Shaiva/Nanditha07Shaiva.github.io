//  backgroundHandler.js

import { images } from './resourcePreloader.js';

export function setBackground() {
  const base = document.querySelector('.base');
  const footerMoon = document.querySelector('.footer-moon');
  base.style.backgroundImage = `url(${images.stars})`;
  footerMoon.style.backgroundImage = `url(${images.footerMoon})`;
}
