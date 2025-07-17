import {
  world,
  EquipmentSlot,
  ItemStack,
  GameMode,
  system,
} from "@minecraft/server";
function SetOnFire(entity, burn_time) {
  if (entity.getComponent("fire_immune")) return;
  if (entity.getEffect("minecraft:fire_resistance")) return;
  entity.setOnFire(burn_time, true);
}
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:shadowfire_lifespan",
    {
      onRandomTick(event) {
        let Value = event.block.permutation.getState(
          "thump989:shadowfire_lifespan"
        );
        if (Value == 0) event.block.setType("minecraft:air");
        else {
          event.block.setPermutation(
            event.block.permutation.withState(
              "thump989:shadowfire_lifespan",
              Value - 1
            )
          );
        }
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:shadowfire", {
    onTick(event) {
      const Victims = event.block.dimension.getEntities({
        maxDistance: 1,
        excludeFamilies: ["monster", "skeletonhorse", "inanimate"],
        excludeTypes: ["item"],
        location: event.block.location,
      });
      if (Victims == undefined) return;
      Victims.forEach((entity) => {
        entity.applyDamage(6, { cause: "magic" });
        const burn_time = 7;
        SetOnFire(entity, burn_time);
      });
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:summon_phantore_recharge",
    {
      onTick(event) {
        event.block.setPermutation(
          event.block.permutation.withState("thump989:phantore_grave_state", 4)
        );
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:summon_phantore", {
    onPlayerInteract(event) {
      const Nearby = event.block.dimension.getEntities({
        location: event.block.location,
        maxDistance: 35,
        families: ["phantore"],
      });
      if (Nearby.at(0) == undefined) {
        event.block.dimension.spawnEntity(
          "thump989:phantore_phase_1",
          event.block.above(1).bottomCenter()
        );
        event.block.setPermutation(
          event.block.permutation.withState("thump989:phantore_grave_state", 5)
        );
      } else {
        event.player.sendMessage("Defeat the existing Phantore!");
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:phantore_grave_key_last",
    {
      onPlayerInteract(event) {
        const equippable = event.player.getComponent("minecraft:equippable");
        if (!equippable) return;
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem() || mainhand.typeId !== "thump989:skull_key")
          return;
        let Value = event.block.permutation.getState(
          "thump989:phantore_grave_state"
        );
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:phantore_grave_state",
            Value + 1
          )
        );
        event.block.dimension.playSound(
          "block.end_portal.spawn",
          event.block.location,
          {
            volume: 2,
          }
        );
        if (event.player.getGameMode() == GameMode.Creative) return;
        if (mainhand.amount > 1) mainhand.amount--;
        else mainhand.setItem(undefined);
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:phantore_grave_key",
    {
      onPlayerInteract(event) {
        const equippable = event.player.getComponent("minecraft:equippable");
        if (!equippable) return;
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem() || mainhand.typeId !== "thump989:skull_key")
          return;
        let Value = event.block.permutation.getState(
          "thump989:phantore_grave_state"
        );
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:phantore_grave_state",
            Value + 1
          )
        );
        event.block.dimension.playSound(
          "vault.insert_item",
          event.block.location
        );
        if (event.player.getGameMode() == GameMode.Creative) return;
        if (mainhand.amount > 1) mainhand.amount--;
        else mainhand.setItem(undefined);
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:block_spawner", {
    onTick(event, component) {
      if (
        event.block.dimension.getEntities({
          location: event.block.location,
          maxDistance: component.params.spawn_cap_distance,
          type: component.params.entity,
        }).length > component.params.spawn_cap
      )
        return;
      else
        event.block.dimension.spawnEntity(
          component.params.entity,
          event.block.center()
        );
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:block_spawner_remove",
    {
      onTick(event, component) {
        if (
          event.block.dimension.getEntities({
            location: event.block.location,
            maxDistance: 35,
            gameMode: GameMode.Survival,
            families: ["player"],
          }).length > 0
        ) {
          event.block.dimension.spawnEntity(
            component.params.entity,
            event.block.bottomCenter()
          );
          event.block.setType("minecraft:air");
        } else return;
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:titan_beetle_egg", {
    onRandomTick({ block }) {
      const growthChance = 1 / 5;
      const growth = block.permutation.getState("thump989:growth");
      if (growth >= 5) {
        block.dimension.spawnEntity(
          "thump989:titan_beetle",
          block.bottomCenter(),
          {
            spawnEvent: "minecraft:entity_born",
          }
        );
        block.dimension.setBlockType(block.location, "minecraft:air");
        return;
      } else if (Math.random() > growthChance) return;
      block.setPermutation(
        block.permutation.withState("thump989:growth", growth + 1)
      );
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:caldpteron_egg_tick",
    {
      onTick(event) {
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:royal_caldpteron_egg_state",
            "ready"
          )
        );
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:caldpteron_egg_spawn",
    {
      onPlayerInteract(event) {
        const Nearby = event.block.dimension.getEntities({
          location: event.block.location,
          maxDistance: 35,
          type: "thump989:caldpteron",
        });
        if (Nearby.at(0) == undefined) {
          event.block.dimension.spawnEntity(
            "thump989:caldpteron",
            event.block.above(3).location
          );
          event.block.setPermutation(
            event.block.permutation.withState(
              "thump989:royal_caldpteron_egg_state",
              "used"
            )
          );
        } else {
          event.player.sendMessage("Defeat the existing Caldpteron!");
        }
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:radioactive", {
    onTick(event) {
      const Nearby = event.block.dimension.getEntities({
        location: event.block.location,
        maxDistance: 4,
        type: "player",
      });
      if (Nearby == undefined) return;
      else
        Nearby.forEach((entity) =>
          entity.addEffect("fatal_poison", 80, { amplifier: 1 })
        );
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:castle_vault_particle",
    {
      onTick(event) {
        event.block.dimension.spawnParticle(
          "thump989:castle_vault",
          event.block.center()
        );
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    //thump989:castle_vault
    "thump989:castle_vault_unlock_idle",
    {
      onTick(event) {
        let Value = event.block.permutation.getState(
          "thump989:castle_vault_state"
        );
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:castle_vault_state",
            Value + 1
          )
        );
        event.block.dimension.playSound(
          "vault.close_shutter",
          event.block.location
        );
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:castle_vault_key_unlock",
    {
      onPlayerInteract(event) {
        const equippable = event.player.getComponent("minecraft:equippable");
        if (!equippable) return;
        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem() || mainhand.typeId !== "thump989:castle_key")
          return;
        let Value = event.block.permutation.getState(
          "thump989:castle_vault_state"
        );
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:castle_vault_state",
            Value + 1
          )
        );
        event.block.dimension.playSound(
          "vault.open_shutter",
          event.block.location
        );
        event.block.dimension.spawnEntity(
          "thump989:castle_vault_dummy",
          event.block.above().bottomCenter()
        );
        if (event.player.getGameMode() == GameMode.Creative) return;
        if (mainhand.amount > 1) mainhand.amount--;
        else mainhand.setItem(undefined);
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:castle_vault_key", {
    onPlayerInteract(event) {
      const equippable = event.player.getComponent("minecraft:equippable");
      if (!equippable) return;
      const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
      if (!mainhand.hasItem() || mainhand.typeId !== "thump989:castle_key")
        return;
      let Value = event.block.permutation.getState(
        "thump989:castle_vault_state"
      );
      event.block.setPermutation(
        event.block.permutation.withState(
          "thump989:castle_vault_state",
          Value + 1
        )
      );
      event.block.dimension.playSound(
        "vault.insert_item",
        event.block.location
      );
      if (event.player.getGameMode() == GameMode.Creative) return;
      if (mainhand.amount > 1) mainhand.amount--;
      else mainhand.setItem(undefined);
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:spider_egg_cluster_destroy",
    {
      onPlayerDestroy(event) {
        for (let index = 0; index < Math.round(Math.random() * 5); index++) {
          event.block.dimension.spawnEntity(
            "thump989:spiderling",
            event.block.center()
          );
        }
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:vine_bonemeal", {
    onPlayerInteract({ block, dimension, player }) {
      VineBonemeal({ block, dimension, player });
    },
  });
});
function VineBonemeal({ block, dimension, player }) {
  if (!player) return;
  const equippable = player.getComponent("minecraft:equippable");
  if (!equippable) return;
  const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
  if (!mainhand.hasItem() || mainhand.typeId !== "minecraft:bone_meal") return;
  for (let index = 0; index < 11; ) {
    if (block.below(index).matches("thump989:glowworm_vine")) index++;
    else {
      if (block.below(index).matches("minecraft:air")) {
        dimension.setBlockType(
          block.below(index).location,
          "thump989:glowworm_vine"
        );
        const effectLocation = block.center();
        dimension.playSound("item.bone_meal.use", effectLocation);
        dimension.spawnParticle(
          "minecraft:crop_growth_emitter",
          effectLocation
        );
        dimension.spawnParticle(
          "minecraft:crop_growth_emitter",
          block.below(index).center()
        );
        index = 11;
        if (player.getGameMode() === GameMode.Creative) return;
        else if (mainhand.amount > 1) mainhand.amount--;
        else mainhand.setItem(undefined);
      } else index = 11;
    }
  }
}
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:golden_apple_sapling_bonemeal",
    {
      onPlayerInteract({ block, dimension, player }) {
        if (!player) return;

        const equippable = player.getComponent("minecraft:equippable");
        if (!equippable) return;

        const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhand.hasItem() || mainhand.typeId !== "minecraft:bone_meal")
          return;

        if (player.getGameMode() === GameMode.Creative) {
          // Grow crop fully
          block.setPermutation(
            block.permutation.withState("thump989:growth", 7)
          );
        } else return;

        // Play effects
        const effectLocation = block.center();
        dimension.playSound("item.bone_meal.use", effectLocation);
        dimension.spawnParticle(
          "minecraft:crop_growth_emitter",
          effectLocation
        );
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:golden_apple_sapling",
    {
      onRandomTick({ block }) {
        const growthChance = 1 / 20;
        if (Math.random() > growthChance) return;
        const growth = block.permutation.getState("thump989:growth");
        block.setPermutation(
          block.permutation.withState("thump989:growth", growth + 1)
        );
      },
    }
  );
});

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:stellar_reactor_burnout",
    {
      onPlayerInteract(event) {
        event.player.sendMessage("§cReactor Core is burnt out...");
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:stellar_reactor", {
    onPlayerInteract(event) {
      if (event.block.permutation.getState("thump99:core_active")) return;
      if (event.dimension.id != "minecraft:the_end") {
        event.player.sendMessage(
          "§cReactor Core is in the incorrect dimension!"
        );
        return;
      }
      const CoreLocation = event.block.location;
      if (CoreLocation.y < 20) {
        event.player.sendMessage(
          "§cThe stellar reactor needs to be built higher up!"
        );
        return;
      }
      if (CoreLocation.y > 220) {
        event.player.sendMessage(
          "§cThe stellar reactor needs to be built lower down!"
        );
        return;
      }
      if (
        event.block.below().matches("minecraft:purpur_block") &&
        event.block.above().matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: 1, y: -1, z: 1 })
          .matches("minecraft:diamond_block") &&
        event.block
          .offset({ x: -1, y: -1, z: 1 })
          .matches("minecraft:diamond_block") &&
        event.block
          .offset({ x: 1, y: -1, z: -1 })
          .matches("minecraft:diamond_block") &&
        event.block
          .offset({ x: -1, y: -1, z: -1 })
          .matches("minecraft:diamond_block") &&
        event.block
          .offset({ x: 0, y: -1, z: 1 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: 0, y: -1, z: -1 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: 1, y: -1, z: 0 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: -1, y: -1, z: 0 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: 1, y: 0, z: 1 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: 1, y: 0, z: -1 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: -1, y: 0, z: 1 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: -1, y: 0, z: -1 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: 0, y: 1, z: 1 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: 0, y: 1, z: -1 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: 1, y: 1, z: 0 })
          .matches("minecraft:purpur_block") &&
        event.block
          .offset({ x: -1, y: 1, z: 0 })
          .matches("minecraft:purpur_block")
      ) {
        const StringRaw = [
          (CoreLocation.x = CoreLocation.x - 12).toString(),
          (CoreLocation.y = CoreLocation.y - 2).toString(),
          (CoreLocation.z = CoreLocation.z - 12).toString(),
        ];
        const String2 = StringRaw.toString().replaceAll(",", " ");
        const String3 = "structure load mystructure:Stellar_Reactor_Struc ";
        const CommandString = String3.concat(String2);
        world.sendMessage("§bActive!");
        event.block
          .above(2)
          .dimension.spawnEntity(
            "thump989:astral_minister",
            event.block.above(2).center()
          )
          .triggerEvent("thump989:boss_spawn");
        event.block.setPermutation(
          event.block.permutation.withState("thump989:core_active", true)
        );
        event.dimension.runCommand(CommandString);
      } else event.player.sendMessage("§cNot the correct pattern!");
      return;
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:sieve", {
    onTick(event) {
      const BlockAbove = event.block.above();
      function SandLoot() {
        const { x, y, z } = event.block.bottomCenter();
        const location = { x, y: y + 1, z };
        const String1 = "loot spawn ";
        const String2Raw = [
          location.x.toString(),
          location.y.toString(),
          location.z.toString(),
        ];
        const String2 = String2Raw.toString().replaceAll(",", " ");
        const String3 = ' loot "blocks/sieve_sand"';
        const CommandString = String1.concat(String2, String3);
        event.block.dimension.runCommand(CommandString);
        event.block.dimension.setBlockType(
          BlockAbove.location,
          "minecraft:air"
        );
        event.block.dimension.playSound(
          "brush_completed.suspicious_sand",
          event.block.location
        );
      }
      function GravelLoot() {
        const { x, y, z } = event.block.bottomCenter();
        const location = { x, y: y + 1, z };
        const String1 = "loot spawn ";
        const String2Raw = [
          location.x.toString(),
          location.y.toString(),
          location.z.toString(),
        ];
        const String2 = String2Raw.toString().replaceAll(",", " ");
        const String3 = ' loot "blocks/sieve_gravel"';
        const CommandString = String1.concat(String2, String3);
        event.block.dimension.runCommand(CommandString);
        event.block.dimension.setBlockType(
          BlockAbove.location,
          "minecraft:air"
        );
        event.block.dimension.playSound(
          "brush_completed.suspicious_gravel",
          event.block.location
        );
      }
      if (event.block.above().typeId == "minecraft:sand") SandLoot();
      if (event.block.above().typeId == "minecraft:gravel") GravelLoot();
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(
    "thump989:fish_trap_interact",
    {
      onPlayerInteract(event) {
        if (event.block.isWaterlogged == false) return;
        event.block.setPermutation(
          event.block.permutation.withState("thump989:has_fish", false)
        );
        const location = event.block.above().bottomCenter();
        const String1 = "loot spawn ";
        const String2Raw = [
          location.x.toString(),
          location.y.toString(),
          location.z.toString(),
        ];
        const String2 = String2Raw.toString().replaceAll(",", " ");
        const String3 = ' loot "gameplay/fishing"';
        const CommandString = String1.concat(String2, String3);
        for (let index = 0; index < 3; index++) {
          event.block.dimension.runCommand(CommandString);
        }
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:fish_trap_tick", {
    onTick(event) {
      if (event.block.isWaterlogged) {
        event.block.setPermutation(
          event.block.permutation.withState("thump989:has_fish", true)
        );
      } else return;
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:cheese_press", {
    onPlayerInteract(event) {
      Milk(event);
    },
  });
});
function Milk(event) {
  const Slot = event.player.getComponent("equippable");
  const mainhand = Slot.getEquipmentSlot(EquipmentSlot.Mainhand);
  if (
    mainhand.hasItem() == false ||
    mainhand.type.id != "minecraft:milk_bucket"
  )
    return;
  const Bucket = new ItemStack("minecraft:bucket", 1);
  const Cheese = new ItemStack("thump989:cheese", 1);
  mainhand.setItem(Bucket);
  const { x, y, z } = event.block.bottomCenter();
  const SpawnLocation = { x, y: y + 1, z };
  event.block.dimension.spawnItem(Cheese, SpawnLocation);
}
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:dark_totem", {
    onPlayerInteract(event) {
      event.player.runCommand("effect @s health_boost infinite 4 true");
      const { x, y, z } = event.block.bottomCenter();
      const BlockPos = { x, y: y + 1, z };
      event.block.dimension.playSound("random.totem", BlockPos);
      event.block.dimension.spawnParticle("minecraft:totem_particle", BlockPos);
    },
  });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("thump989:cosmic_drill", {
    onTick(event) {
      const BlockBelow = event.block.below();
      if (
        BlockBelow.typeId == "minecraft:iron_ore" ||
        BlockBelow.typeId == "minecraft:deepslate_iron_ore"
      ) {
        const item = new ItemStack("minecraft:raw_iron", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState("thump989:drill_ore_type", "iron")
        );
      } else if (
        BlockBelow.typeId == "minecraft:coal_ore" ||
        BlockBelow.typeId == "minecraft:deepslate_coal_ore"
      ) {
        const item = new ItemStack("minecraft:coal", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState("thump989:drill_ore_type", "coal")
        );
      } else if (
        BlockBelow.typeId == "minecraft:emerald_ore" ||
        BlockBelow.typeId == "minecraft:deepslate_emerald_ore"
      ) {
        const item = new ItemStack("minecraft:emerald", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:drill_ore_type",
            "emerald"
          )
        );
      } else if (
        BlockBelow.typeId == "minecraft:lapis_ore" ||
        BlockBelow.typeId == "minecraft:deepslate_lapis_ore"
      ) {
        const item = new ItemStack("minecraft:lapis_lazuli", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:drill_ore_type",
            "lapis_lazuli"
          )
        );
      } else if (
        BlockBelow.typeId == "minecraft:gold_ore" ||
        BlockBelow.typeId == "minecraft:nether_gold_ore" ||
        BlockBelow.typeId == "minecraft:deepslate_gold_ore"
      ) {
        const item = new ItemStack("minecraft:raw_gold", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState("thump989:drill_ore_type", "gold")
        );
      } else if (
        BlockBelow.typeId == "minecraft:redstone_ore" ||
        BlockBelow.typeId == "minecraft:lit_redstone_ore" ||
        BlockBelow.typeId == "minecraft:deepslate_redstone_ore" ||
        BlockBelow.typeId == "minecraft:lit_deepslate_redstone_ore"
      ) {
        const item = new ItemStack("minecraft:redstone", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:drill_ore_type",
            "redstone"
          )
        );
      } else if (
        BlockBelow.typeId == "minecraft:copper_ore" ||
        BlockBelow.typeId == "minecraft:deepslate_copper_ore"
      ) {
        const item = new ItemStack("minecraft:raw_copper", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState("thump989:drill_ore_type", "copper")
        );
      } else if (
        BlockBelow.typeId == "minecraft:diamond_ore" ||
        BlockBelow.typeId == "minecraft:deepslate_diamond_ore"
      ) {
        const item = new ItemStack("minecraft:diamond", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:drill_ore_type",
            "diamond"
          )
        );
      } else if (BlockBelow.typeId == "minecraft:quartz_ore") {
        const item = new ItemStack("minecraft:quartz", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState("thump989:drill_ore_type", "quartz")
        );
      } else if (BlockBelow.typeId == "minecraft:ancient_debris") {
        const item = new ItemStack("minecraft:netherite_scrap", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState("thump989:drill_ore_type", "debris")
        );
      } else if (BlockBelow.typeId == "thump989:malumite_ore") {
        const item = new ItemStack("thump989:raw_malumite", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState(
            "thump989:drill_ore_type",
            "malumite"
          )
        );
      } else if (BlockBelow.typeId == "thump989:cobalt_ore") {
        const item = new ItemStack("thump989:raw_cobalt", 1);
        const { x, y, z } = event.block.bottomCenter();
        const SourceLocation = { x: x, y: y + 1, z: z };
        event.block.dimension.spawnItem(item, SourceLocation);
        event.block.setPermutation(
          event.block.permutation.withState("thump989:drill_ore_type", "cobalt")
        );
      }
    },
  });
});
