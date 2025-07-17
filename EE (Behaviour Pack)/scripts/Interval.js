import { System, world, system, EquipmentSlot } from "@minecraft/server";
system.runInterval(() => {
  const Players = world.getAllPlayers();
  Players.forEach((player) => {
    if (player.isOnGround) player.setDynamicProperty("thump989:jumpcount", 1);
  });
}, 1);
system.runInterval(() => {
  const Players = world.getAllPlayers();
  Players.forEach((player) => {
    PlayerOffhandEffect(player);
    PlayerMalumiteEffect(player);
    PlayerCobaltEffect(player);
  });
}, 40); //Accessory Effects
function PlayerOffhandEffect(player) {
  const equippable = player.getComponent("minecraft:equippable");
  const Offhand = equippable.getEquipment(EquipmentSlot.Offhand);
  const Head = equippable.getEquipment(EquipmentSlot.Head);
  if (Offhand == undefined) return;
  else if (Offhand.typeId == "thump989:endless_waffle") {
    player.addEffect("minecraft:regeneration", 300, { showParticles: false });
    player.addEffect("minecraft:saturation", 300, {
      amplifier: 10,
      showParticles: false,
    });
  } else if (Offhand.typeId == "thump989:runners_baton") {
    player.addEffect("minecraft:speed", 300, { showParticles: false });
    player.addEffect("minecraft:jump_boost", 300, { showParticles: false });
  } else if (Offhand.typeId == "thump989:spirit_of_the_turtle") {
    player.addEffect("minecraft:slowness", 300, {
      amplifier: 1,
      showParticles: false,
    });
    player.addEffect("minecraft:resistance", 300, { showParticles: false });
  } else if (Head == undefined) return;
  else if (
    Offhand.typeId == "thump989:faux_moth_wings" &&
    Head.typeId == "thump989:frosthelm"
  ) {
    player.addEffect("minecraft:slow_falling", 300, {
      showParticles: false,
    });
  } else return;
}
function PlayerMalumiteEffect(player) {
  const equippable = player.getComponent("minecraft:equippable");
  const Head = equippable.getEquipment(EquipmentSlot.Head);
  const Chest = equippable.getEquipment(EquipmentSlot.Chest);
  const Legs = equippable.getEquipment(EquipmentSlot.Legs);
  const Feet = equippable.getEquipment(EquipmentSlot.Feet);
  if (
    Head == undefined ||
    Chest == undefined ||
    Legs == undefined ||
    Feet == undefined
  )
    return;
  else if (
    Head.typeId != "thump989:malumite_helmet" ||
    Chest.typeId != "thump989:malumite_chestplate" ||
    Legs.typeId != "thump989:malumite_leggings" ||
    Feet.typeId != "thump989:malumite_boots"
  )
    return;
  else if (
    Head.typeId == "thump989:malumite_helmet" ||
    Chest.typeId == "thump989:malumite_chestplate" ||
    Legs.typeId == "thump989:malumite_leggings" ||
    Feet.typeId == "thump989:malumite_boots"
  ) {
    player.addEffect("minecraft:night_vision", 300, { showParticles: false });
  } else return;
}
function PlayerCobaltEffect(player) {
  const equippable = player.getComponent("minecraft:equippable");
  const Head = equippable.getEquipment(EquipmentSlot.Head);
  const Chest = equippable.getEquipment(EquipmentSlot.Chest);
  const Legs = equippable.getEquipment(EquipmentSlot.Legs);
  const Feet = equippable.getEquipment(EquipmentSlot.Feet);
  if (
    Head == undefined ||
    Chest == undefined ||
    Legs == undefined ||
    Feet == undefined
  )
    return;
  else if (
    Head.typeId != "thump989:cobalt_helmet" ||
    Chest.typeId != "thump989:cobalt_chestplate" ||
    Legs.typeId != "thump989:cobalt_leggings" ||
    Feet.typeId != "thump989:cobalt_boots"
  )
    return;
  else if (
    Head.typeId == "thump989:cobalt_helmet" ||
    Chest.typeId == "thump989:cobalt_chestplate" ||
    Legs.typeId == "thump989:cobalt_leggings" ||
    Feet.typeId == "thump989:cobalt_boots"
  ) {
    player.addEffect("minecraft:strength", 300, { showParticles: false });
    player.addEffect("minecraft:resistance", 300, { showParticles: false });
  } else return;
}
//
//Offhand Equipment Immunity
world.afterEvents.effectAdd.subscribe((event) => {
  const equippable = event.entity.getComponent("minecraft:equippable");
  if (equippable == undefined) return;
  const Offhand = equippable.getEquipment(EquipmentSlot.Offhand);
  if (Offhand == undefined) return;
  else if (Offhand.typeId == "thump989:honeycomb_ring") {
    event.entity.removeEffect("minecraft:slowness");
    event.entity.removeEffect("minecraft:weakness");
    event.entity.removeEffect("minecraft:poison");
    event.entity.removeEffect("minecraft:fatal_poison");
    event.entity.removeEffect("minecraft:wither");
  } else return;
});
//
//Malumite Armour Darkness and Blindness Immunity
world.afterEvents.effectAdd.subscribe((event) => {
  const equippable = event.entity.getComponent("minecraft:equippable");
  if (equippable == undefined) return;
  const Head = equippable.getEquipment(EquipmentSlot.Head);
  const Chest = equippable.getEquipment(EquipmentSlot.Chest);
  const Legs = equippable.getEquipment(EquipmentSlot.Legs);
  const Feet = equippable.getEquipment(EquipmentSlot.Feet);
  if (
    Head == undefined ||
    Chest == undefined ||
    Legs == undefined ||
    Feet == undefined
  )
    return;
  else if (
    Head.typeId != "thump989:malumite_helmet" ||
    Chest.typeId != "thump989:malumite_chestplate" ||
    Legs.typeId != "thump989:malumite_leggings" ||
    Feet.typeId != "thump989:malumite_boots"
  )
    return;
  else if (
    Head.typeId == "thump989:malumite_helmet" ||
    Chest.typeId == "thump989:malumite_chestplate" ||
    Legs.typeId == "thump989:malumite_leggings" ||
    Feet.typeId == "thump989:malumite_boots"
  ) {
    event.entity.removeEffect("minecraft:darkness");
    event.entity.removeEffect("minecraft:blindness");
  } else return;
});
