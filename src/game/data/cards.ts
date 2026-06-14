import { type CardDef, type TransformMap, type ClassPath, type CardUpgradeBonus } from '../types';
import { getClassLineage } from './evolutions';

// ─── Upgrade bonus presets ────────────────────────────
const dmg3: CardUpgradeBonus = { bonusDamage: 3 };
const dmg2: CardUpgradeBonus = { bonusDamage: 2 };
const dmg4: CardUpgradeBonus = { bonusDamage: 4 };
const blk3: CardUpgradeBonus = { bonusBlock: 3 };
const blk2: CardUpgradeBonus = { bonusBlock: 2 };
const heal3: CardUpgradeBonus = { bonusHeal: 3 };
const heal2: CardUpgradeBonus = { bonusHeal: 2 };
const costDown1: CardUpgradeBonus = { costReduction: 1 };
const draw1: CardUpgradeBonus = { bonusDraw: 1 };
const burn2: CardUpgradeBonus = { bonusBurn: 2 };
const poison2: CardUpgradeBonus = { bonusPoison: 2 };
const freeze1: CardUpgradeBonus = { bonusFreeze: 1 };
const weaken1: CardUpgradeBonus = { bonusWeaken: 1 };
const str2: CardUpgradeBonus = { bonusStrengthBuff: 2 };
const eng1: CardUpgradeBonus = { bonusEnergyGain: 1 };
const aoe5: CardUpgradeBonus = { bonusAoeDamage: 5 };
const atkBuff2: CardUpgradeBonus = { bonusAttackBuff: 2 };
const selfDmgReduce2: CardUpgradeBonus = { bonusSelfDamageReduction: 2 };
const dodge1: CardUpgradeBonus = { bonusDodge: 1 };

// ─── ALL CARDS ──────────────────────────────────────────

