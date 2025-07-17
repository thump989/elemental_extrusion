import {
  world,
  EquipmentSlot,
  GameMode,
  Player,
  ItemStack,
  system,
} from "@minecraft/server";

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:is_hoe", {
    onUseOn(event) {
      const block = event.block;
      const source = event.source;
      function DodurabilityDamage() {
        if (!(source instanceof Player)) return;
        const equippable = source.getComponent("minecraft:equippable");
        if (!equippable) return;
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem()) return;
        if (source.getGameMode() === GameMode.creative) return;
        const itemStack = mainhand.getItem();
        const durability = itemStack.getComponent("minecraft:durability");
        if (!durability) return;
        const enchantable = itemStack.getComponent("minecraft:enchantable");
        const unbreakingLevel =
          enchantable?.getEnchantment("unbreaking")?.level;
        const damageChance = durability.getDamageChance(unbreakingLevel) / 100;
        if (Math.random() > damageChance) return;
        const shouldBreak = durability.damage === durability.maxDurability;
        if (shouldBreak) {
          mainhand.setItem(undefined); // Remove the item
          source.playSound("random.break"); // Play break sound
        } else {
          durability.damage++; // Increase durability damage
          mainhand.setItem(itemStack); // Update item in main hand
        }
      }
      if (
        block.permutation.matches("minecraft:dirt") ||
        block.permutation.matches("minecraft:grass_block")
      ) {
        if (!block.above().permutation.matches("minecraft:air")) return;
        DodurabilityDamage();
        block.setType("minecraft:farmland");
        source.dimension.playSound("use.gravel", block.location, {
          pitch: 1,
          volume: 1,
        });
      } else if (block.permutation.matches("minecraft:coarse_dirt")) {
        if (!block.above().permutation.matches("minecraft:air")) return;
        DodurabilityDamage();
        block.setType("minecraft:dirt");
        source.dimension.playSound("use.gravel", block.location, {
          pitch: 1,
          volume: 1,
        });
      } else if (block.permutation.matches("minecraft:dirt_with_roots")) {
        if (!block.above().permutation.matches("minecraft:air")) return;
        DodurabilityDamage();
        block.setType("minecraft:dirt");
        const item = new ItemStack("minecraft:hanging_roots", 1);
        event.source.dimension.spawnItem(item, block.location);
        source.dimension.playSound("use.gravel", block.location, {
          pitch: 1,
          volume: 1,
        });
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:is_shovel", {
    onUseOn(event) {
      const block = event.block;
      const source = event.source;
      function DodurabilityDamage() {
        if (!(source instanceof Player)) return;
        const equippable = source.getComponent("minecraft:equippable");
        if (!equippable) return;
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem()) return;
        if (source.getGameMode() === GameMode.creative) return;
        const itemStack = mainhand.getItem();
        const durability = itemStack.getComponent("minecraft:durability");
        if (!durability) return;
        const enchantable = itemStack.getComponent("minecraft:enchantable");
        const unbreakingLevel =
          enchantable?.getEnchantment("unbreaking")?.level;
        const damageChance = durability.getDamageChance(unbreakingLevel) / 100;
        if (Math.random() > damageChance) return;
        const shouldBreak = durability.damage === durability.maxDurability;
        if (shouldBreak) {
          mainhand.setItem(undefined); // Remove the item
          source.playSound("random.break"); // Play break sound
        } else {
          durability.damage++; // Increase durability damage
          mainhand.setItem(itemStack); // Update item in main hand
        }
      }
      if (
        block.permutation.matches("minecraft:dirt") ||
        block.permutation.matches("minecraft:grass_block") ||
        block.permutation.matches("minecraft:mycelium") ||
        block.permutation.matches("minecraft:podzol") ||
        block.permutation.matches("minecraft:coarse_dirt") ||
        block.permutation.matches("minecraft:dirt_with_roots")
      ) {
        if (!block.above().permutation.matches("minecraft:air")) return;
        DodurabilityDamage();
        block.setType("minecraft:grass_path");
        source.dimension.playSound("use.grass", block.location, {
          pitch: 1,
          volume: 1,
        });
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:is_axe", {
    onUseOn(event) {
      const block = event.block;
      const source = event.source;
      function DodurabilityDamage() {
        if (!(source instanceof Player)) return;
        const equippable = source.getComponent("minecraft:equippable");
        if (!equippable) return;
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem()) return;
        if (source.getGameMode() === GameMode.creative) return;
        const itemStack = mainhand.getItem();
        const durability = itemStack.getComponent("minecraft:durability");
        if (!durability) return;
        const enchantable = itemStack.getComponent("minecraft:enchantable");
        const unbreakingLevel =
          enchantable?.getEnchantment("unbreaking")?.level;
        const damageChance = durability.getDamageChance(unbreakingLevel) / 100;
        if (Math.random() > damageChance) return;
        const shouldBreak = durability.damage === durability.maxDurability;
        if (shouldBreak) {
          mainhand.setItem(undefined); // Remove the item
          source.playSound("random.break"); // Play break sound
        } else {
          durability.damage++; // Increase durability damage
          mainhand.setItem(itemStack); // Update item in main hand
        }
      }
      if (
        block.permutation.matches("minecraft:oak_log") ||
        block.permutation.matches("minecraft:birch_log") ||
        block.permutation.matches("minecraft:spruce_log") ||
        block.permutation.matches("minecraft:dark_oak_log") ||
        block.permutation.matches("minecraft:jungle_log") ||
        block.permutation.matches("minecraft:acacia_log") ||
        block.permutation.matches("minecraft:mangrove_log") ||
        block.permutation.matches("minecraft:oak_wood") ||
        block.permutation.matches("minecraft:birch_wood") ||
        block.permutation.matches("minecraft:spruce_wood") ||
        block.permutation.matches("minecraft:dark_oak_wood") ||
        block.permutation.matches("minecraft:jungle_wood") ||
        block.permutation.matches("minecraft:acacia_wood") ||
        block.permutation.matches("minecraft:mangrove_wood") ||
        block.permutation.matches("minecraft:pale_oak_log") ||
        block.permutation.matches("minecraft:pale_oak_wood")
      ) {
        event.block.setType(
          block.typeId.replace("minecraft:", "minecraft:stripped_")
        );
        DodurabilityDamage();
        event.source.playSound("use.wood", {
          pitch: 1,
          location: block.location,
          volume: 1,
        });
      } else if (
        block.permutation.matches("minecraft:cherry_log") ||
        block.permutation.matches("minecraft:cherry_wood")
      ) {
        event.block.setType(
          block.typeId.replace("minecraft:", "minecraft:stripped_")
        );
        DodurabilityDamage();
        event.source.playSound("step.cherry_wood", {
          pitch: 1,
          location: block.location,
          volume: 1,
        });
      } else if (
        block.permutation.matches("minecraft:crimson_stem") ||
        block.permutation.matches("minecraft:crimson_hyphae") ||
        block.permutation.matches("minecraft:warped_stem") ||
        block.permutation.matches("minecraft:warped_hyphae")
      ) {
        event.block.setType(
          block.typeId.replace("minecraft:", "minecraft:stripped_")
        );
        DodurabilityDamage();
        event.source.playSound("use.stem", {
          pitch: 1,
          location: block.location,
          volume: 1,
        });
      } else if (block.permutation.matches("minecraft:bamboo_block")) {
        event.block.setType(
          block.typeId.replace("minecraft:", "minecraft:stripped_")
        );
        event.source.playSound("step.bamboo", {
          pitch: 1,
          location: block.location,
          volume: 1,
        });
        DodurabilityDamage();
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:mine_block_damage", {
    onMineBlock({ source }) {
      // Get main hand slot
      if (!(source instanceof Player)) return;
      const equippable = source.getComponent("minecraft:equippable");
      if (!equippable) return;
      const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
      if (!mainhand.hasItem()) return;
      if (source.getGameMode() === GameMode.Creative) return;
      const itemStack = mainhand.getItem();
      const durability = itemStack.getComponent("minecraft:durability");
      if (!durability) return;
      const enchantable = itemStack.getComponent("minecraft:enchantable");
      const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;
      const damageChance = durability.getDamageChance(unbreakingLevel) / 100;
      if (Math.random() > damageChance) return;
      const shouldBreak = durability.damage === durability.maxDurability;
      if (shouldBreak) {
        mainhand.setItem(undefined); // Remove the item
        source.playSound("random.break"); // Play break sound
      } else {
        durability.damage++; // Increase durability damage
        mainhand.setItem(itemStack); // Update item in main hand
      }
    },
  });
});
