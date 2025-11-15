# 🚀 Quick Start Guide

Get your dungeon crawler running in 3 minutes!

## Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

The game will open automatically at `http://localhost:3000`

## Controls

### Desktop
- **Arrow Keys** or **WASD**: Move player
- Walk into enemies to attack
- Walk over items to collect

### Mobile
- Use the **on-screen directional buttons** in the bottom-right corner

## Game Mechanics

### Combat
- Turn-based: You move/attack, then all enemies move/attack
- Damage = Your Attack - Enemy Defense (minimum 1)
- 20% chance for critical hit (2x damage)

### Leveling
- Defeat enemies to gain experience
- Level up to increase HP, Attack, and Defense
- Full heal on level up

### Items
- **Health Potions (Magenta spheres)**: Heal 30 HP when collected

### Progression
- Find the **golden stairs** to descend to the next floor
- Each floor has more enemies and stronger foes

## Building for Production

```bash
# Build optimized production version
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` folder. You can deploy these to any static hosting service:
- GitHub Pages
- Vercel
- Netlify
- Firebase Hosting

## Deployment to GitHub Pages

```bash
# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Install gh-pages
npm install -D gh-pages

# Deploy
npm run deploy
```

## Troubleshooting

**Game won't start?**
- Clear browser cache (Ctrl+F5)
- Check console for errors (F12)
- Make sure you ran `npm install`

**Performance issues?**
- Close other browser tabs
- Reduce dungeon size (edit `src/world/Dungeon.ts` line 24: change `40, 40` to `30, 30`)

**Mobile controls not appearing?**
- They only show on screens < 768px wide
- Use browser DevTools device mode to test

## Next Steps

1. ✅ Play the game and understand the mechanics
2. 📖 Read `README.md` for full documentation
3. 🏗️ Read `ARCHITECTURE.md` to understand the code structure
4. 🎨 Try adding new enemy types (see README "How to Extend")
5. 🔧 Customize gameplay parameters (HP, attack, dungeon size)
6. 🎮 Build your own enhanced version!

## File Structure Overview

```
src/
├── core/          → Game loop and input handling
├── entities/      → Player, enemies, items
├── world/         → Dungeon generation
├── combat/        → Combat calculations
├── rendering/     → Three.js graphics
├── ui/            → HUD and combat log
└── main.ts        → Entry point
```

## Development Tips

### Hot Reload
Vite supports hot module replacement. Just save your files and see changes instantly!

### Type Checking
```bash
npm run type-check
```

### Adding New Features

**Want more enemy types?**
→ Edit `src/entities/Enemy.ts`

**Want different dungeon layouts?**
→ Edit `src/world/Dungeon.ts`

**Want new items?**
→ Add to `src/types/index.ts` and `src/entities/Item.ts`

**Want sound effects?**
→ Install Howler.js: `npm install howler`

---

**Happy coding! 🎮**

For detailed documentation, see `README.md`.
For architecture details, see `ARCHITECTURE.md`.
