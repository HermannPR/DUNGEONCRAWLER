/**
 * Entity - Base class for all game entities (player, enemies, items)
 *
 * This abstract class provides:
 * - Position tracking
 * - Stats management
 * - Common entity behavior
 */

import { Position, EntityType, Stats } from '../types';
import * as THREE from 'three';

export abstract class Entity {
  position: Position;
  type: EntityType;
  stats: Stats;
  mesh: THREE.Mesh | null = null;
  isAlive: boolean = true;
  name: string;

  constructor(position: Position, type: EntityType, stats: Stats, name: string) {
    this.position = position;
    this.type = type;
    this.stats = stats;
    this.name = name;
  }

  /**
   * Take damage and update HP
   * @returns true if entity died from the damage
   */
  takeDamage(damage: number): boolean {
    this.stats.hp -= damage;
    if (this.stats.hp <= 0) {
      this.stats.hp = 0;
      this.isAlive = false;
      return true;
    }
    return false;
  }

  /**
   * Heal the entity
   */
  heal(amount: number): void {
    this.stats.hp = Math.min(this.stats.hp + amount, this.stats.maxHp);
  }

  /**
   * Move to a new position
   */
  moveTo(newPosition: Position): void {
    this.position = newPosition;
    if (this.mesh) {
      this.mesh.position.x = newPosition.x;
      this.mesh.position.z = newPosition.z;
    }
  }

  /**
   * Get entity color for rendering
   */
  abstract getColor(): number;

  /**
   * Create the 3D mesh for this entity
   */
  createMesh(): THREE.Mesh {
    // Create a simple plane with a colored material
    const geometry = new THREE.PlaneGeometry(0.8, 0.8);
    const material = new THREE.MeshBasicMaterial({
      color: this.getColor(),
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, 0.5, this.position.z);
    this.mesh.rotation.x = -Math.PI / 2; // Lay flat on the ground

    return this.mesh;
  }

  /**
   * Destroy the mesh and cleanup
   */
  destroy(): void {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      (this.mesh.material as THREE.Material).dispose();
    }
  }
}
