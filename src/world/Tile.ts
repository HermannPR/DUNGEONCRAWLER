/**
 * Tile - Represents a single tile in the dungeon grid
 *
 * Each tile has:
 * - A type (floor, wall, door, stairs)
 * - A walkable property
 * - Visual properties for rendering
 */

import { TileType, Position } from '../types';

export class Tile {
  type: TileType;
  position: Position;
  walkable: boolean;

  constructor(type: TileType, position: Position) {
    this.type = type;
    this.position = position;
    this.walkable = this.determineWalkable(type);
  }

  /**
   * Determine if a tile type is walkable
   */
  private determineWalkable(type: TileType): boolean {
    switch (type) {
      case TileType.FLOOR:
      case TileType.STAIRS_DOWN:
        return true;
      case TileType.WALL:
      case TileType.DOOR:
        return false;
      default:
        return false;
    }
  }

  /**
   * Get the color for this tile type
   */
  getColor(): number {
    switch (this.type) {
      case TileType.FLOOR:
        return 0x444444;
      case TileType.WALL:
        return 0x888888;
      case TileType.DOOR:
        return 0x8b4513;
      case TileType.STAIRS_DOWN:
        return 0xffd700;
      default:
        return 0x000000;
    }
  }
}
