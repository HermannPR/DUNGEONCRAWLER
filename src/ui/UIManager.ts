/**
 * UIManager - Handles all UI updates and interactions
 *
 * This class manages the HTML UI overlay including:
 * - Player stats display (HP, attack, defense, level)
 * - Combat log messages
 * - Health bar animations
 */

import { Stats } from '../types';

export class UIManager {
  private combatLog: HTMLElement;
  private maxLogEntries = 10;

  constructor() {
    this.combatLog = document.getElementById('combat-log')!;
  }

  /**
   * Update player stats display in the HUD
   */
  updatePlayerStats(stats: Stats, floor: number): void {
    document.getElementById('player-level')!.textContent = stats.level.toString();
    document.getElementById('player-hp')!.textContent = `${stats.hp}/${stats.maxHp}`;
    document.getElementById('player-attack')!.textContent = stats.attack.toString();
    document.getElementById('player-defense')!.textContent = stats.defense.toString();
    document.getElementById('dungeon-floor')!.textContent = floor.toString();

    // Update health bar
    const healthPercent = (stats.hp / stats.maxHp) * 100;
    const healthBar = document.getElementById('player-hp-bar') as HTMLElement;
    healthBar.style.width = `${healthPercent}%`;
  }

  /**
   * Add a message to the combat log
   * @param message - The message to display
   * @param type - Message type for styling (damage, heal, info, loot)
   */
  addLogMessage(message: string, type: 'damage' | 'heal' | 'info' | 'loot' = 'info'): void {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;

    this.combatLog.appendChild(entry);

    // Keep only the last N entries
    const entries = this.combatLog.querySelectorAll('.log-entry');
    if (entries.length > this.maxLogEntries) {
      entries[0].remove();
    }

    // Auto-scroll to bottom
    this.combatLog.scrollTop = this.combatLog.scrollHeight;
  }

  /**
   * Clear the combat log
   */
  clearLog(): void {
    this.combatLog.innerHTML = '';
  }

  /**
   * Show game over screen
   */
  showGameOver(): void {
    this.addLogMessage('💀 You have died! Refresh to try again.', 'damage');
  }

  /**
   * Show victory message
   */
  showVictory(): void {
    this.addLogMessage('🎉 You found the exit! You win!', 'loot');
  }
}
