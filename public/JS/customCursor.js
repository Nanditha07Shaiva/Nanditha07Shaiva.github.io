// customCursor.js

export function initializeCustomCursor() {
  const cursor = document.getElementById('custom-cursor');

  if (!cursor) {
    console.warn('Circular cursor element not found');
    return;
  }

  // Check if the device is a PC and does not support touch
  if (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(hover: none)').matches
  ) {
    // Show the cursor
    cursor.style.display = 'block';

    // Initially position cursor at center of screen
    cursor.style.left = `${window.innerWidth / 2 - 15}px`;
    cursor.style.top = `${window.innerHeight / 2 - 15}px`;

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    // Select interactive elements
    const interactiveElements = document.querySelectorAll('a, .load-content');

    // Handle interactive elements
    interactiveElements.forEach((element) => {
      element.addEventListener('mouseover', () =>
        cursor.classList.add('hover')
      );
      element.addEventListener('mouseout', () =>
        cursor.classList.remove('hover')
      );
    });
  } else {
    // Hide the cursor for touch devices
    cursor.style.display = 'none';
  }
}