export const ALL_CARDS: CardDef[] = [
  // ═══ BASE: VAGABUNDO (Tier 0) ═══
  {
    id: 'golpe_basico', name: 'Golpe Básico',
    description: 'Ataca con lo que tienes a mano.',
    cost: 1, rarity: 'starter', target: 'enemy', classPath: 'vagabundo', tier: 0,
    damage: 6, upgradeBonus: dmg3,
  },
  {
    id: 'escudo_ramas', name: 'Escudo de Ramas',
    description: 'Un muro frágil de ramas entrelazadas.',
    cost: 1, rarity: 'starter', target: 'self', classPath: 'vagabundo', tier: 0,
    block: 5, upgradeBonus: blk3,
  },

  // ═══ MAGO (Tier 1) ═══
  { id: 'rayo', name: 'Rayo', description: 'Una descarga eléctrica concentrada.', cost: 2, rarity: 'common', target: 'enemy', classPath: 'mago', tier: 1, damage: 8, upgradeBonus: dmg4 },
  { id: 'meditacion', name: 'Meditación', description: 'Calma la mente. Cura 5 HP y roba 2.', cost: 1, rarity: 'common', target: 'self', classPath: 'mago', tier: 1, heal: 5, drawCards: 2, upgradeBonus: heal3 },
  // Mago transforms
  { id: 'bola_fuego', name: 'Bola de Fuego', description: '5 daño + quema 3.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'mago', tier: 1, damage: 5, burn: 3, upgradeBonus: burn2 },
  { id: 'escudo_arcano', name: 'Escudo Arcano', description: '4 bloque + congela 1 turno.', cost: 1, rarity: 'common', target: 'self', classPath: 'mago', tier: 1, block: 4, freeze: 1, upgradeBonus: freeze1 },

  // ═══ PÍCARO (Tier 1) ═══
  { id: 'veneno', name: 'Veneno', description: '3 daño + 3 veneno.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'picaro', tier: 1, damage: 3, poison: 3, upgradeBonus: poison2 },
  { id: 'disparo_rapido', name: 'Disparo Rápido', description: 'Rápido y gratuito. 3 daño.', cost: 0, rarity: 'common', target: 'enemy', classPath: 'picaro', tier: 1, damage: 3, upgradeBonus: dmg2 },
  // Pícaro transforms
  { id: 'punialada', name: 'Puñalada', description: '4 daño + roba 1.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'picaro', tier: 1, damage: 4, drawCards: 1, upgradeBonus: dmg2 },
  { id: 'evadir', name: 'Evadir', description: 'Esquiva el próximo ataque.', cost: 1, rarity: 'common', target: 'self', classPath: 'picaro', tier: 1, dodge: 1, upgradeBonus: dodge1 },

  // ═══ GUERRERO (Tier 1) ═══
  { id: 'grito_guerra', name: 'Grito de Guerra', description: '4 daño +2 Fuerza.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'guerrero', tier: 1, damage: 4, strengthBuff: 2, upgradeBonus: str2 },
  { id: 'garrote', name: 'Garrote', description: '5 daño + roba 1.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'guerrero', tier: 1, damage: 5, drawCards: 1, upgradeBonus: dmg2 },
  // Guerrero transforms
  { id: 'corte_poderoso', name: 'Corte Poderoso', description: '8 daño.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'guerrero', tier: 1, damage: 8, upgradeBonus: dmg3 },
  { id: 'muro_escudos', name: 'Muro de Escudos', description: '8 bloque.', cost: 1, rarity: 'common', target: 'self', classPath: 'guerrero', tier: 1, block: 8, upgradeBonus: blk3 },

  // ═══ CAZADOR (Tier 1) ═══
  { id: 'flecha_precisa', name: 'Flecha Precisa', description: 'Tiro certero. 7 daño.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'cazador', tier: 1, damage: 7, upgradeBonus: dmg3 },
  { id: 'trampa_cazador', name: 'Trampa de Cazador', description: '4 bloque + 2 quemadura al enemigo.', cost: 1, rarity: 'common', target: 'self', classPath: 'cazador', tier: 1, block: 4, burn: 2, upgradeBonus: blk2 },
  // Cazador transforms
  { id: 'disparo_lejano', name: 'Disparo Lejano', description: '6 daño + debilita 1.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'cazador', tier: 1, damage: 6, weaken: 1, upgradeBonus: dmg2 },
  { id: 'red_cazador', name: 'Red del Cazador', description: '3 bloque + veneno 2.', cost: 1, rarity: 'common', target: 'self', classPath: 'cazador', tier: 1, block: 3, poison: 2, upgradeBonus: poison2 },

  // ═══ MONJE (Tier 1) ═══
  { id: 'golpe_chi', name: 'Golpe de Chi', description: '5 daño + esquiva 1.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'monje', tier: 1, damage: 5, dodge: 1, upgradeBonus: dmg2 },
  { id: 'palma_vacia', name: 'Palma Vacía', description: '3 bloque + roba 1.', cost: 1, rarity: 'common', target: 'self', classPath: 'monje', tier: 1, block: 3, drawCards: 1, upgradeBonus: blk2 },
  // Monje transforms
  { id: 'patada_circular', name: 'Patada Circular', description: '4 daño + 2 bloque.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'monje', tier: 1, damage: 4, block: 2, upgradeBonus: dmg2 },
  { id: 'postura_defensa', name: 'Postura Defensiva', description: '5 bloque + cura 2.', cost: 1, rarity: 'common', target: 'self', classPath: 'monje', tier: 1, block: 5, heal: 2, upgradeBonus: blk2 },

  // ═══ DRUIDA (Tier 1) ═══
  { id: 'zarpa_oso', name: 'Zarpa de Oso', description: '6 daño + 3 bloque.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'druida', tier: 1, damage: 6, block: 3, upgradeBonus: dmg3 },
  { id: 'enredadera', name: 'Enredadera', description: '3 daño + debilita 2 + veneno 2.', cost: 2, rarity: 'common', target: 'enemy', classPath: 'druida', tier: 1, damage: 3, weaken: 2, poison: 2, upgradeBonus: poison2 },
  // Druida transforms
  { id: 'mordisco_salvaje', name: 'Mordisco Salvaje', description: '8 daño.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'druida', tier: 1, damage: 8, upgradeBonus: dmg3 },
  { id: 'corteza_arbol', name: 'Corteza de Árbol', description: '7 bloque + cura 2.', cost: 1, rarity: 'common', target: 'self', classPath: 'druida', tier: 1, block: 7, heal: 2, upgradeBonus: blk3 },

  // ═══ SACERDOTE (Tier 1) ═══
  { id: 'castigo_divino', name: 'Castigo Divino', description: '8 daño sagrado.', cost: 2, rarity: 'common', target: 'enemy', classPath: 'sacerdote', tier: 1, damage: 8, upgradeBonus: dmg3 },
  { id: 'oracion', name: 'Oración', description: '4 bloque + cura 4.', cost: 1, rarity: 'common', target: 'self', classPath: 'sacerdote', tier: 1, block: 4, heal: 4, upgradeBonus: heal2 },
  // Sacerdote transforms
  { id: 'golpe_fe', name: 'Golpe de Fe', description: '7 daño + cura 3.', cost: 2, rarity: 'common', target: 'enemy', classPath: 'sacerdote', tier: 1, damage: 7, heal: 3, upgradeBonus: dmg2 },
  { id: 'santuario', name: 'Santuario', description: '6 bloque + cura 5.', cost: 2, rarity: 'common', target: 'self', classPath: 'sacerdote', tier: 1, block: 6, heal: 5, upgradeBonus: blk2 },

  // ═══ CHAMÁN (Tier 1) ═══
  { id: 'totem_fuego', name: 'Tótem de Fuego', description: '4 daño + 3 quemadura.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'chaman', tier: 1, damage: 4, burn: 3, upgradeBonus: burn2 },
  { id: 'espiritu_guardian', name: 'Espíritu Guardián', description: '5 bloque + cura 2.', cost: 1, rarity: 'common', target: 'self', classPath: 'chaman', tier: 1, block: 5, heal: 2, upgradeBonus: blk2 },
  // Chamán transforms
  { id: 'rayo_espiritual', name: 'Rayo Espiritual', description: '6 daño + roba 1.', cost: 1, rarity: 'common', target: 'enemy', classPath: 'chaman', tier: 1, damage: 6, drawCards: 1, upgradeBonus: dmg3 },
  { id: 'proteccion_ancestral', name: 'Protección Ancestral', description: '6 bloque + esquiva 1.', cost: 1, rarity: 'common', target: 'self', classPath: 'chaman', tier: 1, block: 6, dodge: 1, upgradeBonus: blk2 },

  // ═══ CABALLERO (Tier 1) ═══
  { id: 'carga_caballo', name: 'Carga de Caballo', description: '7 daño + 2 bloque.', cost: 2, rarity: 'common', target: 'enemy', classPath: 'caballero', tier: 1, damage: 7, block: 2, upgradeBonus: dmg3 },
  { id: 'escudo_caballero', name: 'Escudo de Caballero', description: '6 bloque + 1 Fuerza.', cost: 1, rarity: 'common', target: 'self', classPath: 'caballero', tier: 1, block: 6, strengthBuff: 1, upgradeBonus: blk3 },
  // Caballero transforms
  { id: 'espadazo', name: 'Espadazo', description: '9 daño.', cost: 2, rarity: 'common', target: 'enemy', classPath: 'caballero', tier: 1, damage: 9, upgradeBonus: dmg3 },
  { id: 'fortaleza', name: 'Fortaleza', description: '9 bloque.', cost: 2, rarity: 'common', target: 'self', classPath: 'caballero', tier: 1, block: 9, upgradeBonus: blk3 },

  // ═══════════════════════════════════════════════════════
  // ═══ TIER 2 CARDS ═════════════════════════════════════
  // ═══════════════════════════════════════════════════════

  // --- Hechicero (from Mago) ---
  { id: 'meteorito', name: 'Meteorito', description: '15 daño a todos.', cost: 3, rarity: 'rare', target: 'all_enemies', classPath: 'hechicero', tier: 2, aoeDamage: 15, upgradeBonus: aoe5 },
  { id: 'foco', name: 'Foco Arcano', description: 'Roba 3 cartas.', cost: 1, rarity: 'rare', target: 'self', classPath: 'hechicero', tier: 2, drawCards: 3, upgradeBonus: draw1 },
  { id: 'llamarada', name: 'Llamarada', description: '8 daño + 5 quemadura.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'hechicero', tier: 2, damage: 8, burn: 5, upgradeBonus: burn2 },
  { id: 'barrera_hielo', name: 'Barrera de Hielo', description: '6 bloque + congela 2.', cost: 2, rarity: 'rare', target: 'self', classPath: 'hechicero', tier: 2, block: 6, freeze: 2, upgradeBonus: freeze1 },

  // --- Brujo (from Mago) ---
  { id: 'pacto_oscuro', name: 'Pacto Oscuro', description: 'Pierde 5 HP, gana 3 energía.', cost: 0, rarity: 'rare', target: 'self', classPath: 'brujo', tier: 2, selfDamage: 5, energyGain: 3, upgradeBonus: eng1 },
  { id: 'robo_vida', name: 'Robo de Vida', description: '8 daño + cura 4.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'brujo', tier: 2, damage: 8, heal: 4, upgradeBonus: dmg2 },
  { id: 'drenar_alma', name: 'Drenar Alma', description: '6 daño + quema 2.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'brujo', tier: 2, damage: 6, burn: 2, upgradeBonus: dmg2 },
  { id: 'maldicion', name: 'Maldición', description: 'Debilita 2 al enemigo.', cost: 1, rarity: 'rare', target: 'enemy', classPath: 'brujo', tier: 2, weaken: 2, upgradeBonus: weaken1 },

  // --- Asesino (from Pícaro) ---
  { id: 'ejecucion', name: 'Ejecución', description: 'Si <30% HP: 15 daño. Si no: 5.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'asesino', tier: 2, damage: 5, executeThreshold: 30, executeDamage: 15, upgradeBonus: dmg2 },
  { id: 'emboscada', name: 'Emboscada', description: '10 daño + roba 2.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'asesino', tier: 2, damage: 10, drawCards: 2, upgradeBonus: dmg3 },
  { id: 'apunialar', name: 'Apuñalar', description: '7 daño + 3 veneno.', cost: 1, rarity: 'rare', target: 'enemy', classPath: 'asesino', tier: 2, damage: 7, poison: 3, upgradeBonus: poison2 },
  { id: 'sombras', name: 'Sombras', description: 'Esquiva 2 ataques.', cost: 1, rarity: 'rare', target: 'self', classPath: 'asesino', tier: 2, dodge: 2, upgradeBonus: dodge1 },

  // --- Bardo (from Pícaro) ---
  { id: 'cancion_guerra', name: 'Canción de Guerra', description: '+3 daño este turno.', cost: 1, rarity: 'rare', target: 'passive', classPath: 'bardo', tier: 2, attackBuffTurn: 3, upgradeBonus: atkBuff2 },
  { id: 'inspiracion_bardo', name: 'Inspiración', description: 'Roba 4.', cost: 1, rarity: 'rare', target: 'self', classPath: 'bardo', tier: 2, drawCards: 4, upgradeBonus: draw1 },
  { id: 'golpe_ritmico', name: 'Golpe Rítmico', description: '5 daño + roba 1.', cost: 1, rarity: 'rare', target: 'enemy', classPath: 'bardo', tier: 2, damage: 5, drawCards: 1, upgradeBonus: dmg2 },
  { id: 'melodia_protectora', name: 'Melodía Protectora', description: '4 bloque + cura 2.', cost: 1, rarity: 'rare', target: 'self', classPath: 'bardo', tier: 2, block: 4, heal: 2, upgradeBonus: heal2 },

  // --- Paladín (from Guerrero) ---
  { id: 'luz_sagrada', name: 'Luz Sagrada', description: '5 daño + cura 5.', cost: 1, rarity: 'rare', target: 'enemy', classPath: 'paladin', tier: 2, damage: 5, heal: 5, upgradeBonus: dmg3 },
  { id: 'castigo', name: 'Castigo', description: '12 daño.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'paladin', tier: 2, damage: 12, upgradeBonus: dmg3 },
  { id: 'golpe_divino', name: 'Golpe Divino', description: '10 daño + cura 3.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'paladin', tier: 2, damage: 10, heal: 3, upgradeBonus: dmg3 },
  { id: 'bendicion', name: 'Bendición', description: '8 bloque + cura 5.', cost: 2, rarity: 'rare', target: 'self', classPath: 'paladin', tier: 2, block: 8, heal: 5, upgradeBonus: heal3 },

  // --- Berserker (from Guerrero) ---
  { id: 'sangre_berserker', name: 'Sangre Berserker', description: 'Pierde 8 HP, 20 daño.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'berserker', tier: 2, damage: 20, selfDamage: 8, upgradeBonus: selfDmgReduce2 },
  { id: 'tromba', name: 'Tromba', description: '7 daño AOE. Se lastima 2.', cost: 2, rarity: 'rare', target: 'all_enemies', classPath: 'berserker', tier: 2, aoeDamage: 7, selfDamage: 2, upgradeBonus: aoe5 },
  { id: 'hachazo_salvaje', name: 'Hachazo Salvaje', description: '10 daño. Se lastima 3.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'berserker', tier: 2, damage: 10, selfDamage: 3, upgradeBonus: dmg3 },
  { id: 'furia', name: 'Furia', description: '+4 Fuerza. Se lastima 5.', cost: 1, rarity: 'rare', target: 'passive', classPath: 'berserker', tier: 2, strengthBuff: 4, selfDamage: 5, upgradeBonus: selfDmgReduce2 },

  // --- Guardabosques (from Cazador) ---
  { id: 'latigo_bosque', name: 'Látigo del Bosque', description: '6 daño + 3 veneno.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'guardabosques', tier: 2, damage: 6, poison: 3, upgradeBonus: poison2 },
  { id: 'ojo_aguilero', name: 'Ojo de Águila', description: '8 daño + debilita 1.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'guardabosques', tier: 2, damage: 8, weaken: 1, upgradeBonus: dmg2 },
  { id: 'flecha_venenosa', name: 'Flecha Venenosa', description: '5 daño + 4 veneno.', cost: 1, rarity: 'rare', target: 'enemy', classPath: 'guardabosques', tier: 2, damage: 5, poison: 4, upgradeBonus: dmg2 },
  { id: 'camuflaje', name: 'Camuflaje', description: '3 bloque + esquiva 2.', cost: 1, rarity: 'rare', target: 'self', classPath: 'guardabosques', tier: 2, block: 3, dodge: 2, upgradeBonus: blk2 },

  // --- Artillero (from Cazador) ---
  { id: 'granada', name: 'Granada', description: '10 daño AOE.', cost: 2, rarity: 'rare', target: 'all_enemies', classPath: 'artillero', tier: 2, aoeDamage: 10, upgradeBonus: aoe5 },
  { id: 'municion_especial', name: 'Munición Especial', description: '12 daño + 2 quemadura.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'artillero', tier: 2, damage: 12, burn: 2, upgradeBonus: dmg3 },
  { id: 'bazuca', name: 'Bazuca', description: '15 daño.', cost: 3, rarity: 'rare', target: 'enemy', classPath: 'artillero', tier: 2, damage: 15, upgradeBonus: dmg3 },
  { id: 'bomba_humo', name: 'Bomba de Humo', description: '5 bloque + esquiva 1.', cost: 1, rarity: 'rare', target: 'self', classPath: 'artillero', tier: 2, block: 5, dodge: 1, upgradeBonus: blk2 },

  // --- Artista Marcial (from Monje) ---
  { id: 'combo_cadena', name: 'Combo Cadena', description: '6 daño + roba 2.', cost: 1, rarity: 'rare', target: 'enemy', classPath: 'artista_marcial', tier: 2, damage: 6, drawCards: 2, upgradeBonus: dmg2 },
  { id: 'defensa_certe', name: 'Defensa Certe', description: '5 bloque + esquiva 1 + cura 2.', cost: 1, rarity: 'rare', target: 'self', classPath: 'artista_marcial', tier: 2, block: 5, dodge: 1, heal: 2, upgradeBonus: blk2 },
  { id: 'patada_giratoria', name: 'Patada Giratoria', description: '7 daño + 2 bloque.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'artista_marcial', tier: 2, damage: 7, block: 2, upgradeBonus: dmg2 },
  { id: 'puño_trueno', name: 'Puño de Trueno', description: '9 daño.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'artista_marcial', tier: 2, damage: 9, upgradeBonus: dmg3 },

  // --- Maestro Zen (from Monje) ---
  { id: 'iluminacion', name: 'Iluminación', description: 'Roba 3 + gana 1 energía.', cost: 1, rarity: 'rare', target: 'self', classPath: 'maestro_zen', tier: 2, drawCards: 3, energyGain: 1, upgradeBonus: draw1 },
  { id: 'proyeccion_chi', name: 'Proyección de Chi', description: '5 daño + 3 bloque.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'maestro_zen', tier: 2, damage: 5, block: 3, upgradeBonus: dmg2 },
  { id: 'golpe_vacio', name: 'Golpe al Vacío', description: '8 daño.', cost: 1, rarity: 'rare', target: 'enemy', classPath: 'maestro_zen', tier: 2, damage: 8, upgradeBonus: dmg2 },
  { id: 'koan', name: 'Koán', description: 'Cura 4 + roba 2.', cost: 1, rarity: 'rare', target: 'self', classPath: 'maestro_zen', tier: 2, heal: 4, drawCards: 2, upgradeBonus: heal2 },

  // --- Cambiaformas (from Druida) ---
  { id: 'forma_oso', name: 'Forma de Oso', description: '6 bloque + 5 daño.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'cambiaformas', tier: 2, damage: 5, block: 6, upgradeBonus: dmg3 },
  { id: 'piel_camaleonica', name: 'Piel Camaleónica', description: '4 bloque + esquiva 1.', cost: 1, rarity: 'rare', target: 'self', classPath: 'cambiaformas', tier: 2, block: 4, dodge: 1, upgradeBonus: blk2 },
  { id: 'mordisco_feroz', name: 'Mordisco Feroz', description: '10 daño.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'cambiaformas', tier: 2, damage: 10, upgradeBonus: dmg3 },
  { id: 'garras_venenosas', name: 'Garras Venenosas', description: '7 daño + 3 veneno.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'cambiaformas', tier: 2, damage: 7, poison: 3, upgradeBonus: poison2 },

  // --- Invocador (from Druida) ---
  { id: 'lobo_espiritual', name: 'Lobo Espiritual', description: '8 daño AOE.', cost: 2, rarity: 'rare', target: 'all_enemies', classPath: 'invocador', tier: 2, aoeDamage: 8, upgradeBonus: aoe5 },
  { id: 'llamada_naturaleza', description: 'Llamada de la Naturaleza', id: 'llamada_naturaleza', cost: 1, rarity: 'rare', target: 'passive', classPath: 'invocador', tier: 2, strengthBuff: 2, drawCards: 1, upgradeBonus: str2 },
  { id: 'cuervo', name: 'Cuervo', description: '4 daño + debilita 2 + roba 1.', cost: 1, rarity: 'rare', target: 'enemy', classPath: 'invocador', tier: 2, damage: 4, weaken: 2, drawCards: 1, upgradeBonus: dmg2 },
  { id: 'oso_guardian', name: 'Oso Guardián', description: '8 bloque + cura 3.', cost: 2, rarity: 'rare', target: 'self', classPath: 'invocador', tier: 2, block: 8, heal: 3, upgradeBonus: blk3 },

  // --- Clérigo (from Sacerdote) ---
  { id: 'resurreccion', name: 'Resurrección', description: 'Cura 8 HP.', cost: 2, rarity: 'rare', target: 'self', classPath: 'clerigo', tier: 2, heal: 8, upgradeBonus: heal3 },
  { id: 'aura_sagrada', name: 'Aura Sagrada', description: '5 bloque + cura 4 + 3 daño.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'clerigo', tier: 2, damage: 3, block: 5, heal: 4, upgradeBonus: dmg2 },
  { id: 'juicio_divino', name: 'Juicio Divino', description: '12 daño + debilita 1.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'clerigo', tier: 2, damage: 12, weaken: 1, upgradeBonus: dmg3 },
  { id: 'rezos_masivos', name: 'Rezos Masivos', description: 'Cura 6 + roba 2.', cost: 1, rarity: 'rare', target: 'self', classPath: 'clerigo', tier: 2, heal: 6, drawCards: 2, upgradeBonus: heal2 },

  // --- Inquisidor (from Sacerdote) ---
  { id: 'fuego_santo', name: 'Fuego Santo', description: '10 daño + 3 quemadura.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'inquisidor', tier: 2, damage: 10, burn: 3, upgradeBonus: dmg3 },
  { id: 'sentencia', name: 'Sentencia', description: '8 daño + debilita 2.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'inquisidor', tier: 2, damage: 8, weaken: 2, upgradeBonus: dmg2 },
  { id: 'auto_fe', name: 'Auto de Fe', description: '6 daño + quema 4.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'inquisidor', tier: 2, damage: 6, burn: 4, upgradeBonus: dmg2 },
  { id: 'absolucion', name: 'Absolución', description: 'Cura 5 + 4 bloque.', cost: 2, rarity: 'rare', target: 'self', classPath: 'inquisidor', tier: 2, heal: 5, block: 4, upgradeBonus: heal2 },

  // --- Elementalista (from Chamán) ---
  { id: 'tormenta_elemental', name: 'Tormenta Elemental', description: '10 daño AOE + quema 2.', cost: 3, rarity: 'rare', target: 'all_enemies', classPath: 'elementalista', tier: 2, aoeDamage: 10, burn: 2, upgradeBonus: aoe5 },
  { id: 'escudo_elemental', name: 'Escudo Elemental', description: '7 bloque + congela 1.', cost: 2, rarity: 'rare', target: 'self', classPath: 'elementalista', tier: 2, block: 7, freeze: 1, upgradeBonus: blk2 },
  { id: 'fuego_hielo', name: 'Fuego y Hielo', description: '8 daño + 2 quemadura + congela 1.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'elementalista', tier: 2, damage: 8, burn: 2, freeze: 1, upgradeBonus: dmg2 },
  { id: 'rayo_tierra', name: 'Rayo y Tierra', description: '6 daño + 4 bloque.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'elementalista', tier: 2, damage: 6, block: 4, upgradeBonus: dmg2 },

  // --- Ancestral (from Chamán) ---
  { id: 'ritual_proteccion', name: 'Ritual de Protección', description: '8 bloque + cura 3.', cost: 2, rarity: 'rare', target: 'self', classPath: 'ancestral', tier: 2, block: 8, heal: 3, upgradeBonus: blk2 },
  { id: 'vision_pasado', name: 'Visión del Pasado', description: 'Roba 4 + 1 energía.', cost: 1, rarity: 'rare', target: 'self', classPath: 'ancestral', tier: 2, drawCards: 4, energyGain: 1, upgradeBonus: draw1 },
  { id: 'escudo_antepasados', name: 'Escudo de Antepasados', description: '6 bloque + esquiva 1.', cost: 2, rarity: 'rare', target: 'self', classPath: 'ancestral', tier: 2, block: 6, dodge: 1, upgradeBonus: blk2 },
  { id: 'llamado_espiritus', name: 'Llamado de Espíritus', description: '5 daño + roba 2 + debilita 1.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'ancestral', tier: 2, damage: 5, drawCards: 2, weaken: 1, upgradeBonus: dmg2 },

  // --- Templario (from Caballero) ---
  { id: 'juramento_sagrado', name: 'Juramento Sagrado', description: '8 daño + cura 4.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'templario', tier: 2, damage: 8, heal: 4, upgradeBonus: dmg3 },
  { id: 'muro_fe', name: 'Muro de Fe', description: '10 bloque + cura 3.', cost: 2, rarity: 'rare', target: 'self', classPath: 'templario', tier: 2, block: 10, heal: 3, upgradeBonus: blk3 },
  { id: 'golpe_templario', name: 'Golpe Templario', description: '11 daño.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'templario', tier: 2, damage: 11, upgradeBonus: dmg3 },
  { id: 'bendicion_fe', name: 'Bendición de Fe', description: '+3 Fuerza + cura 2.', cost: 1, rarity: 'rare', target: 'passive', classPath: 'templario', tier: 2, strengthBuff: 3, heal: 2, upgradeBonus: str2 },

  // --- Condotiero (from Caballero) ---
  { id: 'soborno', name: 'Soborno', description: 'Roba 2 + gana 2 energía.', cost: 1, rarity: 'rare', target: 'self', classPath: 'condotiero', tier: 2, drawCards: 2, energyGain: 2, upgradeBonus: draw1 },
  { id: 'golpe_comprado', name: 'Golpe Comprado', description: '10 daño + roba 1.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'condotiero', tier: 2, damage: 10, drawCards: 1, upgradeBonus: dmg3 },
  { id: 'contrato_asesino', name: 'Contrato de Asesino', description: '13 daño.', cost: 3, rarity: 'rare', target: 'enemy', classPath: 'condotiero', tier: 2, damage: 13, upgradeBonus: dmg3 },
  { id: 'escudo_mercenario', name: 'Escudo Mercenario', description: '7 bloque + 2 Fuerza.', cost: 2, rarity: 'rare', target: 'self', classPath: 'condotiero', tier: 2, block: 7, strengthBuff: 2, upgradeBonus: blk2 },

  // ═══════════════════════════════════════════════════════
  // ═══ TIER 3 LEGENDARY CARDS ══════════════════════════
  // ═══════════════════════════════════════════════════════

  // --- Archimago (Hechicero) ---
  { id: 'apocalipsis', name: 'Apocalipsis', description: '20 daño AOE + 3 quemadura.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'archimago', tier: 3, aoeDamage: 20, burn: 3, upgradeBonus: aoe5 },
  { id: 'trascendencia', name: 'Trascendencia', description: 'Roba 5 + 2 energía.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'archimago', tier: 3, drawCards: 5, energyGain: 2, upgradeBonus: draw1 },
  { id: 'cometa', name: 'Cometa', description: '15 daño + 5 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'archimago', tier: 3, damage: 15, burn: 5, upgradeBonus: dmg4 },
  { id: 'absorber_magia', name: 'Absorber Magia', description: '8 bloque + 6 cura + roba 2.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'archimago', tier: 3, block: 8, heal: 6, drawCards: 2, upgradeBonus: blk2 },

  // --- Pirocapitán (Hechicero) ---
  { id: 'infierno_purificador', name: 'Infierno Purificador', description: '12 daño + cura 5 + 4 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'pirocapitan', tier: 3, damage: 12, heal: 5, burn: 4, upgradeBonus: dmg3 },
  { id: 'llamas_eternas', name: 'Llamas Eternas', description: '10 daño AOE + quema 5.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'pirocapitan', tier: 3, aoeDamage: 10, burn: 5, upgradeBonus: aoe5 },
  { id: 'explosion_solar', name: 'Explosión Solar', description: '18 daño + 3 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'pirocapitan', tier: 3, damage: 18, burn: 3, upgradeBonus: dmg4 },
  { id: 'corona_fuego', name: 'Corona de Fuego', description: '5 bloque + cura 4 + quema 2.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'pirocapitan', tier: 3, block: 5, heal: 4, burn: 2, upgradeBonus: blk2 },

  // --- Nigromante (Brujo) ---
  { id: 'invocar_muertos', name: 'Invocar Muertos', description: '12 daño + 3 veneno.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'nigromante', tier: 3, damage: 12, poison: 3, upgradeBonus: dmg3 },
  { id: 'toque_mortal', name: 'Toque Mortal', description: 'Si <40% HP: 20 daño. Si no: 8.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'nigromante', tier: 3, damage: 8, executeThreshold: 40, executeDamage: 20, upgradeBonus: dmg3 },
  { id: 'alma_condenada', name: 'Alma Condenada', description: '8 daño + cura 5 + 2 quemadura.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'nigromante', tier: 3, damage: 8, heal: 5, burn: 2, upgradeBonus: dmg2 },
  { id: 'ritual_oscuridad', name: 'Ritual de Oscuridad', description: 'Debilita 3 + roba 3 + 1 energía.', cost: 1, rarity: 'legendary', target: 'passive', classPath: 'nigromante', tier: 3, weaken: 3, drawCards: 3, energyGain: 1, upgradeBonus: weaken1 },

  // --- Señor Sombras (Brujo) ---
  { id: 'devorar_sombras', name: 'Devorar Sombras', description: '14 daño + cura 6.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'senor_sombras', tier: 3, damage: 14, heal: 6, upgradeBonus: dmg3 },
  { id: 'vacio_absoluto', name: 'Vacío Absoluto', description: 'Roba 5 + 2 energía + 3 bloque.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'senor_sombras', tier: 3, drawCards: 5, energyGain: 2, block: 3, upgradeBonus: draw1 },
  { id: 'garras_sombra', name: 'Garras de Sombra', description: '10 daño + 3 veneno.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'senor_sombras', tier: 3, damage: 10, poison: 3, upgradeBonus: dmg3 },
  { id: 'manto_oscuro', name: 'Manto Oscuro', description: '6 bloque + esquiva 2 + cura 3.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'senor_sombras', tier: 3, block: 6, dodge: 2, heal: 3, upgradeBonus: blk2 },

  // --- Ninja (Asesino) ---
  { id: 'golpe_ninja', name: 'Golpe Ninja', description: '12 daño + roba 2 + esquiva 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'ninja', tier: 3, damage: 12, drawCards: 2, dodge: 1, upgradeBonus: dmg3 },
  { id: 'cuerpo_vapor', name: 'Cuerpo Vapor', description: 'Esquiva 3 + roba 2.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'ninja', tier: 3, dodge: 3, drawCards: 2, upgradeBonus: dodge1 },
  { id: 'shuriken', name: 'Shuriken Múltiple', description: '8 daño + 2 veneno.', cost: 1, rarity: 'legendary', target: 'enemy', classPath: 'ninja', tier: 3, damage: 8, poison: 2, upgradeBonus: dmg2 },
  { id: 'ninjutsu', name: 'Ninjutsu', description: '10 daño + esquiva 1 + roba 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'ninja', tier: 3, damage: 10, dodge: 1, drawCards: 1, upgradeBonus: dmg2 },

  // --- Verdugo (Asesino) ---
  { id: 'condena', name: 'Condena', description: 'Si <35% HP: 22 daño. Si no: 8.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'verdugo', tier: 3, damage: 8, executeThreshold: 35, executeDamage: 22, upgradeBonus: dmg3 },
  { id: 'golpe_gracia', name: 'Golpe de Gracia', description: '15 daño + debilita 2.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'verdugo', tier: 3, damage: 15, weaken: 2, upgradeBonus: dmg3 },
  { id: 'guillotina', name: 'Guillotina', description: '18 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'verdugo', tier: 3, damage: 18, upgradeBonus: dmg3 },
  { id: 'ultima_piedad', name: 'Última Piedad', description: '5 cura + esquiva 2 + roba 1.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'verdugo', tier: 3, heal: 5, dodge: 2, drawCards: 1, upgradeBonus: heal2 },

  // --- Trovador (Bardo) ---
  { id: 'cancion_epica', name: 'Canción Épica', description: '+5 daño este turno + roba 2.', cost: 1, rarity: 'legendary', target: 'passive', classPath: 'trovador', tier: 3, attackBuffTurn: 5, drawCards: 2, upgradeBonus: atkBuff2 },
  { id: 'heroismo', name: 'Heroísmo', description: '8 daño + +3 Fuerza.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'trovador', tier: 3, damage: 8, strengthBuff: 3, upgradeBonus: dmg3 },
  { id: 'sinfonia', name: 'Sinfonía', description: 'Roba 5 + 1 energía + 3 cura.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'trovador', tier: 3, drawCards: 5, energyGain: 1, heal: 3, upgradeBonus: draw1 },
  { id: 'acorde_final', name: 'Acorde Final', description: '12 daño AOE.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'trovador', tier: 3, aoeDamage: 12, upgradeBonus: aoe5 },

  // --- Encantador (Bardo) ---
  { id: 'sirena', name: 'Canto de Sirena', description: '8 daño + cura 5 + debilita 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'encantador', tier: 3, damage: 8, heal: 5, weaken: 1, upgradeBonus: dmg2 },
  { id: 'sonambulo', name: 'Sonámbulo', description: 'Debilita 3 + congela 1 + roba 1.', cost: 1, rarity: 'legendary', target: 'enemy', classPath: 'encantador', tier: 3, weaken: 3, freeze: 1, drawCards: 1, upgradeBonus: weaken1 },
  { id: 'encantamiento', name: 'Encantamiento', description: 'Cura 6 + roba 3 + esquiva 1.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'encantador', tier: 3, heal: 6, drawCards: 3, dodge: 1, upgradeBonus: heal2 },
  { id: 'hechizo_amor', name: 'Hechizo de Amor', description: '6 daño + cura 6 + roba 2.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'encantador', tier: 3, damage: 6, heal: 6, drawCards: 2, upgradeBonus: dmg2 },

  // --- Cruzado (Paladín) ---
  { id: 'juicio_final', name: 'Juicio Final', description: '15 daño + cura 5.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'cruzado', tier: 3, damage: 15, heal: 5, upgradeBonus: dmg3 },
  { id: 'escudo_cruzada', name: 'Escudo de Cruzada', description: '12 bloque + cura 5.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'cruzado', tier: 3, block: 12, heal: 5, upgradeBonus: blk3 },
  { id: 'espada_sagrada', name: 'Espada Sagrada', description: '12 daño + 3 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'cruzado', tier: 3, damage: 12, burn: 3, upgradeBonus: dmg3 },
  { id: 'fe_inquebrantable', name: 'Fe Inquebrantable', description: '8 bloque + cura 6 + esquiva 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'cruzado', tier: 3, block: 8, heal: 6, dodge: 1, upgradeBonus: blk2 },

  // --- Santo (Paladín) ---
  { id: 'milagro', name: 'Milagro', description: 'Cura 12 + 6 bloque.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'santo', tier: 3, heal: 12, block: 6, upgradeBonus: heal3 },
  { id: 'resplandor', name: 'Resplandor', description: '10 daño + cura 6 + 2 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'santo', tier: 3, damage: 10, heal: 6, burn: 2, upgradeBonus: dmg3 },
  { id: 'intervencion_divina', name: 'Intervención Divina', description: '10 daño + cura 5 + debilita 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'santo', tier: 3, damage: 10, heal: 5, weaken: 1, upgradeBonus: dmg2 },
  { id: 'aura_sanadora', name: 'Aura Sanadora', description: 'Cura 8 + roba 2 + 3 bloque.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'santo', tier: 3, heal: 8, drawCards: 2, block: 3, upgradeBonus: heal2 },

  // --- Titán (Berserker) ---
  { id: 'golpe_titan', name: 'Golpe de Titán', description: '22 daño. Se lastima 5.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'titan', tier: 3, damage: 22, selfDamage: 5, upgradeBonus: selfDmgReduce2 },
  { id: 'terremoto', name: 'Terremoto', description: '12 daño AOE. Se lastima 3.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'titan', tier: 3, aoeDamage: 12, selfDamage: 3, upgradeBonus: aoe5 },
  { id: 'martillo_cosmico', name: 'Martillo Cósmico', description: '18 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'titan', tier: 3, damage: 18, upgradeBonus: dmg4 },
  { id: 'piel_titan', name: 'Piel de Titán', description: '10 bloque + +2 Fuerza.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'titan', tier: 3, block: 10, strengthBuff: 2, upgradeBonus: blk3 },

  // --- Berserker Ancestral (Berserker) ---
  { id: 'furiosa_ancestral', name: 'Furia Ancestral', description: '+6 Fuerza. Se lastima 6.', cost: 1, rarity: 'legendary', target: 'passive', classPath: 'berserker_ancestral', tier: 3, strengthBuff: 6, selfDamage: 6, upgradeBonus: selfDmgReduce2 },
  { id: 'sacrificio_sangre', name: 'Sacrificio de Sangre', description: 'Pierde 10 HP, 25 daño.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'berserker_ancestral', tier: 3, damage: 25, selfDamage: 10, upgradeBonus: selfDmgReduce2 },
  { id: 'hachazo_carnicero', name: 'Hachazo Carnicero', description: '15 daño AOE. Se lastima 4.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'berserker_ancestral', tier: 3, aoeDamage: 15, selfDamage: 4, upgradeBonus: aoe5 },
  { id: 'rugido_guerra', name: 'Rugido de Guerra', description: '8 daño + 3 Fuerza + roba 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'berserker_ancestral', tier: 3, damage: 8, strengthBuff: 3, drawCards: 1, upgradeBonus: dmg2 },

  // --- Maestro Bestias (Guardabosques) ---
  { id: 'bestia_salvaje', name: 'Bestia Salvaje', description: '12 daño + 3 veneno.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'maestro_bestias', tier: 3, damage: 12, poison: 3, upgradeBonus: dmg3 },
  { id: 'reino_animal', name: 'Reino Animal', description: '8 daño AOE + 2 quemadura.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'maestro_bestias', tier: 3, aoeDamage: 8, burn: 2, upgradeBonus: aoe5 },
  { id: 'garra_tigre', name: 'Garra de Tigre', description: '15 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'maestro_bestias', tier: 3, damage: 15, upgradeBonus: dmg3 },
  { id: 'instinto_animal', name: 'Instinto Animal', description: '4 bloque + esquiva 2 + roba 2.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'maestro_bestias', tier: 3, block: 4, dodge: 2, drawCards: 2, upgradeBonus: blk2 },

  // --- Cazador Sombras (Guardabosques) ---
  { id: 'flecha_sombra', name: 'Flecha de Sombra', description: '14 daño + debilita 2.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'cazador_sombras', tier: 3, damage: 14, weaken: 2, upgradeBonus: dmg3 },
  { id: 'acecho_eterno', name: 'Acecho Eterno', description: '10 daño + esquiva 2 + roba 2.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'cazador_sombras', tier: 3, damage: 10, dodge: 2, drawCards: 2, upgradeBonus: dmg2 },
  { id: 'disparo_fantasma', name: 'Disparo Fantasma', description: '18 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'cazador_sombras', tier: 3, damage: 18, upgradeBonus: dmg3 },
  { id: 'merodeador', name: 'Merodeador Nocturno', description: '6 bloque + esquiva 2 + cura 3.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'cazador_sombras', tier: 3, block: 6, dodge: 2, heal: 3, upgradeBonus: blk2 },

  // --- Desintegrador (Artillero) ---
  { id: 'rayo_desintegrador', name: 'Rayo Desintegrador', description: '20 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'desintegrador', tier: 3, damage: 20, upgradeBonus: dmg4 },
  { id: 'bomba_atomica', name: 'Bomba Atómica', description: '15 daño AOE + 3 quemadura.', cost: 4, rarity: 'legendary', target: 'all_enemies', classPath: 'desintegrador', tier: 3, aoeDamage: 15, burn: 3, upgradeBonus: aoe5 },
  { id: 'canon_plasma', name: 'Cañón de Plasma', description: '18 daño + 2 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'desintegrador', tier: 3, damage: 18, burn: 2, upgradeBonus: dmg3 },
  { id: 'campo_fuerza', name: 'Campo de Fuerza', description: '10 bloque + roba 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'desintegrador', tier: 3, block: 10, drawCards: 1, upgradeBonus: blk3 },

  // --- Bombardero (Artillero) ---
  { id: 'lluvia_fuego', name: 'Lluvia de Fuego', description: '12 daño AOE + 4 quemadura.', cost: 4, rarity: 'legendary', target: 'all_enemies', classPath: 'bombardero', tier: 3, aoeDamage: 12, burn: 4, upgradeBonus: aoe5 },
  { id: 'misil_guiado', name: 'Misil Guiado', description: '16 daño + 3 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'bombardero', tier: 3, damage: 16, burn: 3, upgradeBonus: dmg3 },
  { id: 'artilleria_pesada', name: 'Artillería Pesada', description: '14 daño AOE.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'bombardero', tier: 3, aoeDamage: 14, upgradeBonus: aoe5 },
  { id: 'bunker', name: 'Bunker', description: '12 bloque + cura 3.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'bombardero', tier: 3, block: 12, heal: 3, upgradeBonus: blk3 },

  // --- Monje Diamante (Artista Marcial) ---
  { id: 'puño_diamante', name: 'Puño de Diamante', description: '12 daño + 3 bloque.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'monje_diamante', tier: 3, damage: 12, block: 3, upgradeBonus: dmg3 },
  { id: 'reflejo_perfecto', name: 'Reflejo Perfecto', description: '8 bloque + esquiva 2 + roba 2.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'monje_diamante', tier: 3, block: 8, dodge: 2, drawCards: 2, upgradeBonus: blk2 },
  { id: 'palma_cemento', name: 'Palma de Cemento', description: '14 daño.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'monje_diamante', tier: 3, damage: 14, upgradeBonus: dmg3 },
  { id: 'postura_diamante', name: 'Postura Diamante', description: '10 bloque + esquiva 1 + cura 3.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'monje_diamante', tier: 3, block: 10, dodge: 1, heal: 3, upgradeBonus: blk3 },

  // --- Avatar (Artista Marcial) ---
  { id: 'combo_avatar', name: 'Combo del Avatar', description: '10 daño + roba 2 + esquiva 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'avatar', tier: 3, damage: 10, drawCards: 2, dodge: 1, upgradeBonus: dmg3 },
  { id: 'estado_avatar', name: 'Estado Avatar', description: '+4 Fuerza + cura 3 + roba 1.', cost: 1, rarity: 'legendary', target: 'passive', classPath: 'avatar', tier: 3, strengthBuff: 4, heal: 3, drawCards: 1, upgradeBonus: str2 },
  { id: 'golpe_cosmico', name: 'Golpe Cósmico', description: '16 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'avatar', tier: 3, damage: 16, upgradeBonus: dmg4 },
  { id: 'ser_transcendente', name: 'Ser Transcendente', description: '6 bloque + cura 4 + esquiva 1 + roba 1.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'avatar', tier: 3, block: 6, heal: 4, dodge: 1, drawCards: 1, upgradeBonus: blk2 },

  // --- Iluminado (Maestro Zen) ---
  { id: 'serenidad', name: 'Serenidad', description: 'Cura 6 + roba 4 + 1 energía.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'iluminado', tier: 3, heal: 6, drawCards: 4, energyGain: 1, upgradeBonus: heal2 },
  { id: 'vision_perfecta', name: 'Visión Perfecta', description: '8 daño + roba 3.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'iluminado', tier: 3, damage: 8, drawCards: 3, upgradeBonus: dmg2 },
  { id: 'despertar', name: 'Despertar', description: 'Roba 6 + 2 energía.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'iluminado', tier: 3, drawCards: 6, energyGain: 2, upgradeBonus: draw1 },
  { id: 'chakra_supremo', name: 'Chakra Supremo', description: '5 daño + 5 bloque + cura 4.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'iluminado', tier: 3, damage: 5, block: 5, heal: 4, upgradeBonus: blk2 },

  // --- Fantasma Errante (Maestro Zen) ---
  { id: 'atravesar', name: 'Atravesar', description: '11 daño + esquiva 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'fantasma_errante', tier: 3, damage: 11, dodge: 1, upgradeBonus: dmg3 },
  { id: 'desvanecer', name: 'Desvanecer', description: '6 bloque + esquiva 3 + roba 2.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'fantasma_errante', tier: 3, block: 6, dodge: 3, drawCards: 2, upgradeBonus: blk2 },
  { id: 'toque_fantasma', name: 'Toque Fantasma', description: '13 daño + debilita 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'fantasma_errante', tier: 3, damage: 13, weaken: 1, upgradeBonus: dmg3 },
  { id: 'forma_eterea', name: 'Forma Etérea', description: '8 bloque + esquiva 2 + cura 3.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'fantasma_errante', tier: 3, block: 8, dodge: 2, heal: 3, upgradeBonus: blk2 },

  // --- Hombre Lobo (Cambiaformas) ---
  { id: 'mordisco_mortal', name: 'Mordisco Mortal', description: '16 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'hombre_lobo', tier: 3, damage: 16, upgradeBonus: dmg3 },
  { id: 'aullido', name: 'Aullido', description: '8 daño + debilita 2 + 3 quemadura.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'hombre_lobo', tier: 3, damage: 8, weaken: 2, burn: 3, upgradeBonus: dmg2 },
  { id: 'garra_letal', name: 'Garra Letal', description: '14 daño + 3 veneno.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'hombre_lobo', tier: 3, damage: 14, poison: 3, upgradeBonus: dmg3 },
  { id: 'regeneracion_lobuna', name: 'Regeneración Lupina', description: 'Cura 7 + 4 bloque.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'hombre_lobo', tier: 3, heal: 7, block: 4, upgradeBonus: heal3 },

  // --- Espíritu Bosque (Cambiaformas) ---
  { id: 'raices', name: 'Raíces Ancestrales', description: '10 bloque + cura 6.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'espiritu_bosque', tier: 3, block: 10, heal: 6, upgradeBonus: blk3 },
  { id: 'corazon_bosque', name: 'Corazón del Bosque', description: 'Cura 10 + roba 2 + 3 bloque.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'espiritu_bosque', tier: 3, heal: 10, drawCards: 2, block: 3, upgradeBonus: heal3 },
  { id: 'latigo_espinas', name: 'Látigo de Espinas', description: '12 daño + 3 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'espiritu_bosque', tier: 3, damage: 12, burn: 3, upgradeBonus: dmg3 },
  { id: 'bosque_viviente', name: 'Bosque Viviente', description: '8 daño + 5 bloque + cura 3.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'espiritu_bosque', tier: 3, damage: 8, block: 5, heal: 3, upgradeBonus: dmg2 },

  // --- Druida Ancestral (Invocador) ---
  { id: 'sabiduria_ancestral', name: 'Sabiduría Ancestral', description: '+4 Fuerza + roba 2 + 2 energía.', cost: 1, rarity: 'legendary', target: 'passive', classPath: 'druida_ancestral', tier: 3, strengthBuff: 4, drawCards: 2, energyGain: 2, upgradeBonus: str2 },
  { id: 'naturaleza_desatada', name: 'Naturaleza Desatada', description: '14 daño AOE + 3 veneno.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'druida_ancestral', tier: 3, aoeDamage: 14, poison: 3, upgradeBonus: aoe5 },
  { id: 'espíritu_supremo', name: 'Espíritu Supremo', description: '12 daño + cura 4.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'druida_ancestral', tier: 3, damage: 12, heal: 4, upgradeBonus: dmg3 },
  { id: 'bosque_ancestral', name: 'Bosque Ancestral', description: '8 bloque + cura 5 + roba 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'druida_ancestral', tier: 3, block: 8, heal: 5, drawCards: 1, upgradeBonus: blk2 },

  // --- Látigo del Mundo (Invocador) ---
  { id: 'latigo_natural', name: 'Látigo Natural', description: '13 daño + 3 quemadura + 2 veneno.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'latigo_mundo', tier: 3, damage: 13, burn: 3, poison: 2, upgradeBonus: dmg3 },
  { id: 'ira_mundo', name: 'Ira del Mundo', description: '11 daño AOE + 2 quemadura.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'latigo_mundo', tier: 3, aoeDamage: 11, burn: 2, upgradeBonus: aoe5 },
  { id: 'naturaleza_viva', name: 'Naturaleza Viva', description: '10 daño + 4 bloque + cura 3.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'latigo_mundo', tier: 3, damage: 10, block: 4, heal: 3, upgradeBonus: dmg2 },
  { id: 'proteccion_mundo', name: 'Protección del Mundo', description: '10 bloque + esquiva 1 + cura 4.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'latigo_mundo', tier: 3, block: 10, dodge: 1, heal: 4, upgradeBonus: blk3 },

  // --- Sumo Sacerdote (Clérigo) ---
  { id: 'oracion_suprema', name: 'Oración Suprema', description: 'Cura 12 + roba 3 + 4 bloque.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'sumo_sacerdote', tier: 3, heal: 12, drawCards: 3, block: 4, upgradeBonus: heal3 },
  { id: 'divina_providencia', name: 'Divina Providencia', description: '8 daño + cura 8.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'sumo_sacerdote', tier: 3, damage: 8, heal: 8, upgradeBonus: dmg3 },
  { id: 'milagro_masivo', name: 'Milagro Masivo', description: 'Cura 15.', cost: 3, rarity: 'legendary', target: 'self', classPath: 'sumo_sacerdote', tier: 3, heal: 15, upgradeBonus: heal3 },
  { id: 'santidad', name: 'Santidad', description: '6 bloque + cura 8 + roba 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'sumo_sacerdote', tier: 3, block: 6, heal: 8, drawCards: 1, upgradeBonus: heal2 },

  // --- Sanador Divino (Clérigo) ---
  { id: 'toque_divino', name: 'Toque Divino', description: 'Cura 14 + 5 bloque.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'sanador_divino', tier: 3, heal: 14, block: 5, upgradeBonus: heal3 },
  { id: 'resurreccion_mayor', name: 'Resurrección Mayor', description: 'Cura 12 + roba 3 + 1 energía.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'sanador_divino', tier: 3, heal: 12, drawCards: 3, energyGain: 1, upgradeBonus: heal2 },
  { id: 'gracia_divina', name: 'Gracia Divina', description: '8 daño + cura 8 + 3 bloque.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'sanador_divino', tier: 3, damage: 8, heal: 8, block: 3, upgradeBonus: dmg2 },
  { id: 'halo_sagrado', name: 'Halo Sagrado', description: 'Cura 10 + esquiva 1 + roba 2.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'sanador_divino', tier: 3, heal: 10, dodge: 1, drawCards: 2, upgradeBonus: heal2 },

  // --- Juez Final (Inquisidor) ---
  { id: 'veredicto', name: 'Veredicto', description: '18 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'juez_final', tier: 3, damage: 18, upgradeBonus: dmg4 },
  { id: 'ejecucion_divina', name: 'Ejecución Divina', description: 'Si <40% HP: 25 daño. Si no: 10.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'juez_final', tier: 3, damage: 10, executeThreshold: 40, executeDamage: 25, upgradeBonus: dmg3 },
  { id: 'tribunal', name: 'Tribunal', description: '12 daño + debilita 3.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'juez_final', tier: 3, damage: 12, weaken: 3, upgradeBonus: dmg3 },
  { id: 'ley_divina', name: 'Ley Divina', description: '10 daño + 5 quemadura + cura 3.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'juez_final', tier: 3, damage: 10, burn: 5, heal: 3, upgradeBonus: dmg2 },

  // --- Purificador (Inquisidor) ---
  { id: 'llama_purificadora', name: 'Llama Purificadora', description: '12 daño + cura 6 + 4 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'purificador', tier: 3, damage: 12, heal: 6, burn: 4, upgradeBonus: dmg3 },
  { id: 'exorcismo', name: 'Exorcismo', description: '14 daño + debilita 2 + congela 1.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'purificador', tier: 3, damage: 14, weaken: 2, freeze: 1, upgradeBonus: dmg3 },
  { id: 'fuego_purgatorio', name: 'Fuego del Purgatorio', description: '10 daño AOE + quema 5.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'purificador', tier: 3, aoeDamage: 10, burn: 5, upgradeBonus: aoe5 },
  { id: 'purificacion', name: 'Purificación', description: 'Cura 8 + 5 bloque + esquiva 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'purificador', tier: 3, heal: 8, block: 5, dodge: 1, upgradeBonus: heal2 },

  // --- Señor Elementos (Elementalista) ---
  { id: 'cataclismo', name: 'Cataclismo', description: '18 daño AOE + 3 quemadura.', cost: 4, rarity: 'legendary', target: 'all_enemies', classPath: 'senor_elementos', tier: 3, aoeDamage: 18, burn: 3, upgradeBonus: aoe5 },
  { id: 'elemento_puro', name: 'Elemento Puro', description: '20 daño.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'senor_elementos', tier: 3, damage: 20, upgradeBonus: dmg4 },
  { id: 'cuatro_elementos', name: 'Cuatro Elementos', description: '12 daño + 3 quemadura + congela 1.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'senor_elementos', tier: 3, damage: 12, burn: 3, freeze: 1, upgradeBonus: dmg3 },
  { id: 'escudo_cosmico', name: 'Escudo Cósmico', description: '10 bloque + congela 1 + cura 3.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'senor_elementos', tier: 3, block: 10, freeze: 1, heal: 3, upgradeBonus: blk2 },

  // --- Ciclón (Elementalista) ---
  { id: 'vortice', name: 'Vórtice', description: '15 daño AOE.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'ciclon', tier: 3, aoeDamage: 15, upgradeBonus: aoe5 },
  { id: 'torbellino', name: 'Torbellino', description: '10 daño + roba 3 + 2 bloque.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'ciclon', tier: 3, damage: 10, drawCards: 3, block: 2, upgradeBonus: dmg2 },
  { id: 'viento_corte', name: 'Viento Cortante', description: '14 daño + debilita 1.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'ciclon', tier: 3, damage: 14, weaken: 1, upgradeBonus: dmg3 },
  { id: ' huracan', name: 'Huracán', description: 'Roba 5 + 2 energía + esquiva 1.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'ciclon', tier: 3, drawCards: 5, energyGain: 2, dodge: 1, upgradeBonus: draw1 },

  // --- Chamán Supremo (Ancestral) ---
  { id: 'consejo_ancestros', name: 'Consejo de Ancestros', description: 'Roba 4 + 3 energía + 6 bloque.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'chaman_supremo', tier: 3, drawCards: 4, energyGain: 3, block: 6, upgradeBonus: draw1 },
  { id: 'escudo_espiritual', name: 'Escudo Espiritual', description: '12 bloque + cura 4 + esquiva 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'chaman_supremo', tier: 3, block: 12, heal: 4, dodge: 1, upgradeBonus: blk3 },
  { id: 'ritual_supremo', name: 'Ritual Supremo', description: '8 daño + 5 bloque + cura 3.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'chaman_supremo', tier: 3, damage: 8, block: 5, heal: 3, upgradeBonus: dmg2 },
  { id: 'mundo_espiritus', name: 'Mundo de Espíritus', description: '10 bloque + roba 2 + esquiva 2.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'chaman_supremo', tier: 3, block: 10, drawCards: 2, dodge: 2, upgradeBonus: blk2 },

  // --- Vidente (Ancestral) ---
  { id: 'tercer_ojo', name: 'Tercer Ojo', description: '10 daño + roba 4.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'vidente', tier: 3, damage: 10, drawCards: 4, upgradeBonus: dmg3 },
  { id: 'premonicion', name: 'Premonición', description: 'Roba 6 + 2 energía + 3 bloque.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'vidente', tier: 3, drawCards: 6, energyGain: 2, block: 3, upgradeBonus: draw1 },
  { id: 'destino', name: 'Golpe del Destino', description: '16 daño + roba 2.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'vidente', tier: 3, damage: 16, drawCards: 2, upgradeBonus: dmg3 },
  { id: 'clarividencia', name: 'Clarividencia', description: 'Cura 5 + roba 3 + esquiva 1.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'vidente', tier: 3, heal: 5, drawCards: 3, dodge: 1, upgradeBonus: heal2 },

  // --- Paladín Legendario (Templario) ---
  { id: 'espada_legendaria', name: 'Espada Legendaria', description: '18 daño + cura 5.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'paladin_legendario', tier: 3, damage: 18, heal: 5, upgradeBonus: dmg3 },
  { id: 'escudo_legendario', name: 'Escudo Legendario', description: '14 bloque + cura 6 + esquiva 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'paladin_legendario', tier: 3, block: 14, heal: 6, dodge: 1, upgradeBonus: blk3 },
  { id: 'golpe_legendario', name: 'Golpe Legendario', description: '15 daño + 3 quemadura.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'paladin_legendario', tier: 3, damage: 15, burn: 3, upgradeBonus: dmg3 },
  { id: 'aura_legendaria', name: 'Aura Legendaria', description: 'Cura 8 + 6 bloque + roba 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'paladin_legendario', tier: 3, heal: 8, block: 6, drawCards: 1, upgradeBonus: heal2 },

  // --- Muro de Hierro (Templario) ---
  { id: 'fortaleza_maxima', name: 'Fortaleza Máxima', description: '16 bloque + esquiva 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'muro_hierro', tier: 3, block: 16, dodge: 1, upgradeBonus: blk3 },
  { id: 'contraataque', name: 'Contraataque', description: '14 daño + 4 bloque.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'muro_hierro', tier: 3, damage: 14, block: 4, upgradeBonus: dmg3 },
  { id: 'muralla', name: 'Muralla', description: '18 bloque + cura 4.', cost: 3, rarity: 'legendary', target: 'self', classPath: 'muro_hierro', tier: 3, block: 18, heal: 4, upgradeBonus: blk3 },
  { id: 'guarnicion', name: 'Guarnición', description: '10 bloque + cura 5 + roba 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'muro_hierro', tier: 3, block: 10, heal: 5, drawCards: 1, upgradeBonus: blk2 },

  // --- Mercenario Real (Condotiero) ---
  { id: 'contrato_real', name: 'Contrato Real', description: '15 daño + roba 2 + 1 energía.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'mercenario_real', tier: 3, damage: 15, drawCards: 2, energyGain: 1, upgradeBonus: dmg3 },
  { id: 'emboscada_real', name: 'Emboscada Real', description: '12 daño AOE.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'mercenario_real', tier: 3, aoeDamage: 12, upgradeBonus: aoe5 },
  { id: 'ejercito_pago', name: 'Ejército Pagado', description: '10 daño + +3 Fuerza.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'mercenario_real', tier: 3, damage: 10, strengthBuff: 3, upgradeBonus: dmg3 },
  { id: 'cofre_real', name: 'Cofre Real', description: 'Roba 4 + 2 energía + cura 3.', cost: 1, rarity: 'legendary', target: 'self', classPath: 'mercenario_real', tier: 3, drawCards: 4, energyGain: 2, heal: 3, upgradeBonus: draw1 },

  // --- Capitán de Guerra (Condotiero) ---
  { id: 'tactica_superior', name: 'Táctica Superior', description: '10 daño + roba 3 + 2 Fuerza.', cost: 2, rarity: 'legendary', target: 'enemy', classPath: 'capitan_guerra', tier: 3, damage: 10, drawCards: 3, strengthBuff: 2, upgradeBonus: dmg2 },
  { id: 'guerra_total', name: 'Guerra Total', description: '12 daño AOE + 3 quemadura.', cost: 3, rarity: 'legendary', target: 'all_enemies', classPath: 'capitan_guerra', tier: 3, aoeDamage: 12, burn: 3, upgradeBonus: aoe5 },
  { id: 'comandante', name: 'Comandante', description: '14 daño + roba 2 + 1 energía.', cost: 3, rarity: 'legendary', target: 'enemy', classPath: 'capitan_guerra', tier: 3, damage: 14, drawCards: 2, energyGain: 1, upgradeBonus: dmg3 },
  { id: 'cuartel_general', name: 'Cuartel General', description: '8 bloque + cura 5 + roba 1.', cost: 2, rarity: 'legendary', target: 'self', classPath: 'capitan_guerra', tier: 3, block: 8, heal: 5, drawCards: 1, upgradeBonus: blk2 },

  // ═══ CURSE CARDS ═══
  { id: 'decadencia', name: 'Decadencia', description: 'Maldición: al jugarla, pierdes 3 HP.', cost: 0, rarity: 'curse', target: 'self', classPath: 'vagabundo', tier: 0, selfDamage: 3 },
  { id: 'culpa', name: 'Culpa', description: 'Maldición: ocupa espacio. No hace nada.', cost: 0, rarity: 'curse', target: 'passive', classPath: 'vagabundo', tier: 0 },
  { id: 'vacuidad', name: 'Vacuidad', description: 'Maldición: si la robas, pierdes 1 energía.', cost: 0, rarity: 'curse', target: 'passive', classPath: 'vagabundo', tier: 0 },
];

// ─── Card Transform Map ──────────────────────────────────

export const TRANSFORM_MAP: TransformMap = {
  // Tier 0 → Tier 1
  golpe_basico: { mago: 'bola_fuego', picaro: 'punialada', guerrero: 'corte_poderoso', cazador: 'disparo_lejano', monje: 'patada_circular', druida: 'mordisco_salvaje', sacerdote: 'golpe_fe', chaman: 'rayo_espiritual', caballero: 'espadazo' },
  escudo_ramas: { mago: 'escudo_arcano', picaro: 'evadir', guerrero: 'muro_escudos', cazador: 'red_cazador', monje: 'postura_defensa', druida: 'corteza_arbol', sacerdote: 'santuario', chaman: 'proteccion_ancestral', caballero: 'fortaleza' },

  // Tier 1 → Tier 2
  bola_fuego: { hechicero: 'llamarada', brujo: 'drenar_alma' },
  escudo_arcano: { hechicero: 'barrera_hielo', brujo: 'maldicion' },
  punialada: { asesino: 'apunialar', bardo: 'golpe_ritmico' },
  evadir: { asesino: 'sombras', bardo: 'melodia_protectora' },
  corte_poderoso: { paladin: 'golpe_divino', berserker: 'hachazo_salvaje' },
  muro_escudos: { paladin: 'bendicion', berserker: 'furia' },
  disparo_lejano: { guardabosques: 'flecha_venenosa', artillero: 'bazuca' },
  red_cazador: { guardabosques: 'camuflaje', artillero: 'bomba_humo' },
  patada_circular: { artista_marcial: 'patada_giratoria', maestro_zen: 'golpe_vacio' },
  postura_defensa: { artista_marcial: 'puño_trueno', maestro_zen: 'koan' },
  mordisco_salvaje: { cambiaformas: 'mordisco_feroz', invocador: 'cuervo' },
  corteza_arbol: { cambiaformas: 'garras_venenosas', invocador: 'oso_guardian' },
  golpe_fe: { clerigo: 'juicio_divino', inquisidor: 'auto_fe' },
  santuario: { clerigo: 'rezos_masivos', inquisidor: 'absolucion' },
  rayo_espiritual: { elementalista: 'fuego_hielo', ancestral: 'llamado_espiritus' },
  proteccion_ancestral: { elementalista: 'escudo_elemental', ancestral: 'escudo_antepasados' },
  espadazo: { templario: 'golpe_templario', condotiero: 'contrato_asesino' },
  fortaleza: { templario: 'bendicion_fe', condotiero: 'escudo_mercenario' },

  // Tier 2 → Tier 3
  llamarada: { archimago: 'cometa', pirocapitan: 'explosion_solar' },
  barrera_hielo: { archimago: 'absorber_magia', pirocapitan: 'corona_fuego' },
  drenar_alma: { nigromante: 'alma_condenada', senor_sombras: 'garras_sombra' },
  maldicion: { nigromante: 'ritual_oscuridad', senor_sombras: 'manto_oscuro' },
  apunialar: { ninja: 'shuriken', verdugo: 'guillotina' },
  sombras: { ninja: 'cuerpo_vapor', verdugo: 'ultima_piedad' },
  golpe_ritmico: { trovador: 'heroismo', encantador: 'hechizo_amor' },
  melodia_protectora: { trovador: 'sinfonia', encantador: 'encantamiento' },
  golpe_divino: { cruzado: 'espada_sagrada', santo: 'intervencion_divina' },
  bendicion: { cruzado: 'escudo_cruzada', santo: 'aura_sanadora' },
  hachazo_salvaje: { titan: 'martillo_cosmico', berserker_ancestral: 'hachazo_carnicero' },
  furia: { titan: 'piel_titan', berserker_ancestral: 'rugido_guerra' },
  flecha_venenosa: { maestro_bestias: 'garra_tigre', cazador_sombras: 'flecha_sombra' },
  camuflaje: { maestro_bestias: 'instinto_animal', cazador_sombras: 'merodeador' },
  bazuca: { desintegrador: 'rayo_desintegrador', bombardero: 'misil_guiado' },
  bomba_humo: { desintegrador: 'campo_fuerza', bombardero: 'bunker' },
  patada_giratoria: { monje_diamante: 'palma_cemento', avatar: 'golpe_cosmico' },
  puño_trueno: { monje_diamante: 'puño_diamante', avatar: 'combo_avatar' },
  mordisco_feroz: { hombre_lobo: 'mordisco_mortal', espiritu_bosque: 'latigo_espinas' },
  garras_venenosas: { hombre_lobo: 'garra_letal', espiritu_bosque: 'bosque_viviente' },
  juicio_divino: { sumo_sacerdote: 'divina_providencia', sanador_divino: 'gracia_divina' },
  rezos_masivos: { sumo_sacerdote: 'oracion_suprema', sanador_divino: 'resurreccion_mayor' },
  auto_fe: { juez_final: 'tribunal', purificador: 'llama_purificadora' },
  absolucion: { juez_final: 'ley_divina', purificador: 'exorcismo' },
  fuego_hielo: { senor_elementos: 'cuatro_elementos', ciclon: 'viento_corte' },
  escudo_elemental: { senor_elementos: 'escudo_cosmico', ciclon: 'torbellino' },
  golpe_templario: { paladin_legendario: 'golpe_legendario', muro_hierro: 'contraataque' },
  bendicion_fe: { paladin_legendario: 'escudo_legendario', muro_hierro: 'fortaleza_maxima' },
  contrato_asesino: { mercenario_real: 'ejercito_pago', capitan_guerra: 'comandante' },
  escudo_mercenario: { mercenario_real: 'cofre_real', capitan_guerra: 'cuartel_general' },
};

// ─── Event reward cards (generic) ───────────────────────

export const EVENT_REWARD_CARDS: CardDef[] = [
  { id: 'wish_card', name: 'Deseo Cumplido', description: '7 daño + 3 bloque.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'vagabundo', tier: 0, damage: 7, block: 3, upgradeBonus: dmg3 },
  { id: 'soul_pact_card', name: 'Pacto de Sangre', description: '10 daño + quema 2.', cost: 2, rarity: 'rare', target: 'enemy', classPath: 'vagabundo', tier: 0, damage: 10, burn: 2, upgradeBonus: dmg3 },
  { id: 'wanderer_card', name: 'Carta del Caminante', description: 'Roba 2 + 3 bloque.', cost: 1, rarity: 'common', target: 'self', classPath: 'vagabundo', tier: 0, drawCards: 2, block: 3, upgradeBonus: draw1 },
  { id: 'grimorio_card', name: 'Conocimiento Prohibido', description: 'Roba 3 y gana 1 energía.', cost: 0, rarity: 'rare', target: 'self', classPath: 'vagabundo', tier: 0, drawCards: 3, energyGain: 1, upgradeBonus: draw1 },
];

// ─── Helpers ────────────────────────────────────────────

export function getCardDef(id: string): CardDef {
  const card = ALL_CARDS.find(c => c.id === id) || EVENT_REWARD_CARDS.find(c => c.id === id);
  if (!card) throw new Error(`Card not found: ${id}`);
  return card;
}

/** Get effective card stats considering upgrade bonus */
export function getEffectiveCardDef(card: { defId: string; upgraded: boolean }): CardDef {
  const def = getCardDef(card.defId);
  if (!card.upgraded || !def.upgradeBonus) return def;

  const ub = def.upgradeBonus;
  return {
    ...def,
    cost: Math.max(0, def.cost - (ub.costReduction || 0)),
    damage: def.damage ? def.damage + (ub.bonusDamage || 0) : undefined,
    aoeDamage: def.aoeDamage ? def.aoeDamage + (ub.bonusAoeDamage || 0) : undefined,
    block: def.block ? def.block + (ub.bonusBlock || 0) : (ub.bonusBlock ? ub.bonusBlock : undefined),
    heal: def.heal ? def.heal + (ub.bonusHeal || 0) : (ub.bonusHeal ? ub.bonusHeal : undefined),
    drawCards: def.drawCards ? def.drawCards + (ub.bonusDraw || 0) : (ub.bonusDraw ? ub.bonusDraw : undefined),
    burn: def.burn ? def.burn + (ub.bonusBurn || 0) : (ub.bonusBurn ? ub.bonusBurn : undefined),
    poison: def.poison ? def.poison + (ub.bonusPoison || 0) : (ub.bonusPoison ? ub.bonusPoison : undefined),
    freeze: def.freeze ? def.freeze + (ub.bonusFreeze || 0) : (ub.bonusFreeze ? ub.bonusFreeze : undefined),
    weaken: def.weaken ? def.weaken + (ub.bonusWeaken || 0) : (ub.bonusWeaken ? ub.bonusWeaken : undefined),
    strengthBuff: def.strengthBuff ? def.strengthBuff + (ub.bonusStrengthBuff || 0) : (ub.bonusStrengthBuff ? ub.bonusStrengthBuff : undefined),
    energyGain: def.energyGain ? def.energyGain + (ub.bonusEnergyGain || 0) : (ub.bonusEnergyGain ? ub.bonusEnergyGain : undefined),
    selfDamage: def.selfDamage ? Math.max(0, def.selfDamage - (ub.bonusSelfDamageReduction || 0)) : undefined,
    dodge: def.dodge ? def.dodge + (ub.bonusDodge || 0) : (ub.bonusDodge ? ub.bonusDodge : undefined),
    attackBuffTurn: def.attackBuffTurn ? def.attackBuffTurn + (ub.bonusAttackBuff || 0) : (ub.bonusAttackBuff ? ub.bonusAttackBuff : undefined),
  };
}

export function transformCard(cardId: string, classPath: ClassPath): string | null {
  const mapping = TRANSFORM_MAP[cardId];
  if (!mapping) return null;
  return mapping[classPath] || null;
}

/** Get all cards available to a given class lineage */
export function getAvailableCards(classPath: string): CardDef[] {
  const lineage = getClassLineage(classPath);
  return ALL_CARDS.filter(c => lineage.includes(c.classPath));
}

/** Get reward pool: cards from player's lineage with < 2 copies */
export function getRewardPool(classPath: string, deck: { defId: string; upgraded: boolean }[]): CardDef[] {
  const available = getAvailableCards(classPath);
  const copyCount = new Map<string, number>();
  for (const card of deck) {
    copyCount.set(card.defId, (copyCount.get(card.defId) || 0) + 1);
  }
  return available.filter(c => (copyCount.get(c.id) || 0) < 2 && c.rarity !== 'curse' && c.rarity !== 'starter');
}

/** Get random card from class lineage for shop/event (respects max 2 copies) */
export function getRandomClassCard(classPath: string, deck?: { defId: string; upgraded: boolean }[]): CardDef | null {
  const copyCount = new Map<string, number>();
  if (deck) {
    for (const card of deck) {
      copyCount.set(card.defId, (copyCount.get(card.defId) || 0) + 1);
    }
  }
  const pool = getAvailableCards(classPath).filter(c => {
    if (c.rarity === 'curse' || c.rarity === 'starter') return false;
    const copies = copyCount.get(c.id) || 0;
    return copies < 2;
  });
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Card Emoji Map ─────────────────────────────────────

export const CARD_EMOJI: Record<string, string> = {
  golpe_basico: '👊', escudo_ramas: '🌿',
  bola_fuego: '🔥', escudo_arcano: '❄️',
  rayo: '⚡', meditacion: '🧘',
  punialada: '🗡️', evadir: '🌀',
  veneno: '☠️', disparo_rapido: '💨',
  corte_poderoso: '⚔️', muro_escudos: '🛡️',
  grito_guerra: '📯', garrote: '💥',
  flecha_precisa: '🏹', trampa_cazador: '🪤',
  disparo_lejano: '🎯', red_cazador: '🕸️',
  golpe_chi: '👊', palma_vacia: '🤚',
  patada_circular: '🦵', postura_defensa: '🧘',
  zarpa_oso: '🐻', enredadera: '🌿',
  mordisco_salvaje: '🦷', corteza_arbol: '🌳',
  castigo_divino: '✨', oracion: '🙏',
  golpe_fe: '🙏', santuario: '⛪',
  totem_fuego: '🔥', espiritu_guardian: '👻',
  rayo_espiritual: '⚡', proteccion_ancestral: '🛡️',
  carga_caballo: '🐴', escudo_caballero: '🛡️',
  espadazo: '⚔️', fortaleza: '🏰',
  // Tier 2
  llamarada: '🔥', barrera_hielo: '🧊', meteorito: '☄️', foco: '🔮',
  drenar_alma: '🌑', maldicion: '👁️', pacto_oscuro: '♤', robo_vida: '💜',
  apunialar: '🔪', sombras: '👤', ejecucion: '💀', emboscada: '🏹',
  golpe_ritmico: '🎵', melodia_protectora: '🎶', cancion_guerra: '🎼', inspiracion_bardo: '🎭',
  golpe_divino: '✨', bendicion: '🙏', luz_sagrada: '☀️', castigo: '⚡',
  hachazo_salvaje: '🪓', furia: '😡', sangre_berserker: '🩸', tromba: '🌪️',
  flecha_venenosa: '🏹', camuflaje: '🌿', latigo_bosque: '🌿', ojo_aguilero: '🦅',
  granada: '💣', municion_especial: '🔫', bazuca: '🎯', bomba_humo: '💨',
  combo_cadena: '👊', defensa_certe: '🥋', patada_giratoria: '🦵', puño_trueno: '⚡',
  iluminacion: '☀️', proyeccion_chi: '🌀', golpe_vacio: '🕳️', koan: '🧘',
  mordisco_feroz: '🐻', garras_venenosas: '🐾', forma_oso: '🐻', piel_camaleonica: '🦎',
  lobo_espiritual: '🐺', llamada_naturaleza: '🌿', cuervo: '🐦', oso_guardian: '🐻',
  resurreccion: '✨', aura_sagrada: '☀️', juicio_divino: '⚖️', rezos_masivos: '🙏',
  fuego_santo: '🔥', sentencia: '⚖️', auto_fe: '🔥', absolucion: '🙏',
  tormenta_elemental: '🌪️', escudo_elemental: '🛡️', fuego_hielo: '🔥', rayo_tierra: '⚡',
  ritual_proteccion: '🛡️', vision_pasado: '👁️', escudo_antepasados: '👻', llamado_espiritus: '🌀',
  juramento_sagrado: '✨', muro_fe: '🛡️', golpe_templario: '⚔️', bendicion_fe: '🙏',
  soborno: '💰', golpe_comprado: '🗡️', contrato_asesino: '💀', escudo_mercenario: '🛡️',
  // Tier 3 Legendary
  apocalipsis: '☄️', trascendencia: '🌟', cometa: '☄️', absorber_magia: '🔮',
  infierno_purificador: '🔥', llamas_eternas: '🔥', explosion_solar: '☀️', corona_fuego: '👑',
  invocar_muertos: '💀', toque_mortal: '☠️', alma_condenada: '👻', ritual_oscuridad: '🌑',
  devorar_sombras: '🌑', vacio_absoluto: '🕳️', garras_sombra: '👁️', manto_oscuro: '🧥',
  golpe_ninja: '🥷', cuerpo_vapor: '💨', shuriken: '⭐', ninjutsu: '🥷',
  condena: '⚓', golpe_gracia: '🗡️', guillotina: '⚔️', ultima_piedad: '🙏',
  cancion_epica: '🎵', heroismo: '🦸', sinfonia: '🎶', acorde_final: '🎼',
  sirena: '🧜', sonambulo: '😴', encantamiento: '✨', hechizo_amor: '💗',
  juicio_final: '⚖️', escudo_cruzada: '🛡️', espada_sagrada: '⚔️', fe_inquebrantable: '✨',
  milagro: '✨', resplandor: '☀️', intervencion_divina: '🙏', aura_sanadora: '🌈',
  golpe_titan: '🗿', terremoto: '🌍', martillo_cosmico: '🔨', piel_titan: '🛡️',
  furiosa_ancestral: '🩸', sacrificio_sangre: '🩸', hachazo_carnicero: '🪓', rugido_guerra: '📯',
  bestia_salvaje: '🦁', reino_animal: '🌍', garra_tigre: '🐯', instinto_animal: '🐺',
  flecha_sombra: '🌑', acecho_eterno: '👁️', disparo_fantasma: '👻', merodeador: '👤',
  rayo_desintegrador: '⚡', bomba_atomica: '☢️', canon_plasma: '🔫', campo_fuerza: '🛡️',
  lluvia_fuego: '🔥', misil_guiado: '🚀', artilleria_pesada: '💣', bunker: '🏗️',
  puño_diamante: '💎', reflejo_perfecto: '🥋', palma_cemento: '✊', postura_diamante: '💎',
  combo_avatar: '🌊', estado_avatar: '🌀', golpe_cosmico: '💫', ser_transcendente: '🌟',
  serenidad: '☀️', vision_perfecta: '👁️', despertar: '🌅', chakra_supremo: '📿',
  atravesar: '👻', desvanecer: '💨', toque_fantasma: '👁️', forma_eterea: '👻',
  mordisco_mortal: '🐺', aullido: '🐺', garra_letal: '🐾', regeneracion_lobuna: '💚',
  raices: '🌳', corazon_bosque: '💚', latigo_espinas: '🌿', bosque_viviente: '🌲',
  sabiduria_ancestral: '🦉', naturaleza_desatada: '🌿', espiritu_supremo: '👻', bosque_ancestral: '🌳',
  latigo_natural: '🌿', ira_mundo: '🌍', naturaleza_viva: '🌱', proteccion_mundo: '🛡️',
  oracion_suprema: '🙏', divina_providencia: '✨', milagro_masivo: '🌟', santidad: '😇',
  toque_divino: '✨', resurreccion_mayor: '🌟', gracia_divina: '🌈', halo_sagrado: '😇',
  veredicto: '⚖️', ejecucion_divina: '⚔️', tribunal: '🏛️', ley_divina: '⚡',
  llama_purificadora: '🔥', exorcismo: '✝️', fuego_purgatorio: '🔥', purificacion: '✨',
  cataclismo: '🌪️', elemento_puro: '💎', cuatro_elementos: '🌍', escudo_cosmico: '🛡️',
  vortice: '🌪️', torbellino: '💨', viento_corte: '🌬️', huracan: '🌀',
  consejo_ancestros: '👻', escudo_espiritual: '🛡️', ritual_supremo: '🔮', mundo_espiritus: '🌟',
  tercer_ojo: '👁️', premonicion: '🔮', destino: '💫', clarividencia: '👁️',
  espada_legendaria: '⚔️', escudo_legendario: '🛡️', golpe_legendario: '⚔️', aura_legendaria: '✨',
  fortaleza_maxima: '🏰', contraataque: '⚔️', muralla: '🧱', guarnicion: '🏗️',
  contrato_real: '📜', emboscada_real: '🏹', ejercito_pago: '⚔️', cofre_real: '👑',
  tactica_superior: '📋', guerra_total: '💥', comandante: '🎖️', cuartel_general: '🏰',
  // curses
  decadencia: '💀', culpa: '😔', vacuidad: '🕳️',
  // event cards
  wish_card: '⛲', soul_pact_card: '👻', wanderer_card: '🧳', grimorio_card: '📖',
};

// ─── Class Color for Cards ──────────────────────────────

export const CLASS_CARD_BORDER: Record<string, string> = {
  vagabundo: 'border-stone-400/30 bg-stone-900/60',
  mago: 'border-violet-400/30 bg-violet-950/40',
  picaro: 'border-emerald-400/30 bg-emerald-950/40',
  guerrero: 'border-red-400/30 bg-red-950/40',
  cazador: 'border-lime-400/30 bg-lime-950/40',
  monje: 'border-amber-400/30 bg-amber-950/40',
  druida: 'border-green-400/30 bg-green-950/40',
  sacerdote: 'border-yellow-400/30 bg-yellow-950/40',
  chaman: 'border-cyan-400/30 bg-cyan-950/40',
  caballero: 'border-slate-400/30 bg-slate-950/40',
  hechicero: 'border-orange-400/30 bg-orange-950/40',
  brujo: 'border-gray-400/30 bg-gray-950/40',
  asesino: 'border-teal-400/30 bg-teal-950/40',
  bardo: 'border-indigo-400/30 bg-indigo-950/40',
  paladin: 'border-amber-400/30 bg-amber-950/40',
  berserker: 'border-rose-400/30 bg-rose-950/40',
  guardabosques: 'border-green-500/30 bg-green-950/40',
  artillero: 'border-orange-500/30 bg-orange-950/40',
  artista_marcial: 'border-red-500/30 bg-red-950/40',
  maestro_zen: 'border-sky-400/30 bg-sky-950/40',
  cambiaformas: 'border-amber-600/30 bg-amber-950/40',
  invocador: 'border-violet-600/30 bg-violet-950/40',
  clerigo: 'border-yellow-500/30 bg-yellow-950/40',
  inquisidor: 'border-red-600/30 bg-red-950/40',
  elementalista: 'border-blue-500/30 bg-blue-950/40',
  ancestral: 'border-purple-500/30 bg-purple-950/40',
  templario: 'border-yellow-600/30 bg-yellow-950/40',
  condotiero: 'border-zinc-500/30 bg-zinc-950/40',
  // Tier 3 - Legendary gold borders
  archimago: 'border-yellow-300/50 bg-yellow-950/30',
  pirocapitan: 'border-orange-400/50 bg-orange-950/30',
  nigromante: 'border-gray-400/50 bg-gray-950/30',
  senor_sombras: 'border-slate-500/50 bg-slate-950/30',
  ninja: 'border-gray-500/50 bg-gray-950/30',
  verdugo: 'border-red-500/50 bg-red-950/30',
  trovador: 'border-pink-400/50 bg-pink-950/30',
  encantador: 'border-fuchsia-400/50 bg-fuchsia-950/30',
  cruzado: 'border-amber-400/50 bg-amber-950/30',
  santo: 'border-yellow-300/50 bg-yellow-950/30',
  titan: 'border-stone-500/50 bg-stone-950/30',
  berserker_ancestral: 'border-red-500/50 bg-red-950/30',
  maestro_bestias: 'border-amber-500/50 bg-amber-950/30',
  cazador_sombras: 'border-indigo-400/50 bg-indigo-950/30',
  desintegrador: 'border-red-500/50 bg-red-950/30',
  bombardero: 'border-orange-500/50 bg-orange-950/30',
  monje_diamante: 'border-cyan-400/50 bg-cyan-950/30',
  avatar: 'border-blue-400/50 bg-blue-950/30',
  iluminado: 'border-yellow-300/50 bg-yellow-950/30',
  fantasma_errante: 'border-slate-400/50 bg-slate-950/30',
  hombre_lobo: 'border-gray-500/50 bg-gray-950/30',
  espiritu_bosque: 'border-green-400/50 bg-green-950/30',
  druida_ancestral: 'border-emerald-500/50 bg-emerald-950/30',
  latigo_mundo: 'border-lime-500/50 bg-lime-950/30',
  sumo_sacerdote: 'border-amber-400/50 bg-amber-950/30',
  sanador_divino: 'border-sky-400/50 bg-sky-950/30',
  juez_final: 'border-red-500/50 bg-red-950/30',
  purificador: 'border-orange-400/50 bg-orange-950/30',
  senor_elementos: 'border-blue-400/50 bg-blue-950/30',
  ciclon: 'border-teal-400/50 bg-teal-950/30',
  chaman_supremo: 'border-purple-400/50 bg-purple-950/30',
  vidente: 'border-indigo-400/50 bg-indigo-950/30',
  paladin_legendario: 'border-yellow-400/50 bg-yellow-950/30',
  muro_hierro: 'border-zinc-400/50 bg-zinc-950/30',
  mercenario_real: 'border-amber-500/50 bg-amber-950/30',
  capitan_guerra: 'border-red-400/50 bg-red-950/30',
};
