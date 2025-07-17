import { system, world, ItemStack, GameMode } from "@minecraft/server";

// Omitted item durability script. Make sure you've also imported "system" when using this script

// Defines hoes
const hoeIds = [""];

// Defines shovels
const shovelIds = [""];

// Defines axes
const axeIds = [""];

world.beforeEvents.itemUseOn.subscribe((evd) => {
  const { source: player, block, itemStack: itemUsed } = evd;

  // This returns if itemUsed is undefined.
  if (!itemUsed) return;

  if (
    hoeIds.includes(itemUsed.typeId) ||
    shovelIds.includes(itemUsed.typeId) ||
    axeIds.includes(itemUsed.typeId)
  ) {
    // This retrieves the player's equippable component.
    const playerEquippableComp = player.getComponent("equippable");

    // This returns if playerEquippableComp is undefined.
    if (!playerEquippableComp) return;

    // Hoes
    if (hoeIds.includes(itemUsed.typeId)) {
      const blockAbove = block.dimension.getBlock(block.location).above(1);
      if (!blockAbove.isAir) return;
      if (
        block.permutation.matches("minecraft:dirt") ||
        block.permutation.matches("minecraft:grass_block") ||
        block.permutation.matches("minecraft:dirt_with_roots") ||
        block.permutation.matches("minecraft:grass_path")
      ) {
        system.run(function () {
          block.setType("minecraft:farmland");
        });
        system.run(function () {
          player.playSound("use.gravel", {
            pitch: 1,
            location: block.location,
            volume: 1,
          });
        });
      } else return;
    }

    // Shovels
    if (shovelIds.includes(itemUsed.typeId)) {
      const blockAbove = block.dimension.getBlock(block.location).above(1);
      if (!blockAbove.isAir) return;
      if (
        block.permutation.matches("minecraft:dirt") ||
        block.permutation.matches("minecraft:grass_block") ||
        block.permutation.matches("minecraft:dirt_with_roots") ||
        block.permutation.matches("minecraft:mycelium") ||
        block.permutation.matches("minecraft:podzol")
      ) {
        system.run(function () {
          block.setType("minecraft:grass_path");
        });
        system.run(function () {
          player.playSound("use.grass", {
            pitch: 1,
            location: block.location,
            volume: 0.5,
          });
        });
      } else return;
    }

    // Axes
    if (axeIds.includes(itemUsed.typeId)) {
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
        block.permutation.matches("minecraft:mangrove_wood")
      )
        system.run(function () {
          block.setType(
            block.typeId.replace("minecraft:", "minecraft:stripped_")
          );
          player.playSound("use.wood", {
            pitch: 1,
            location: block.location,
            volume: 1,
          });
        });
      else if (
        block.permutation.matches("minecraft:cherry_log") ||
        block.permutation.matches("minecraft:cherry_wood")
      )
        system.run(function () {
          player.playSound("step.cherry_wood", {
            pitch: 1,
            location: block.location,
            volume: 1,
          });
        });
      else if (block.permutation.matches("minecraft:bamboo_block"))
        system.run(function () {
          player.playSound("step.bamboo_wood", {
            pitch: 1,
            location: block.location,
            volume: 1,
          });
        });
      else if (
        block.permutation.matches("minecraft:crimson_stem") ||
        block.permutation.matches("minecraft:warped_stem") ||
        block.permutation.matches("minecraft:crimson_hyphae") ||
        block.permutation.matches("minecraft:warped_hyphae")
      )
        system.run(function () {
          player.playSound("use.stem", {
            pitch: 1,
            location: block.location,
            volume: 1,
          });
        });
      else return;
    }

    // This returns if the player is in Creative mode
    if (player.matches({ gameMode: GameMode.creative })) return;

    // This retrieves the enchantable component of the item.
    const itemEnchantmentComp = itemUsed.getComponent("minecraft:enchantable");
    const unbreakingLevel =
      itemEnchantmentComp?.getEnchantment("unbreaking")?.level ?? 0;

    // Calculates the chance of an item breaking based on its unbreaking level. This is the vanilla unbreaking formula.
    const breakChance = 100 / (unbreakingLevel + 1);
    // Generates a random chance value between 0 and 100.
    const randomizeChance = Math.random() * 100;

    // This returns if breakChance is less than randomizeChance.
    if (breakChance < randomizeChance) return;

    // This retrieves the durability component of the item.
    const itemUsedDurabilityComp = itemUsed.getComponent("durability");

    // This returns if itemUsedDurabilityComp is undefined.
    if (!itemUsedDurabilityComp) return;

    // This will set the new durability value.
    system.run(function () {
      itemUsedDurabilityComp.damage += 1;

      // Declares and checks if the item is out of durability
      const maxDurability = itemUsedDurabilityComp.maxDurability;
      const currentDamage = itemUsedDurabilityComp.damage;
      if (currentDamage >= maxDurability) {
        // If the item is out of durability, plays the item breaking sound and removes the item
        system.run(() => {
          player.playSound("random.break", {
            pitch: 1,
            location: player.location,
            volume: 1,
          });
          playerEquippableComp.setEquipment(
            "Mainhand",
            new ItemStack("minecraft:air", 1)
          );
        });
      } else if (currentDamage < maxDurability) {
        // This sets the item in the player's selected slot.
        system.run(() => {
          playerEquippableComp.setEquipment("Mainhand", itemUsed);
        });
      }
    });
  }
});
