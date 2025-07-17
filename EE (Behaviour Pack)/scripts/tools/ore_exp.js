import { system, EquipmentSlot } from "@minecraft/server";

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:ore_exp", {
    onPlayerDestroy({ block, dimension, player }) {
      // Check the tool in the player's hand
      const equippable = player?.getComponent("minecraft:equippable");
      if (!equippable) return; // Exit if the player or its equipment are undefined

      const itemStack = equippable.getEquipment(EquipmentSlot.Mainhand);

      // Specify enchantments
      const enchantable = itemStack.getComponent("minecraft:enchantable");
      const silkTouch = enchantable?.getEnchantment("silk_touch");
      if (silkTouch) return; // Exit if the iron pickaxe has the Silk Touch enchantment
      // Spawn the XP rbs
      const xpAmount = Math.random() * (3 - 1) + 1;
      for (let i = 0; i < xpAmount; i++) {
        dimension.spawnEntity("minecraft:xp_orb", block.center());
      }
    },
  });
});
