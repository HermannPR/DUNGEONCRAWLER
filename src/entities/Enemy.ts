/**
 * Enemy - Enemy entities in the dungeon
 *
 * Enemies:
 * - Have different types with varying stats
 * - Use simple AI to chase the player
 * - Drop experience when defeated
 */

import { Entity } from './Entity';
import { Position, EntityType, Stats } from '../types';
import { manhattanDistance } from '../utils/helpers';

export enum EnemyClass {
  GOBLIN = 'GOBLIN',
  ORC = 'ORC',
  TROLL = 'TROLL',
}

export class Enemy extends Entity {
  enemyClass: EnemyClass;
  experienceReward: number;
  aggroRange: number = 5; // How close player needs to be to trigger chase

  constructor(position: Position, enemyClass: EnemyClass) {
    const stats = Enemy.getStatsForClass(enemyClass);
    const name = Enemy.getNameForClass(enemyClass);

    super(position, EntityType.ENEMY, stats, name);

    this.enemyClass = enemyClass;
    this.experienceReward = stats.level * 20;
  }

  /**
   * Get stats for enemy class
   */
  private static getStatsForClass(enemyClass: EnemyClass): Stats {
    switch (enemyClass) {
      case EnemyClass.GOBLIN:
        return {
          maxHp: 30,
          hp: 30,
          attack: 5,
          defense: 2,
          level: 1,
        };
      case EnemyClass.ORC:
        return {
          maxHp: 60,
          hp: 60,
          attack: 10,
          defense: 5,
          level: 3,
        };
      case EnemyClass.TROLL:
        return {
          maxHp: 100,
          hp: 100,
          attack: 15,
          defense: 8,
          level: 5,
        };
    }
  }

  /**
   * Get name for enemy class
   */
  private static getNameForClass(enemyClass: EnemyClass): string {
    switch (enemyClass) {
      case EnemyClass.GOBLIN:
        return 'Goblin';
      case EnemyClass.ORC:
        return 'Orc';
      case EnemyClass.TROLL:
        return 'Troll';
    }
  }

  /**
   * Get enemy color based on class
   */
  getColor(): number {
    switch (this.enemyClass) {
      case EnemyClass.GOBLIN:
        return 0x00ff00; // Green
      case EnemyClass.ORC:
        return 0xff6600; // Orange
      case EnemyClass.TROLL:
        return 0xff0000; // Red
    }
  }

  /**
   * Simple AI: Move towards player if in range
   * @returns The position to move to, or null if no movement
   */
  getAIMove(playerPosition: Position, isWalkable: (pos: Position) => boolean): Position | null {
    const distance = manhattanDistance(this.position, playerPosition);

    // Only chase if player is within aggro range
    if (distance > this.aggroRange) {
      return null;
    }

    // If adjacent to player, don't move (attack instead)
    if (distance === 1) {
      return null;
    }

    // Try to move closer to player
    const possibleMoves: Position[] = [
      { x: this.position.x, z: this.position.z - 1 }, // Up
      { x: this.position.x, z: this.position.z + 1 }, // Down
      { x: this.position.x - 1, z: this.position.z }, // Left
      { x: this.position.x + 1, z: this.position.z }, // Right
    ];

    // Find the move that gets us closest to the player
    let bestMove: Position | null = null;
    let bestDistance = distance;

    for (const move of possibleMoves) {
      if (isWalkable(move)) {
        const newDistance = manhattanDistance(move, playerPosition);
        if (newDistance < bestDistance) {
          bestDistance = newDistance;
          bestMove = move;
        }
      }
    }

    return bestMove;
  }

  /**
   * Check if enemy is adjacent to player (can attack)
   */
  isAdjacentTo(playerPosition: Position): boolean {
    return manhattanDistance(this.position, playerPosition) === 1;
  }
}
