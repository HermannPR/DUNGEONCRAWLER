/**
 * Core type definitions for the dungeon crawler game
 */

/**
 * Represents a 2D position in the grid-based dungeon
 */
export interface Position {
  x: number;
  z: number; // Using z instead of y for 3D space (y is up/down)
}

/**
 * Direction enumeration for movement
 */
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

/**
 * Tile types in the dungeon
 */
export enum TileType {
  FLOOR = 'FLOOR',
  WALL = 'WALL',
  DOOR = 'DOOR',
  STAIRS_DOWN = 'STAIRS_DOWN',
}

/**
 * Entity types in the game
 */
export enum EntityType {
  PLAYER = 'PLAYER',
  ENEMY = 'ENEMY',
  ITEM = 'ITEM',
}

/**
 * Item types that can be found in the dungeon
 */
export enum ItemType {
  HEALTH_POTION = 'HEALTH_POTION',
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
}

/**
 * Base stats for combat entities
 */
export interface Stats {
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  level: number;
}

/**
 * Combat result information
 */
export interface CombatResult {
  attacker: string;
  defender: string;
  damage: number;
  defenderDied: boolean;
}

/**
 * Game state enumeration
 */
export enum GameState {
  PLAYING = 'PLAYING',
  PLAYER_TURN = 'PLAYER_TURN',
  ENEMY_TURN = 'ENEMY_TURN',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
}
