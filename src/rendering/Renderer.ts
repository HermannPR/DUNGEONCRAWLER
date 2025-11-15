/**
 * Renderer - Three.js rendering system
 *
 * This class manages:
 * - Scene setup and camera
 * - Rendering the dungeon grid
 * - Rendering entities as 2D sprites in 3D space
 * - Camera positioning and updates
 */

import * as THREE from 'three';
import { Dungeon } from '../world/Dungeon';
import { Entity } from '../entities/Entity';
import { TileType } from '../types';

export class Renderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private dungeon: Dungeon | null = null;
  private tilesMeshes: THREE.Mesh[][] = [];
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

  constructor(container: HTMLElement) {
    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Setup camera (bird's eye view at an angle)
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(20, 25, 20);
    this.camera.lookAt(20, 0, 20);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Setup lights
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    this.directionalLight.position.set(10, 20, 10);
    this.scene.add(this.directionalLight);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * Render the dungeon tiles
   */
  renderDungeon(dungeon: Dungeon): void {
    this.dungeon = dungeon;

    // Clear existing tiles
    this.clearTiles();

    // Create meshes for all tiles
    for (let z = 0; z < dungeon.height; z++) {
      this.tilesMeshes[z] = [];
      for (let x = 0; x < dungeon.width; x++) {
        const tile = dungeon.tiles[z][x];
        const mesh = this.createTileMesh(tile.getColor(), x, z, tile.type);
        this.tilesMeshes[z][x] = mesh;
        this.scene.add(mesh);
      }
    }
  }

  /**
   * Create a mesh for a single tile
   */
  private createTileMesh(color: number, x: number, z: number, type: TileType): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    let height = 0.1;

    // Different geometry for walls vs floors
    if (type === TileType.WALL) {
      geometry = new THREE.BoxGeometry(1, 1, 1);
      height = 0.5;
    } else {
      geometry = new THREE.BoxGeometry(1, 0.1, 1);
    }

    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, height / 2, z);

    return mesh;
  }

  /**
   * Clear all tile meshes from the scene
   */
  private clearTiles(): void {
    for (const row of this.tilesMeshes) {
      for (const mesh of row) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    }
    this.tilesMeshes = [];
  }

  /**
   * Add an entity to the scene
   */
  addEntity(entity: Entity): void {
    const mesh = entity.createMesh();
    this.scene.add(mesh);
  }

  /**
   * Remove an entity from the scene
   */
  removeEntity(entity: Entity): void {
    if (entity.mesh) {
      this.scene.remove(entity.mesh);
      entity.destroy();
    }
  }

  /**
   * Update camera to follow the player
   */
  updateCamera(playerX: number, playerZ: number): void {
    const cameraOffset = 15;
    const cameraHeight = 20;

    this.camera.position.x = playerX + cameraOffset;
    this.camera.position.y = cameraHeight;
    this.camera.position.z = playerZ + cameraOffset;

    this.camera.lookAt(playerX, 0, playerZ);
  }

  /**
   * Render the scene
   */
  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handle window resize
   */
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Cleanup renderer resources
   */
  dispose(): void {
    this.clearTiles();
    this.renderer.dispose();
  }
}
