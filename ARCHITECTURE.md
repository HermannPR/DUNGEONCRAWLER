# 🏛️ Architecture Documentation

This document provides an in-depth explanation of the dungeon crawler's architecture, design patterns, and technical decisions.

## Table of Contents
- [Overview](#overview)
- [Design Patterns](#design-patterns)
- [System Details](#system-details)
- [Data Flow](#data-flow)
- [Performance Considerations](#performance-considerations)

## Overview

The dungeon crawler is built using a **component-based architecture** with clear separation of concerns. Each system is modular and communicates through well-defined interfaces.

### Core Principles

1. **Separation of Concerns**: Each module has a single responsibility
2. **Modularity**: Systems can be modified independently
3. **Type Safety**: TypeScript provides compile-time type checking
4. **Extensibility**: Easy to add new features without breaking existing code
5. **Performance**: Optimized for 60 FPS on modern browsers

## Design Patterns

### 1. Game Loop Pattern

The game uses the **RequestAnimationFrame** pattern for smooth rendering:

```typescript
private startGameLoop(): void {
  const animate = () => {
    requestAnimationFrame(animate);
    this.renderer.render();
  };
  animate();
}
```

**Why**: Synchronizes rendering with browser refresh rate for optimal performance.

### 2. Observer Pattern (Callbacks)

Input system uses callbacks to decouple input handling from game logic:

```typescript
// InputManager
setInputCallback(callback: InputCallback): void {
  this.inputCallback = callback;
}

// Game
this.inputManager.setInputCallback((direction) =>
  this.handlePlayerInput(direction)
);
```

**Why**: Game logic doesn't need to know about input sources (keyboard vs touch).

### 3. Factory Pattern

Dungeon generation acts as a factory for tiles:

```typescript
private createRoom(): void {
  // Factory creates tiles based on type
  this.tiles[z][x] = new Tile(TileType.FLOOR, { x, z });
}
```

**Why**: Encapsulates tile creation logic and ensures consistency.

### 4. Inheritance Hierarchy

Entity system uses classical OOP inheritance:

```
Entity (abstract)
  ├── Player
  └── Enemy
```

**Why**: Shared behavior (position, stats, damage) in base class, specialized behavior in subclasses.

### 5. State Pattern

Game uses explicit state management:

```typescript
enum GameState {
  PLAYER_TURN,
  ENEMY_TURN,
  GAME_OVER,
}
```

**Why**: Clear turn-based logic, prevents invalid state transitions.

### 6. Static Utility Pattern

Combat and helper functions are stateless:

```typescript
class CombatSystem {
  static executeAttack(attacker: Entity, defender: Entity): CombatResult {
    // Pure function - no side effects
  }
}
```

**Why**: No need for instance state, easier testing, clear function signatures.

## System Details

### Rendering System

**Tech**: Three.js with WebGL renderer

**Architecture**:
```
Renderer
├── Scene (container)
├── Camera (perspective, angled top-down)
├── Lights (ambient + directional)
└── Meshes (tiles, entities)
```

**Mesh Creation**:
- **Tiles**: `BoxGeometry` for walls, thin boxes for floors
- **Entities**: `PlaneGeometry` rotated to lie flat
- **Materials**: `MeshStandardMaterial` for lighting, `MeshBasicMaterial` for simple colors

**Camera Strategy**:
```typescript
// Follows player with offset
camera.position.set(playerX + 15, 20, playerZ + 15);
camera.lookAt(playerX, 0, playerZ);
```

This creates an isometric-like view showing both the dungeon and character.

### Dungeon Generation

**Algorithm**: Rooms and Corridors

**Steps**:
1. **Initialize**: Fill grid with walls
2. **Room Placement**:
   - Generate 6-10 random rooms
   - Check for overlaps (with 1-tile padding)
   - Only place if no overlap
3. **Corridor Creation**:
   - Connect room N to room N+1
   - Use L-shaped corridors (horizontal then vertical, or vice versa)
4. **Special Tiles**:
   - Player start: Center of first room
   - Stairs: Center of last room

**Why L-shaped corridors**: Simpler than A* pathfinding, still creates interesting layouts.

**Potential Improvements**:
- Use Delaunay triangulation for better connectivity
- Add minimum spanning tree for optimal room connections
- Implement cellular automata for organic caves

### Combat System

**Formula**:
```
damage = max(1, attackerAttack - defenderDefense)
criticalDamage = damage * 2  // 20% chance
```

**Turn Resolution**:
1. Player action (move or attack)
2. Enemy turn (all enemies move/attack)
3. UI update
4. Back to player turn

**Key Design Decision**: All enemies move simultaneously in one "enemy turn" rather than individual turns. This is simpler and faster-paced.

### Entity System

**Base Entity Properties**:
```typescript
{
  position: Position;      // Grid coordinates
  type: EntityType;        // PLAYER, ENEMY, ITEM
  stats: Stats;            // HP, attack, defense, level
  mesh: THREE.Mesh;        // Visual representation
  isAlive: boolean;        // State flag
  name: string;            // Display name
}
```

**Lifecycle**:
1. **Creation**: `new Entity(position, type, stats)`
2. **Rendering**: `createMesh()` → add to scene
3. **Updates**: `moveTo()`, `takeDamage()`, etc.
4. **Destruction**: `destroy()` → cleanup mesh resources

### Input System

**Multi-platform Strategy**:

```
Input Sources
├── Keyboard (desktop)
│   ├── Arrow keys
│   └── WASD
└── Touch (mobile)
    └── On-screen buttons
```

**Event Flow**:
```
User Input → InputManager → Callback → Game.handlePlayerInput()
```

**Debouncing**: Input is disabled during enemy turn to prevent buffering issues.

## Data Flow

### Player Movement

```
1. User presses key
2. InputManager captures event
3. Callback invoked with Direction
4. Game.handlePlayerInput()
   ├── Calculate next position
   ├── Check for enemy (→ combat)
   ├── Check if walkable
   ├── Move player
   ├── Update camera
   ├── Check for items
   ├── Check for stairs
   └── Trigger enemy turn
5. Renderer updates on next frame
```

### Combat Flow

```
1. Player/Enemy attacks
2. CombatSystem.executeAttack()
   ├── Calculate damage
   ├── Apply to defender
   └── Return result
3. UIManager logs message
4. Check if defender died
   ├── If enemy: gain XP, remove from scene
   └── If player: game over
5. UI updated with new stats
```

### Level Generation

```
1. User descends stairs
2. Game.descend()
   ├── Increment floor
   ├── Clear old entities
   ├── Generate new Dungeon
   ├── Reset player position
   ├── Spawn enemies (scaled to floor)
   ├── Spawn items
   └── Re-render
3. Game continues
```

## Performance Considerations

### Optimization Strategies

1. **Mesh Reuse**:
   - Tiles created once per level
   - Only entities are created/destroyed frequently

2. **Efficient Collision Detection**:
   - Grid-based position checking (O(1))
   - No physics engine needed for turn-based game

3. **Minimal DOM Updates**:
   - UI only updates when stats change
   - Combat log capped at 10 entries

4. **Geometry Disposal**:
   ```typescript
   destroy(): void {
     this.mesh.geometry.dispose();
     this.mesh.material.dispose();
   }
   ```
   Prevents memory leaks from Three.js

5. **Event Delegation**:
   - Single keyboard listener for all keys
   - No per-key event listeners

### Memory Management

**Potential Issues**:
- Three.js geometries and materials must be manually disposed
- Event listeners should be removed on cleanup
- Textures (if added) need disposal

**Current Safeguards**:
- `destroy()` methods on all mesh-containing objects
- Clear arrays when generating new levels
- No global state pollution

### Rendering Performance

**Current**: ~60 FPS on modern devices

**Bottlenecks** (if any):
- Large dungeons (40x40 = 1600 meshes)
- Many enemies on screen

**Solutions**:
- Reduce dungeon size
- Use instanced rendering for tiles
- Implement frustum culling
- Use level of detail (LOD)

## Technology Choices

### Why Three.js?

**Pros**:
- Mature, well-documented library
- Hardware-accelerated rendering (WebGL)
- Large community and examples
- Easy to create 2D games in 3D space

**Cons**:
- Learning curve for 3D concepts
- Manual memory management required
- Heavier than pure 2D canvas

**Alternatives Considered**:
- **Phaser**: Better for pure 2D, but harder to do "2D in 3D"
- **Babylon.js**: More features but heavier
- **Canvas API**: Lighter but no hardware acceleration

### Why TypeScript?

**Benefits**:
- Catch errors at compile time
- Better IDE support (autocomplete, refactoring)
- Self-documenting code (type signatures)
- Easier to maintain as project grows

**Tradeoffs**:
- Additional build step
- Slightly more verbose

### Why Vite?

**Benefits**:
- Fast development server (HMR)
- Simple configuration
- Optimized production builds
- Native ES modules support

**Alternatives**:
- **Webpack**: More powerful but complex
- **Parcel**: Simpler but less control
- **Rollup**: Great for libraries, overkill here

## Future Architecture Improvements

### Entity Component System (ECS)

Could refactor to ECS pattern for better flexibility:

```typescript
// Instead of inheritance
class Entity {
  components: Map<string, Component>;
}

// Components
class PositionComponent { x, z }
class StatsComponent { hp, attack, defense }
class RenderComponent { mesh }
```

**Benefits**: More flexible composition, better performance at scale

### Event System

Add pub/sub for better decoupling:

```typescript
eventBus.on('enemyDefeated', (enemy) => {
  // Multiple systems can react
});
```

### Serialization

Implement proper save/load:

```typescript
interface GameSave {
  version: number;
  timestamp: number;
  player: PlayerData;
  dungeon: DungeonData;
  enemies: EnemyData[];
}
```

---

This architecture is designed to be **simple to understand** for learning purposes while still following **professional patterns** that scale to larger games.
