/**
 * Game - Main game controller
 *
 * This class orchestrates the entire game:
 * - Manages game state and turn-based logic
 * - Coordinates between systems (rendering, input, combat)
 * - Handles player actions and enemy AI
 * - Manages level progression
 */

import { Renderer } from '../rendering/Renderer';
import { Dungeon } from '../world/Dungeon';
import { Player } from '../entities/Player';
import { Enemy, EnemyClass } from '../entities/Enemy';
import { Item } from '../entities/Item';
import { InputManager } from './InputManager';
import { UIManager } from '../ui/UIManager';
import { CombatSystem } from '../combat/CombatSystem';
import { Direction, GameState, Position, ItemType } from '../types';
import { randomInt, positionsEqual, randomElement } from '../utils/helpers';

export class Game {
  private renderer: Renderer;
  private dungeon: Dungeon;
  private player: Player;
  private enemies: Enemy[] = [];
  private items: Item[] = [];
  private inputManager: InputManager;
  private uiManager: UIManager;
  private gameState: GameState;
  private currentFloor: number = 1;

  constructor(container: HTMLElement) {
    // Initialize systems
    this.renderer = new Renderer(container);
    this.inputManager = new InputManager();
    this.uiManager = new UIManager();
    this.gameState = GameState.PLAYER_TURN;

    // Create initial dungeon and player
    this.dungeon = new Dungeon(40, 40);
    this.player = new Player(this.dungeon.playerStartPosition);

    // Setup input handling
    this.inputManager.setInputCallback((direction) => this.handlePlayerInput(direction));

    // Initialize game
    this.initializeLevel();
    this.startGameLoop();
  }

  /**
   * Initialize the current level
   */
  private initializeLevel(): void {
    // Render dungeon
    this.renderer.renderDungeon(this.dungeon);

    // Add player to scene
    this.renderer.addEntity(this.player);

    // Spawn enemies
    this.spawnEnemies();

    // Spawn items
    this.spawnItems();

    // Update camera and UI
    this.renderer.updateCamera(this.player.position.x, this.player.position.z);
    this.updateUI();

    this.uiManager.addLogMessage(`Welcome to Floor ${this.currentFloor}!`, 'info');
  }

  /**
   * Spawn enemies in the dungeon
   */
  private spawnEnemies(): void {
    const floorTiles = this.dungeon.getFloorTiles();
    const enemyCount = Math.min(5 + this.currentFloor, 15);

    const enemyTypes = [EnemyClass.GOBLIN, EnemyClass.ORC, EnemyClass.TROLL];

    for (let i = 0; i < enemyCount; i++) {
      // Find a random floor tile
      const position = randomElement(floorTiles);

      // Make sure position is not occupied
      if (this.isPositionOccupied(position)) {
        continue;
      }

      // Choose enemy type (higher floors have stronger enemies)
      let enemyClass: EnemyClass;
      if (this.currentFloor <= 2) {
        enemyClass = EnemyClass.GOBLIN;
      } else if (this.currentFloor <= 4) {
        enemyClass = randomInt(0, 1) === 0 ? EnemyClass.GOBLIN : EnemyClass.ORC;
      } else {
        enemyClass = randomElement(enemyTypes);
      }

      const enemy = new Enemy(position, enemyClass);
      this.enemies.push(enemy);
      this.renderer.addEntity(enemy);
    }
  }

  /**
   * Spawn items in the dungeon
   */
  private spawnItems(): void {
    const floorTiles = this.dungeon.getFloorTiles();
    const itemCount = randomInt(3, 7);

    for (let i = 0; i < itemCount; i++) {
      const position = randomElement(floorTiles);

      if (this.isPositionOccupied(position)) {
        continue;
      }

      // For now, only spawn health potions
      const item = new Item(position, ItemType.HEALTH_POTION);
      this.items.push(item);
      this.renderer.addEntity({ ...item, type: 0, stats: { maxHp: 0, hp: 0, attack: 0, defense: 0, level: 0 }, isAlive: true, name: 'Item' } as any);
      const mesh = item.createMesh();
      this.renderer['scene'].add(mesh);
    }
  }

  /**
   * Check if a position is occupied by player, enemy, or item
   */
  private isPositionOccupied(position: Position): boolean {
    if (positionsEqual(position, this.player.position)) {
      return true;
    }

    if (this.enemies.some((e) => positionsEqual(e.position, position) && e.isAlive)) {
      return true;
    }

    if (this.items.some((i) => positionsEqual(i.position, position) && !i.isCollected)) {
      return true;
    }

    return false;
  }

