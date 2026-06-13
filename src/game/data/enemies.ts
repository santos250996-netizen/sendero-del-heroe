import { type EnemyDef } from '../types';

export const ALL_ENEMIES: EnemyDef[] = [
  // EASY (encounter 1-2)
  {
    id: 'rata_gigante',
    name: 'Rata Gigante',
    maxHp: 18,
    damage: 4,
    block: 0,
    tier: 'easy',
    minEncounter: 1,
    description: 'Una rata del tamaño de un perro. Hambrienta.',
  },
  {
    id: 'bandido',
    name: 'Bandido del Camino',
    maxHp: 22,
    damage: 5,
    block: 2,
    tier: 'easy',
    minEncounter: 1,
    description: 'Un ladrón que ataza a los viajeros solitarios.',
  },
  {
    id: 'slime_toxico',
    name: 'Slime Tóxico',
    maxHp: 25,
    damage: 3,
    block: 3,
    tier: 'easy',
    minEncounter: 1,
    description: 'Una masa viscosa que quema al contacto.',
  },

  // MEDIUM (encounter 2-4)
  {
    id: 'lobo_feroz',
    name: 'Lobo Feroz',
    maxHp: 32,
    damage: 7,
    block: 2,
    tier: 'medium',
    minEncounter: 2,
    description: 'Alpha de una manada. No retrocede nunca.',
  },
  {
    id: 'esqueleto',
    name: 'Esqueleto Guerrero',
    maxHp: 35,
    damage: 8,
    block: 4,
    tier: 'medium',
    minEncounter: 2,
    description: 'Huesos animados por magia oscura.',
  },
  {
    id: 'bandera_cueva',
    name: 'Ogro de la Cueva',
    maxHp: 40,
    damage: 6,
    block: 5,
    tier: 'medium',
    minEncounter: 3,
    description: 'Bruto enorme que mora en la oscuridad.',
  },

  // HARD (encounter 4-6)
  {
    id: 'nigromante',
    name: 'Nigromante',
    maxHp: 45,
    damage: 9,
    block: 3,
    tier: 'hard',
    minEncounter: 4,
    description: 'Comanda a los muertos con poder oscuro.',
  },
  {
    id: 'caballero_negro',
    name: 'Caballero Negro',
    maxHp: 55,
    damage: 10,
    block: 6,
    tier: 'hard',
    minEncounter: 4,
    description: 'Una armadura vacía con voluntad de matar.',
  },

  // BOSS (encounter 7+)
  {
    id: 'dragon',
    name: 'Dragón Carmesí',
    maxHp: 80,
    damage: 14,
    block: 5,
    tier: 'boss',
    minEncounter: 6,
    description: 'El terror de los cielos. Su aliento arrasa reinos.',
  },
  {
    id: 'señor_oscuro',
    name: 'Señor Oscuro',
    maxHp: 100,
    damage: 12,
    block: 8,
    tier: 'boss',
    minEncounter: 7,
    description: 'La fuente del mal. El desafío final.',
  },
];

export function getEnemyForEncounter(encounter: number, previousId?: string): EnemyDef {
  const eligible = ALL_ENEMIES.filter(
    e => e.minEncounter <= encounter && (!previousId || e.id !== previousId)
  );

  // Weight toward appropriate difficulty
  let pool: EnemyDef[];
  if (encounter <= 2) {
    pool = eligible.filter(e => e.tier === 'easy');
    if (pool.length === 0) pool = eligible;
  } else if (encounter <= 4) {
    pool = eligible.filter(e => e.tier === 'easy' || e.tier === 'medium');
    if (pool.length === 0) pool = eligible;
  } else if (encounter <= 6) {
    pool = eligible.filter(e => e.tier === 'medium' || e.tier === 'hard');
    if (pool.length === 0) pool = eligible;
  } else {
    pool = eligible.filter(e => e.tier === 'hard' || e.tier === 'boss');
    if (pool.length === 0) pool = eligible;
  }

  // Boss every 3 encounters starting from 6
  if (encounter >= 6 && encounter % 3 === 0) {
    const bosses = eligible.filter(e => e.tier === 'boss');
    if (bosses.length > 0) {
      return bosses[Math.floor(Math.random() * bosses.length)];
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function getEnemyDef(id: string): EnemyDef {
  const enemy = ALL_ENEMIES.find(e => e.id === id);
  if (!enemy) throw new Error(`Enemy not found: ${id}`);
  return enemy;
}
