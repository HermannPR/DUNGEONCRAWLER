# 🗡️ Dungeon Crawler

A learning-focused, browser-based dungeon crawler game built with TypeScript and Three.js. Features 2D sprites in a 3D space, turn-based combat, procedural dungeon generation, and works on both PC and mobile devices.

![Game Screenshot](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🎮 How to Play

### Controls
- **Keyboard**: Arrow keys or WASD to move
- **Mobile**: Touch the directional buttons on screen
- **Combat**: Walk into enemies to attack them
- **Items**: Walk over items to collect them
- **Stairs**: Step on the golden stairs to descend to the next floor

### Objective
- Explore procedurally generated dungeons
- Defeat enemies to gain experience and level up
- Collect health potions to survive
- Descend deeper into the dungeon!

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The game will open automatically in your browser at `http://localhost:3000`

## 🏗️ Architecture

This project follows a clean, modular architecture designed for learning and extensibility.

### Project Structure

```
dungeon-crawler/
├── src/
│   ├── core/                # Core game systems
│   │   ├── Game.ts          # Main game controller
│   │   └── InputManager.ts  # Keyboard & touch input
│   ├── entities/            # Game entities
│   │   ├── Entity.ts        # Base entity class
│   │   ├── Player.ts        # Player character
│   │   ├── Enemy.ts         # Enemy entities
│   │   └── Item.ts          # Collectible items
│   ├── world/               # World generation
│   │   ├── Dungeon.ts       # Procedural dungeon generator
│   │   └── Tile.ts          # Individual tile logic
│   ├── combat/              # Combat system
│   │   └── CombatSystem.ts  # Turn-based combat calculations
│   ├── rendering/           # Three.js rendering
│   │   └── Renderer.ts      # Scene, camera, and rendering
│   ├── ui/                  # UI management
│   │   └── UIManager.ts     # HUD and combat log updates
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Shared types and enums
│   ├── utils/               # Utility functions
│   │   └── helpers.ts       # Helper functions
│   └── main.ts              # Application entry point
├── index.html               # HTML template with UI
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

### Core Systems

#### 1. **Game Loop** (`src/core/Game.ts`)
The main controller that orchestrates all game systems:
- Turn-based state management
- Player and enemy turn coordination
- Level progression
- Win/loss conditions

**Key Concepts:**
- Game states: `PLAYER_TURN`, `ENEMY_TURN`, `GAME_OVER`
- Synchronous turn processing
- Event-driven architecture

#### 2. **Rendering System** (`src/rendering/Renderer.ts`)
Manages Three.js scene and rendering:
- 3D camera with bird's-eye view
- 2D sprites rendered as textured planes in 3D space
- Dynamic lighting
- Camera follows player

**Key Concepts:**
- `THREE.Scene` - Container for all 3D objects
- `THREE.PerspectiveCamera` - Angled top-down view
- `THREE.Mesh` - Individual renderable objects
- Responsive canvas resizing

#### 3. **Dungeon Generation** (`src/world/Dungeon.ts`)
Procedural dungeon creation using rooms-and-corridors algorithm:

**Algorithm:**
1. Initialize grid with walls
2. Create 6-10 random rooms (non-overlapping)
3. Connect adjacent rooms with L-shaped corridors
4. Place player start in first room
5. Place stairs in last room

**Key Concepts:**
- 2D tile grid (`Tile[][]`)
- Room intersection detection
- Corridor carving
- Walkability checks

#### 4. **Entity System** (`src/entities/`)
Object-oriented entity hierarchy:

```
Entity (abstract base)
├── Player
├── Enemy
└── (extensible for more types)
```

**Entity Properties:**
- Position (grid-based)
- Stats (HP, attack, defense, level)
- 3D mesh representation
- Type-specific behavior

#### 5. **Combat System** (`src/combat/CombatSystem.ts`)
Turn-based combat calculations:

**Combat Formula:**
```
baseDamage = attacker.attack
damageReduction = defender.defense
finalDamage = max(1, baseDamage - damageReduction)

Critical Hit (20% chance):
finalDamage = baseDamage * 2 - damageReduction
```

**Key Concepts:**
- Static combat resolver
- Deterministic damage calculation
- Critical hit system
- Combat result objects for logging

#### 6. **Input System** (`src/core/InputManager.ts`)
Cross-platform input handling:
- Keyboard events (arrow keys, WASD)
- Touch controls for mobile
- Input buffering and debouncing
- Callback-based architecture

#### 7. **UI System** (`src/ui/UIManager.ts`)
DOM-based UI overlay:
- Player stats HUD
- Health bar with smooth animations
- Combat log with color-coded messages
- Responsive design

## 🎨 Visual Design

### Color Scheme

| Element | Color | Hex Code |
|---------|-------|----------|
| Floor | Dark Gray | `#444444` |
| Wall | Light Gray | `#888888` |
| Stairs | Gold | `#ffd700` |
| Player | Blue | `#0066ff` |
| Goblin | Green | `#00ff00` |
| Orc | Orange | `#ff6600` |
| Troll | Red | `#ff0000` |
| Health Potion | Magenta | `#ff00ff` |

### Rendering Technique

The game uses **2D sprites in a 3D space**:
- Tiles are 3D boxes (`THREE.BoxGeometry`)
- Entities are flat planes (`THREE.PlaneGeometry`)
- Camera positioned at an angle for isometric-like view
- All meshes use `MeshBasicMaterial` or `MeshStandardMaterial`

## 🔧 How to Extend

This game is designed to be easily extended. Here are some ideas:

### Add New Enemy Types

**File:** `src/entities/Enemy.ts`

```typescript
// 1. Add to EnemyClass enum
export enum EnemyClass {
  GOBLIN = 'GOBLIN',
  ORC = 'ORC',
  TROLL = 'TROLL',
  DRAGON = 'DRAGON', // New enemy
}

// 2. Add stats in getStatsForClass
case EnemyClass.DRAGON:
  return {
    maxHp: 200,
    hp: 200,
    attack: 25,
    defense: 15,
    level: 10,
  };

// 3. Add name in getNameForClass
case EnemyClass.DRAGON:
  return 'Dragon';

// 4. Add color in getColor
case EnemyClass.DRAGON:
  return 0x8b00ff; // Purple
```

### Add New Item Types

**File:** `src/types/index.ts` and `src/entities/Item.ts`

```typescript
// 1. Add to ItemType enum
export enum ItemType {
  HEALTH_POTION = 'HEALTH_POTION',
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  SPEED_BOOST = 'SPEED_BOOST', // New item
}

// 2. Handle pickup in Game.ts checkItemPickup()
if (item.itemType === ItemType.SPEED_BOOST) {
  // Add speed boost logic
}
```

### Add Special Abilities

**File:** `src/entities/Player.ts`

```typescript
export class Player extends Entity {
  // Add new properties
  mana: number = 100;
  abilities: string[] = ['fireball'];

  // Add new method
  castFireball(target: Enemy): void {
    if (this.mana >= 20) {
      this.mana -= 20;
      // Deal 2x damage
      target.takeDamage(this.stats.attack * 2);
    }
  }
}
```

### Add Sound Effects

```bash
# Install Howler.js for audio
npm install howler
```

```typescript
// In Game.ts
import { Howl } from 'howler';

const attackSound = new Howl({ src: ['assets/attack.mp3'] });

// Play on attack
attackSound.play();
```

### Improve Graphics

**Replace simple shapes with sprite textures:**

```typescript
// In Entity.ts createMesh()
const texture = new THREE.TextureLoader().load('assets/player.png');
const material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
});
```

### Add Save/Load System

```typescript
// In Game.ts
saveGame(): void {
  const saveData = {
    playerStats: this.player.stats,
    playerPosition: this.player.position,
    currentFloor: this.currentFloor,
  };
  localStorage.setItem('dungeon-save', JSON.stringify(saveData));
}

loadGame(): void {
  const saveData = localStorage.getItem('dungeon-save');
  if (saveData) {
    const data = JSON.parse(saveData);
    // Restore game state
  }
}
```

## 📚 Learning Resources

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Three.js
- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Fundamentals](https://threejs.org/manual/)
- [Discover Three.js](https://discoverthreejs.com/)

### Game Development
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [Red Blob Games](https://www.redblobgames.com/) - Excellent pathfinding and generation tutorials

### Roguelike Development
- [RogueBasin](http://www.roguebasin.com/) - Roguelike development wiki
- [Procedural Dungeon Generation](https://www.gamedeveloper.com/programming/procedural-dungeon-generation-algorithm)

## 🎯 Suggested Enhancements

Here are ordered suggestions for enhancing the game (from easiest to hardest):

### Beginner Level
1. ✅ Add more enemy types with different colors
2. ✅ Add sound effects for combat and movement
3. ✅ Add different item types (mana potions, weapons)
4. ✅ Increase dungeon size or room count
5. ✅ Add more visual feedback (screen shake, damage numbers)

### Intermediate Level
6. ⚔️ Add different weapon types with varying stats
7. 🛡️ Add armor system with damage reduction
8. 🎨 Replace colored shapes with actual pixel art sprites
9. 🗺️ Add minimap in corner of screen
10. 💾 Implement save/load functionality
11. 🏆 Add achievement system
12. 📊 Add player statistics tracking

### Advanced Level
13. 🤖 Improve enemy AI (A* pathfinding, tactical behavior)
14. 🔮 Add magic system with spells and mana
15. 🎲 Add random equipment with procedural stats
16. 🏪 Add shop system between floors
17. 👥 Add different player classes (warrior, mage, rogue)
18. 🌟 Add particle effects for combat and spells
19. 🎵 Add background music that changes per floor
20. 🌐 Add multiplayer co-op mode

## 🐛 Troubleshooting

### Game doesn't start
- Check browser console for errors (F12)
- Ensure you ran `npm install`
- Try clearing browser cache
- Verify Node.js version is 18+

### Performance issues
- Reduce dungeon size in `src/world/Dungeon.ts`
- Reduce enemy count in `Game.ts` spawnEnemies()
- Lower renderer quality: `renderer.setPixelRatio(1)`

### Mobile controls not working
- Ensure you're testing on actual mobile device or using browser's device emulation
- Check that touch events aren't being blocked by another element

## 📄 License

MIT License - feel free to use this project for learning and building your own games!

## 🙏 Credits

Built as a learning project demonstrating:
- TypeScript best practices
- Three.js 3D rendering
- Game development patterns
- Procedural generation algorithms
- Turn-based combat systems

---

**Happy Dungeon Crawling! 🗡️🛡️**

*Built with ❤️ for learning game development*
