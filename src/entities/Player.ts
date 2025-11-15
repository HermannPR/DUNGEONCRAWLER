/**
 * Player - The player character
 *
 * The player:
 * - Can move in 4 directions on a grid
 * - Has stats (HP, attack, defense)
 * - Can level up and gain stats
 * - Has an inventory for items
 */

import { Entity } from './Entity';
import { Position, EntityType, Stats, Direction } from '../types';

export class Player extends Entity {
  experience: number = 0;
  experienceToNextLevel: number = 100;
  inventory: string[] = []; // Simple string-based inventory for now

  constructor(position: Position) {
    const initialStats: Stats = {
      maxHp: 100,
      hp: 100,
      attack: 10,
      defense: 5,
      level: 1,
    };

    super(position, EntityType.PLAYER, initialStats, 'Player');
  }

  /**
   * Get player color (blue)
   */
  getColor(): number {
    return 0x0066ff;
  }

  /**
   * Calculate the next position based on direction
   */
  getNextPosition(direction: Direction): Position {
    const newPos = { ...this.position };

    switch (direction) {
      case Direction.UP:
        newPos.z -= 1;
        break;
      case Direction.DOWN:
        newPos.z += 1;
        break;
      case Direction.LEFT:
        newPos.x -= 1;
        break;
      case Direction.RIGHT:
        newPos.x += 1;
        break;
    }

    return newPos;
  }

  /**
   * Gain experience and potentially level up
   */
  gainExperience(amount: number): boolean {
    this.experience += amount;

    if (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
      return true;
    }

    return false;
  }

  /**
   * Level up and increase stats
   */
  private levelUp(): void {
    this.stats.level += 1;
    this.experience -= this.experienceToNextLevel;
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);

    // Increase stats
    this.stats.maxHp += 20;
    this.stats.hp = this.stats.maxHp; // Full heal on level up
    this.stats.attack += 3;
    this.stats.defense += 2;
  }

  /**
   * Add an item to inventory
   */
  addItem(item: string): void {
    this.inventory.push(item);
  }

  /**
   * Use a health potion from inventory
   */
  useHealthPotion(): boolean {
    const potionIndex = this.inventory.indexOf('health_potion');
    if (potionIndex !== -1) {
      this.inventory.splice(potionIndex, 1);
      this.heal(30);
      return true;
    }
    return false;
  }
}
