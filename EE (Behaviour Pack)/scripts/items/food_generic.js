import { system } from "@minecraft/server";

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:shadow_chime", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      event.source.runCommand("recipe give @s thump989:shadow_chime");
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:glazed_bread", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      event.source.runCommand("recipe give @s thump989:glazed_bread");
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:hydro_drop", {
    onConsume(event, component) {
      event.source.extinguishFire();
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:cheese_cure", {
    onConsume(event) {
      const Effects = event.source.getEffects();
      Effects.forEach((effect) => {
        if (
          effect.typeId == "minecraft:blindness" ||
          effect.typeId == "minecraft:darkness" ||
          effect.typeId == "minecraft:fatal_poison" ||
          effect.typeId == "minecraft:hunger" ||
          effect.typeId == "minecraft:infested" ||
          effect.typeId == "minecraft:mining_fatigue" ||
          effect.typeId == "minecraft:nausea" ||
          effect.typeId == "minecraft:oozing" ||
          effect.typeId == "minecraft:poison" ||
          effect.typeId == "minecraft:slowness" ||
          effect.typeId == "minecraft:weakness" ||
          effect.typeId == "minecraft:wither"
        )
          event.source.removeEffect(effect.typeId);
      });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:haste_strong", {
    onConsume(event) {
      event.source.addEffect("haste", 4800, { amplifier: 1 });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:haste_long", {
    onConsume(event) {
      event.source.addEffect("haste", 9600);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:earth_potion", {
    onConsume(event) {
      event.source.addEffect("haste", 9600, { amplifier: 1 });
      event.source.addEffect("speed", 9600, { amplifier: 1 });
      event.source.addEffect("night_vision", 9600);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:astral_potion", {
    onConsume(event) {
      event.source.addEffect("strength", 9600, { amplifier: 1 });
      event.source.addEffect("fire_resistance", 9600);
      event.source.addEffect("absorption", 9600, { amplifier: 4 });
      event.source.addEffect("haste", 9600, { amplifier: 1 });
      event.source.addEffect("speed", 9600, { amplifier: 1 });
      event.source.addEffect("night_vision", 9600);
      event.source.addEffect("jump_boost", 9600, { amplifier: 3 });
      event.source.addEffect("slow_falling", 9600, { amplifier: 1 });
      event.source.addEffect("invisibility", 9600);
      event.source.addEffect("conduit_power", 9600);
      event.source.addEffect("resistance", 9600);
      event.source.addEffect("regeneration", 9600, { amplifier: 1 });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:fire_potion", {
    onConsume(event) {
      event.source.addEffect("strength", 9600, { amplifier: 1 });
      event.source.addEffect("fire_resistance", 9600);
      event.source.addEffect("absorption", 9600, { amplifier: 4 });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:air_potion", {
    onConsume(event) {
      event.source.addEffect("jump_boost", 9600, { amplifier: 3 });
      event.source.addEffect("slow_falling", 9600, { amplifier: 1 });
      event.source.addEffect("invisibility", 9600);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:water_potion", {
    onConsume(event) {
      event.source.addEffect("conduit_power", 9600);
      event.source.addEffect("resistance", 9600);
      event.source.addEffect("regeneration", 9600, { amplifier: 1 });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:haste_1", {
    onConsume(event) {
      event.source.addEffect("haste", 4800);
    },
  });
});
