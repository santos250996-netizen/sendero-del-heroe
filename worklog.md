---
Task ID: 1
Agent: Main Agent
Task: Implement full roguelite map system with 10 layers, branching paths, events, rest, shop, card upgrade, and card removal

Work Log:
- Updated types.ts with MapNode, GameMap, NodeType, GameEvent, EventOption, ShopItem, RestChoice, CardUpgradeBonus, CardInstance.upgraded, PlayerState.gold
- Created data/map.ts with procedural map generation (10 layers, 2 nodes per layer, boss at layer 10), 9 events with narrative, shop generation, gold/treasure reward functions
- Updated data/cards.ts: Added upgrade bonuses to all 30 cards, added 3 curse cards (Decadencia, Culpa, Vacuidad), added 4 event reward cards, added getEffectiveCardDef() helper for upgrade stat calculation
- Rewrote engine.ts: Map-based game flow (createNewGame -> map phase), selectNode/enterNode flow, enterCombat/Rest/Shop/Event/Treasure handlers, gold rewards on victory, card removal and card upgrade systems, event option resolution with all effects (gold, HP, max HP, card rewards, curses, damage bonuses)
- Updated gameStore.ts with all new actions: selectNode, enterNode, chooseRest, removeCardFromDeck, upgradeCardInDeck, buyShopItem, leaveShop, chooseEventOption, finishEvent, continueFromResult
- Created MapDisplay.tsx: Vertical map with 10 labeled layers, color-coded nodes by type (combat=red, elite=purple, rest=green, shop=blue, event=amber, treasure=yellow, boss=rose), visited checkmarks, IR button, connection lines
- Created EventScreen.tsx: Full narrative display with option cards showing cost/benefit previews, gold/HP/card/curse indicators
- Created RestScreen.tsx: Three choices (Heal 30%, Remove Card, Upgrade Card) with card picker sub-modes
- Created ShopScreen.tsx: 3 class-specific cards for sale + remove card service + upgrade card service, balanced pricing (60-100g cards, 75g remove, 60g upgrade)
- Updated CardDisplay.tsx: Added DeckCardPicker component (grid view of unique deck cards with count badges, clickable for remove/upgrade), upgrade "+" indicator on hand cards, effective stats display for upgraded cards, curse card styling
- Updated PlayerHUD.tsx: Gold display, map progress bar (shown outside combat), conditional energy/XP bars (battle only)
- Updated GameScreen.tsx: All 10 phases (menu, map, battle, evolution_choice, reward, rest, shop, event, event_result, gameover, victory), map bottom bar with "Entrar al Nodo" button, event_result with DeckCardPicker integration for remove/upgrade actions
- Fixed bug: removeCardFromDeck and upgradeCardInDeck now preserve current phase context (event_result/shop) instead of always going to map

Stage Summary:
- Full roguelite map system implemented with 10 layers, 2 branching nodes per layer
- 9 unique events with narrative and meaningful choices
- Rest system: heal 30%, remove 1 card, upgrade 1 card
- Shop system: 3 class cards for sale, remove card service, upgrade card service
- Card upgrade system with per-card bonus stats
- 3 curse cards for negative event outcomes
- Gold economy: 30g start, 10-15g combat, 20-30g elite, 40-55g boss
- Build verified clean, browser tested successfully
