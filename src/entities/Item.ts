/**
 * Item - Collectible items in the dungeon
 *
 * Items can be:
 * - Health potions
 * - Weapons (future enhancement)
 * - Armor (future enhancement)
 */

import { Position, EntityType, ItemType } from '../types';
import * as THREE from 'three';

export class Item {
  position: Position;
  itemType: ItemType;
  mesh: THREE.Mesh | null = null;
  isCollected: boolean = false;

  constructor(position: Position, itemType: ItemType) {
    this.position = position;
    this.itemType = itemType;
  }

  /**
   * Get item color based on type
   */
  getColor(): number {
    switch (this.itemType) {
      case ItemType.HEALTH_POTION:
        return 0xff00ff; // Magenta
      case ItemType.WEAPON:
        return 0xffff00; // Yellow
      case ItemType.ARMOR:
        return 0x00ffff; // Cyan
    }
  }

  /**
   * Get item name
   */
  getName(): string {
    switch (this.itemType) {
      case ItemType.HEALTH_POTION:
        return 'Health Potion';
      case ItemType.WEAPON:
        return 'Weapon';
      case ItemType.ARMOR:
        return 'Armor';
    }
  }

  /**
   * Create mesh for the item
   */
  createMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(0.3, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: this.getColor() });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, 0.3, this.position.z);

    return this.mesh;
  }

  /**
   * Destroy the mesh
   */
  destroy(): void {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      (this.mesh.material as THREE.Material).dispose();
    }
  }
}
