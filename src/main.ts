/**
 * Main entry point for the dungeon crawler game
 *
 * This file:
 * - Initializes the game when the page loads
 * - Handles the loading screen
 * - Creates the game instance
 */

import { Game } from './core/Game';

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading')!;
  const canvasContainer = document.getElementById('canvas-container')!;

  // Initialize game
  try {
    const game = new Game(canvasContainer);

    // Hide loading screen
    setTimeout(() => {
      loading.classList.add('hidden');
    }, 500);

    console.log('🎮 Dungeon Crawler initialized successfully!');
    console.log('📚 Use arrow keys or WASD to move');
    console.log('⚔️  Walk into enemies to attack them');
    console.log('🧪 Collect health potions to heal');
    console.log('🚪 Find the golden stairs to descend deeper');
  } catch (error) {
    console.error('Failed to initialize game:', error);
    loading.textContent = 'Error loading game. Please refresh the page.';
  }
});
