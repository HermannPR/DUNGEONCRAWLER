/**
 * CombatSystem - Handles turn-based combat calculations
 *
 * Combat formula:
 * - Base damage = attacker's attack stat
 * - Damage reduction = defender's defense stat
 * - Final damage = max(1, base damage - damage reduction)
 * - Critical hits: 20% chance for 2x damage
 */

import { Entity } from '../entities/Entity';
import { CombatResult } from '../types';
import { randomInt } from '../utils/helpers';

export class CombatSystem {
  /**
   * Execute an attack from attacker to defender
   * @returns Combat result with damage dealt and defender status
   */
  static executeAttack(attacker: Entity, defender: Entity): CombatResult {
    // Calculate base damage
    let baseDamage = attacker.stats.attack;

    // Critical hit check (20% chance)
    const isCritical = randomInt(1, 100) <= 20;
    if (isCritical) {
      baseDamage *= 2;
    }

    // Apply defense reduction
    const damageReduction = defender.stats.defense;
    const finalDamage = Math.max(1, baseDamage - damageReduction);

    // Apply damage to defender
    const defenderDied = defender.takeDamage(finalDamage);

    return {
      attacker: attacker.name,
      defender: defender.name,
      damage: finalDamage,
      defenderDied,
    };
  }

  /**
   * Calculate if an attack would hit (always hits in basic version)
   * Future enhancement: add accuracy/evasion stats
   */
  static willHit(attacker: Entity, defender: Entity): boolean {
    // For now, all attacks hit
    // You can enhance this later with accuracy and evasion stats
    return true;
  }

  /**
   * Get combat description for logging
   */
  static getCombatDescription(result: CombatResult, isCritical: boolean = false): string {
    let desc = `${result.attacker} attacks ${result.defender} for ${result.damage} damage`;

    if (isCritical) {
      desc += ' (Critical Hit!)';
    }

    if (result.defenderDied) {
      desc += ` - ${result.defender} is defeated!`;
    }

    return desc;
  }
}
