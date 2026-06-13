import { type EnemyDef } from '../types';

export const ALL_ENEMIES: EnemyDef[] = [
  { id: 'rata_gigante', name: 'Rata Gigante', maxHp: 18, damage: 4, block: 0, tier: 'easy', minEncounter: 1, description: 'Una rata del tamaño de un perro. Hambrienta.' },
  { id: 'bandido', name: 'Bandido del Camino', maxHp: 22, damage: 5, block: 2, tier: 'easy', minEncounter: 1, description: 'Un ladrón que acecha a los viajeros solitarios.', classWeakness: 'picaro' },
  { id: 'slime_toxico', name: 'Slime Tóxico', maxHp: 25, damage: 3, block: 3, tier: 'easy', minEncounter: 1, description: 'Una masa viscosa que quema al contacto.', classWeakness: 'mago' },
  { id: 'lobo_feroz', name: 'Lobo Feroz', maxHp: 32, damage: 7, block: 2, tier: 'medium', minEncounter: 2, description: 'Alpha de una manada. Nunca retrocede.' },
  { id: 'esqueleto', name: 'Esqueleto Guerrero', maxHp: 35, damage: 8, block: 4, tier: 'medium', minEncounter: 2, description: 'Huesos animados por magia oscura.', classWeakness: 'guerrero' },
  { id: 'ogro_cueva', name: 'Ogro de la Cueva', maxHp: 40, damage: 6, block: 5, tier: 'medium', minEncounter: 3, description: 'Bruto enorme que mora en la oscuridad.' },
  { id: 'nigromante', name: 'Nigromante', maxHp: 45, damage: 9, block: 3, tier: 'hard', minEncounter: 4, description: 'Comanda a los muertos con poder oscuro.', classWeakness: 'mago' },
  { id: 'caballero_negro', name: 'Caballero Negro', maxHp: 55, damage: 10, block: 6, tier: 'hard', minEncounter: 4, description: 'Una armadura vacía con voluntad de matar.', classWeakness: 'berserker' },
  { id: 'dragon', name: 'Dragón Carmesí', maxHp: 80, damage: 14, block: 5, tier: 'boss', minEncounter: 6, description: 'El terror de los cielos.', classWeakness: 'guerrero' },
  { id: 'senor_oscuro', name: 'Señor Oscuro', maxHp: 100, damage: 12, block: 8, tier: 'boss', minEncounter: 7, description: 'La fuente del mal. El desafío final.', classWeakness: 'picaro' },
];

export function getEnemyForEncounter(encounter: number, previousId?: string): EnemyDef {
  const eligible = ALL_ENEMIES.filter(e => e.minEncounter <= encounter && (!previousId || e.id !== previousId));

  let pool: EnemyDef[];
  if (encounter <= 2) {
    pool = eligible.filter(e => e.tier === 'easy') || eligible;
  } else if (encounter <= 4) {
    pool = eligible.filter(e => e.tier === 'easy' || e.tier === 'medium') || eligible;
  } else if (encounter <= 6) {
    pool = eligible.filter(e => e.tier === 'medium' || e.tier === 'hard') || eligible;
  } else {
    pool = eligible.filter(e => e.tier === 'hard' || e.tier === 'boss') || eligible;
  }

  if (encounter >= 6 && encounter % 3 === 0) {
    const bosses = eligible.filter(e => e.tier === 'boss');
    if (bosses.length > 0) return bosses[Math.floor(Math.random() * bosses.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function getEnemyDef(id: string): EnemyDef {
  const enemy = ALL_ENEMIES.find(e => e.id === id);
  if (!enemy) throw new Error(`Enemy not found: ${id}`);
  return enemy;
}