  /**
   * Handle player input
   */
  private handlePlayerInput(direction: Direction): void {
    if (this.gameState !== GameState.PLAYER_TURN) {
      return;
    }

    const nextPosition = this.player.getNextPosition(direction);

    // Check if target is an enemy
    const targetEnemy = this.enemies.find(
      (e) => positionsEqual(e.position, nextPosition) && e.isAlive
    );

    if (targetEnemy) {
      // Attack enemy
      this.playerAttack(targetEnemy);
      this.enemyTurn();
      return;
    }

    // Check if walkable
    if (!this.dungeon.isWalkable(nextPosition)) {
      return;
    }

    // Move player
    this.player.moveTo(nextPosition);
    this.renderer.updateCamera(this.player.position.x, this.player.position.z);

    // Check for item pickup
    this.checkItemPickup();

    // Check for stairs
    if (
      this.dungeon.stairsPosition &&
      positionsEqual(this.player.position, this.dungeon.stairsPosition)
    ) {
      this.descend();
      return;
    }

    // Enemy turn
    this.enemyTurn();
  }

  /**
   * Player attacks an enemy
   */
  private playerAttack(enemy: Enemy): void {
    const result = CombatSystem.executeAttack(this.player, enemy);
    this.uiManager.addLogMessage(
      `You attack ${enemy.name} for ${result.damage} damage!`,
      'damage'
    );

    if (result.defenderDied) {
      this.uiManager.addLogMessage(`${enemy.name} is defeated!`, 'info');
      this.renderer.removeEntity(enemy);

      // Gain experience
      const leveledUp = this.player.gainExperience(enemy.experienceReward);
      if (leveledUp) {
        this.uiManager.addLogMessage(
          `Level Up! You are now level ${this.player.stats.level}!`,
          'loot'
        );
      }
    }

    this.updateUI();
  }

  /**
   * Enemy turn - all enemies move and attack
   */
  private enemyTurn(): void {
    this.gameState = GameState.ENEMY_TURN;

    for (const enemy of this.enemies) {
      if (!enemy.isAlive) continue;

      // Check if adjacent to player - attack
      if (enemy.isAdjacentTo(this.player.position)) {
        const result = CombatSystem.executeAttack(enemy, this.player);
        this.uiManager.addLogMessage(
          `${enemy.name} attacks you for ${result.damage} damage!`,
          'damage'
        );

        if (result.defenderDied) {
          this.gameOver();
          return;
        }
      } else {
        // Move towards player
        const nextPos = enemy.getAIMove(this.player.position, (pos) => {
          return (
            this.dungeon.isWalkable(pos) &&
            !this.enemies.some((e) => e !== enemy && positionsEqual(e.position, pos) && e.isAlive)
          );
        });

        if (nextPos) {
          enemy.moveTo(nextPos);
        }
      }
    }

    this.updateUI();
    this.gameState = GameState.PLAYER_TURN;
  }

  /**
   * Check if player picked up an item
   */
  private checkItemPickup(): void {
    const item = this.items.find(
      (i) => positionsEqual(i.position, this.player.position) && !i.isCollected
    );

    if (item) {
      item.isCollected = true;

      if (item.itemType === ItemType.HEALTH_POTION) {
        this.player.addItem('health_potion');
        this.player.heal(30);
        this.uiManager.addLogMessage('Picked up Health Potion and healed 30 HP!', 'heal');
      }

      // Remove from scene
      if (item.mesh) {
        this.renderer['scene'].remove(item.mesh);
        item.destroy();
      }

      this.updateUI();
    }
  }

  /**
   * Descend to next floor
   */
  private descend(): void {
    this.currentFloor += 1;

    // Clear current level
    for (const enemy of this.enemies) {
      this.renderer.removeEntity(enemy);
    }
    this.enemies = [];

    for (const item of this.items) {
      if (item.mesh) {
        this.renderer['scene'].remove(item.mesh);
        item.destroy();
      }
    }
    this.items = [];

    // Generate new dungeon
    this.dungeon = new Dungeon(40, 40);
    this.player.position = this.dungeon.playerStartPosition;

    // Re-initialize level
    this.initializeLevel();
  }

  /**
   * Update UI with current game state
   */
  private updateUI(): void {
    this.uiManager.updatePlayerStats(this.player.stats, this.currentFloor);
  }

  /**
   * Game over
   */
  private gameOver(): void {
    this.gameState = GameState.GAME_OVER;
    this.inputManager.setInputEnabled(false);
    this.uiManager.showGameOver();
  }

  /**
   * Main game loop
   */
  private startGameLoop(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render();
    };

    animate();
  }
}
