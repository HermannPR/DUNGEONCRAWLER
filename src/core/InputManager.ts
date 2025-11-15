/**
 * InputManager - Handles keyboard and touch input
 *
 * This class manages:
 * - Keyboard events (arrow keys, WASD)
 * - Mobile touch controls
 * - Input buffering to prevent multiple actions per turn
 */

import { Direction } from '../types';

type InputCallback = (direction: Direction) => void;

export class InputManager {
  private inputCallback: InputCallback | null = null;
  private isInputEnabled = true;

  /**
   * Initialize input listeners
   */
  constructor() {
    this.setupKeyboardControls();
    this.setupMobileControls();
  }

  /**
   * Set the callback function to handle input
   */
  setInputCallback(callback: InputCallback): void {
    this.inputCallback = callback;
  }

  /**
   * Enable or disable input processing
   */
  setInputEnabled(enabled: boolean): void {
    this.isInputEnabled = enabled;
  }

  /**
   * Setup keyboard event listeners
   */
  private setupKeyboardControls(): void {
    document.addEventListener('keydown', (event) => {
      if (!this.isInputEnabled || !this.inputCallback) return;

      let direction: Direction | null = null;

      // Handle arrow keys and WASD
      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          direction = Direction.UP;
          break;
        case 'arrowdown':
        case 's':
          direction = Direction.DOWN;
          break;
        case 'arrowleft':
        case 'a':
          direction = Direction.LEFT;
          break;
        case 'arrowright':
        case 'd':
          direction = Direction.RIGHT;
          break;
      }

      if (direction) {
        event.preventDefault();
        this.inputCallback(direction);
      }
    });
  }

  /**
   * Setup mobile touch controls
   */
  private setupMobileControls(): void {
    const controlButtons = document.querySelectorAll('.control-btn');

    controlButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        if (!this.isInputEnabled || !this.inputCallback) return;

        event.preventDefault();
        const directionStr = (button as HTMLElement).dataset.direction;

        let direction: Direction | null = null;
        switch (directionStr) {
          case 'up':
            direction = Direction.UP;
            break;
          case 'down':
            direction = Direction.DOWN;
            break;
          case 'left':
            direction = Direction.LEFT;
            break;
          case 'right':
            direction = Direction.RIGHT;
            break;
        }

        if (direction) {
          this.inputCallback(direction);
        }
      });
    });
  }
}
