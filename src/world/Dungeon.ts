/**
 * Dungeon - Procedural dungeon generator
 *
 * This class generates a dungeon using a rooms-and-corridors algorithm:
 * 1. Create random rooms
 * 2. Connect rooms with L-shaped corridors
 * 3. Place stairs to next level
 *
 * The dungeon is grid-based and returns a 2D array of Tiles
 */

import { Tile } from './Tile';
import { TileType, Position } from '../types';
import { randomInt } from '../utils/helpers';

interface Room {
  x: number;
  z: number;
  width: number;
  height: number;
}

export class Dungeon {
  width: number;
  height: number;
  tiles: Tile[][];
  rooms: Room[] = [];
  playerStartPosition: Position;
  stairsPosition: Position | null = null;

  constructor(width: number = 40, height: number = 40) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.playerStartPosition = { x: 0, z: 0 };
    this.generate();
  }

  /**
   * Generate the dungeon
   */
  private generate(): void {
    // Initialize with all walls
    this.initializeWalls();

    // Create rooms
    const roomCount = randomInt(6, 10);
    for (let i = 0; i < roomCount; i++) {
      this.createRoom();
    }

    // Connect rooms with corridors
    for (let i = 0; i < this.rooms.length - 1; i++) {
      this.connectRooms(this.rooms[i], this.rooms[i + 1]);
    }

    // Set player start position (center of first room)
    const firstRoom = this.rooms[0];
    this.playerStartPosition = {
      x: Math.floor(firstRoom.x + firstRoom.width / 2),
      z: Math.floor(firstRoom.z + firstRoom.height / 2),
    };

    // Place stairs in the last room
    const lastRoom = this.rooms[this.rooms.length - 1];
    this.stairsPosition = {
      x: Math.floor(lastRoom.x + lastRoom.width / 2),
      z: Math.floor(lastRoom.z + lastRoom.height / 2),
    };
    this.tiles[this.stairsPosition.z][this.stairsPosition.x].type = TileType.STAIRS_DOWN;
  }

  /**
   * Initialize the dungeon with all walls
   */
  private initializeWalls(): void {
    for (let z = 0; z < this.height; z++) {
      this.tiles[z] = [];
      for (let x = 0; x < this.width; x++) {
        this.tiles[z][x] = new Tile(TileType.WALL, { x, z });
      }
    }
  }

  /**
   * Create a random room
   */
  private createRoom(): void {
    const width = randomInt(4, 10);
    const height = randomInt(4, 10);
    const x = randomInt(1, this.width - width - 1);
    const z = randomInt(1, this.height - height - 1);

    const newRoom: Room = { x, z, width, height };

    // Check if room overlaps with existing rooms
    const overlaps = this.rooms.some((room) => this.roomsOverlap(newRoom, room));

    if (!overlaps) {
      this.rooms.push(newRoom);
      this.carveRoom(newRoom);
    }
  }

  /**
   * Check if two rooms overlap
   */
  private roomsOverlap(room1: Room, room2: Room): boolean {
    return (
      room1.x < room2.x + room2.width + 1 &&
      room1.x + room1.width + 1 > room2.x &&
      room1.z < room2.z + room2.height + 1 &&
      room1.z + room1.height + 1 > room2.z
    );
  }

  /**
   * Carve out floor tiles for a room
   */
  private carveRoom(room: Room): void {
    for (let z = room.z; z < room.z + room.height; z++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        this.tiles[z][x] = new Tile(TileType.FLOOR, { x, z });
      }
    }
  }

  /**
   * Connect two rooms with an L-shaped corridor
   */
  private connectRooms(room1: Room, room2: Room): void {
    const point1 = {
      x: Math.floor(room1.x + room1.width / 2),
      z: Math.floor(room1.z + room1.height / 2),
    };
    const point2 = {
      x: Math.floor(room2.x + room2.width / 2),
      z: Math.floor(room2.z + room2.height / 2),
    };

    // Randomly choose horizontal-first or vertical-first
    if (Math.random() < 0.5) {
      this.createHorizontalCorridor(point1.x, point2.x, point1.z);
      this.createVerticalCorridor(point1.z, point2.z, point2.x);
    } else {
      this.createVerticalCorridor(point1.z, point2.z, point1.x);
      this.createHorizontalCorridor(point1.x, point2.x, point2.z);
    }
  }

  /**
   * Create a horizontal corridor
   */
  private createHorizontalCorridor(x1: number, x2: number, z: number): void {
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);

    for (let x = startX; x <= endX; x++) {
      if (this.isInBounds(x, z)) {
        this.tiles[z][x] = new Tile(TileType.FLOOR, { x, z });
      }
    }
  }

  /**
   * Create a vertical corridor
   */
  private createVerticalCorridor(z1: number, z2: number, x: number): void {
    const startZ = Math.min(z1, z2);
    const endZ = Math.max(z1, z2);

    for (let z = startZ; z <= endZ; z++) {
      if (this.isInBounds(x, z)) {
        this.tiles[z][x] = new Tile(TileType.FLOOR, { x, z });
      }
    }
  }

  /**
   * Check if a position is within dungeon bounds
   */
  isInBounds(x: number, z: number): boolean {
    return x >= 0 && x < this.width && z >= 0 && z < this.height;
  }

  /**
   * Get a tile at a specific position
   */
  getTile(position: Position): Tile | null {
    if (!this.isInBounds(position.x, position.z)) {
      return null;
    }
    return this.tiles[position.z][position.x];
  }

  /**
   * Check if a position is walkable
   */
  isWalkable(position: Position): boolean {
    const tile = this.getTile(position);
    return tile ? tile.walkable : false;
  }

  /**
   * Get all floor tiles (for spawning entities)
   */
  getFloorTiles(): Position[] {
    const floors: Position[] = [];
    for (let z = 0; z < this.height; z++) {
      for (let x = 0; x < this.width; x++) {
        if (this.tiles[z][x].type === TileType.FLOOR) {
          floors.push({ x, z });
        }
      }
    }
    return floors;
  }
}
