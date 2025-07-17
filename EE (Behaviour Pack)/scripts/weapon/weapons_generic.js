import {
  EquipmentSlot,
  GameMode,
  ItemStack,
  MolangVariableMap,
  system,
  Direction,
  EntityComponentTypes,
  world,
  Entity,
  Dimension,
} from "@minecraft/server";
function SetOnFire(entity, burn_time) {
  if (entity.getComponent("fire_immune")) return;
  if (entity.getEffect("minecraft:fire_resistance")) return;
  entity.setOnFire(burn_time, true);
}
function Durability(event) {
  const durability = event.itemStack.getComponent("minecraft:durability");
  if (durability == undefined) return;
  const enchantable = event.itemStack.getComponent("minecraft:enchantable");
  const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;
  const damageChance = durability.getDamageChance(unbreakingLevel) / 100;
  if (Math.random() > damageChance) return;
  const shouldBreak = durability.damage === durability.maxDurability;
  const equippable = event.source.getComponent("minecraft:equippable");
  const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
  if (event.source.getGameMode() === GameMode.Creative) return;
  if (shouldBreak) {
    mainhand.setItem(undefined);
    event.source.playSound("random.break");
  } else {
    durability.damage++;
    mainhand.setItem(event.itemStack);
  }
}
function ThunderShot(
  xMultiplier,
  ZMultiplier,
  ShootingEntity,
  projectile,
  { x, y, z }
) {
  const Shot = ShootingEntity.getViewDirection();
  const ShotProjectile = ShootingEntity.dimension.spawnEntity(projectile, {
    x: ShootingEntity.location.x,
    y: ShootingEntity.location.y + 0.1,
    z: ShootingEntity.location.z,
  });
  const component = ShotProjectile.getComponent("projectile");
  component.shoot({ x: 1 * xMultiplier, y: 0, z: 1 * ZMultiplier });
}
//
//cobalt sword
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:cobalt_sword", {
    onHitEntity(event) {
      event.hitEntity.addEffect("minecraft:slowness", 1000);
    },
  });
});
//
//entity Placer
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:entity_placer_1", {
    onUseOn(event, component) {
      EntityPlacer(event, component);
    },
  });
});
function EntityPlacer(event, component) {
  const SpawnLocation = event.block.above(1).bottomCenter();
  event.source.dimension.spawnEntity(
    component.params.entity_id,
    SpawnLocation,
    { spawnEvent: component.params.spawn_event }
  );
  const equippable = event.source.getComponent("minecraft:equippable");
  const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
  if (
    event.source.getGameMode() === GameMode.Creative ||
    component.params.remove_item == false
  )
    return;
  if (event.source.getGameMode() == GameMode.Creative) return;
  if (mainhand.amount > 1) mainhand.amount--;
  else mainhand.setItem(undefined);
}
//entity placer
//
//Locator Particle
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:locator_particle", {
    onUse(event, component) {
      event.source.dimension.spawnParticle(
        component.params.particle_id,
        event.source.location
      );
      event.source.dimension.playSound(
        "item.locator.use",
        event.source.location
      );
    },
  });
});
//Locator Particle
//
//Universal Locator Warn
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent(
    "thump989:universe_teleport_warning",
    {
      onUse(event, component) {
        UniversalLocatorWarning(event, component);
      },
    }
  );
});
function UniversalLocatorWarning(event, component) {
  const Cooldown = event.itemStack.getComponent("cooldown");
  Cooldown.startCooldown(event.source);
  const Location = event.source.getDynamicProperty(
    component.params.property_type
  );
  const Dimension = event.source.getDynamicProperty(
    component.params.dimension_property_type
  );
  if (Location == undefined)
    event.source.sendMessage(component.params.fail_message);
  else {
    const String = [
      Location.x.toString(),
      Location.y.toString(),
      Location.z.toString(),
    ];
    const String2 = String.toString().replaceAll(",", " ");
    const RawText = {
      rawtext: [
        {
          text: component.params.use_message,
        },
        {
          text: String2,
        },
        {
          text: DimensionToString(Dimension),
        },
      ],
    };
    event.source.sendMessage(RawText);
  }
}
//Universal Locator Warn
//
//Universal Locator
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent(
    "thump989:universe_teleport_locator",
    {
      onCompleteUse(event, component) {
        UniversalLocator(event, component);
      },
    }
  );
});
function UniversalLocator(event, component) {
  const TeleportTarget = event.source.getDynamicProperty(
    component.params.property_type
  );
  const DimensionTarget = event.source.getDynamicProperty(
    component.params.dimension_property_type
  );
  if (TeleportTarget == undefined)
    event.source.sendMessage(component.params.fail_message);
  else
    event.source.tryTeleport(TeleportTarget, {
      dimension: world.getDimension(DimensionTarget),
    });
}
//Universal Locator
//
//Universal Focus
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:universal_focus", {
    onUseOn(event, component) {
      UniversalFocus(event, component);
    },
  });
});
function UniversalFocus(event, component) {
  const Cooldown = event.itemStack.getComponent("cooldown");
  if (Cooldown.getCooldownTicksRemaining(event.source) > 0) return;
  Cooldown.startCooldown(event.source);
  const Dimension = event.source.dimension.id;
  const Location = event.block.above(1).bottomCenter();
  const String = [
    Location.x.toString(),
    Location.y.toString(),
    Location.z.toString(),
  ];
  const String2 = String.toString().replaceAll(",", " ");
  const LocatorSpawn = new ItemStack(component.params.locator_id, 16);
  event.block.dimension.spawnItem(LocatorSpawn, Location);
  event.source.setDynamicProperty(component.params.property_type, Location);
  event.source.setDynamicProperty(
    component.params.dimension_property_type,
    Dimension
  );
  const DimensionString = DimensionToString(Dimension);
  const RawText = {
    rawtext: [
      {
        text: component.params.use_message,
      },
      {
        text: String2,
      },
      {
        text: DimensionString,
      },
    ],
  };
  event.source.sendMessage(RawText);
}
//Universal Locator
//
//Universal Focus
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:homeworld_locator", {
    onCompleteUse(event, component) {
      HomeWorldWarp(event, component);
    },
  });
});
//Universal Focus
//
//Dimension ToString
function DimensionToString(Dimension) {
  if (Dimension == "minecraft:overworld") {
    return " §ein the Overworld";
  } else if (Dimension == "minecraft:nether") {
    return " §ein the Nether";
  } else if (Dimension == "minecraft:the_end") {
    return " §ein The End";
  }
}
//Dimension ToString
//
function HomeWorldWarp(event, component) {
  const SpawnPoint = event.source.getSpawnPoint();
  if (SpawnPoint == undefined) event.source.sendMessage("§cNo Spawn Point set");
  else {
    event.source.teleport(
      {
        x: SpawnPoint.x,
        y: SpawnPoint.y,
        z: SpawnPoint.z,
      },
      {
        dimension: SpawnPoint.dimension,
        keepVelocity: false,
      }
    );
  }
}
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:teleport_locator", {
    onCompleteUse(event, component) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      const Target = event.source.dimension.getEntities({
        closest: 1,
        location: event.source.location,
        type: component.params.target,
        families: [component.params.variant],
      });
      if (Target.at(0) == undefined) {
        event.source.sendMessage(component.params.fail_message);
        event.source.startItemCooldown("teleporter", 5);
      } else {
        const { x, y, z } = Target.at(0).location;
        event.source.tryTeleport({ x: x, y: y + 0.2, z: z });
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:entity_placer", {
    onUseOn(event, component) {
      if (
        event.blockFace == Direction.Up &&
        event.block.above().matches("minecraft:air") &&
        event.itemStack
          .getComponent("cooldown")
          .getCooldownTicksRemaining(event.source) <= 0
      ) {
        const OtherFocus = event.source.dimension.getEntities({
          type: component.params.entity_type,
          families: [component.params.variant],
        });
        if (OtherFocus.at(0) == undefined) {
          const Cooldown = event.itemStack.getComponent("cooldown");
          Cooldown.startCooldown(event.source);
          event.block.dimension.playSound("use.stone", event.block.location);
          event.block.dimension.spawnEntity(
            component.params.entity_type,
            event.block.above().bottomCenter(),
            {
              spawnEvent: component.params.spawn_event,
            }
          );
        } else {
          OtherFocus.forEach((entity) => entity.remove());
          const Cooldown = event.itemStack.getComponent("cooldown");
          Cooldown.startCooldown(event.source);
          event.block.dimension.playSound("use.stone", event.block.location);
          event.block.dimension.spawnEntity(
            component.params.entity_type,
            event.block.above().bottomCenter(),
            {
              spawnEvent: component.params.spawn_event,
            }
          );
        }
        const Dimension = event.source.dimension.id;
        if (Dimension == "minecraft:overworld") {
          const RawText = {
            rawtext: [
              { text: component.params.spawn_message },
              { text: "Overworld" },
            ],
          };
          world.sendMessage(RawText);
        } else if (Dimension == "minecraft:nether") {
          const RawText = {
            rawtext: [
              { text: component.params.spawn_message },
              { text: "Nether" },
            ],
          };
          world.sendMessage(RawText);
        } else {
          const RawText = {
            rawtext: [
              { text: component.params.spawn_message },
              { text: "The End" },
            ],
          };
          world.sendMessage(RawText);
        }
      } else return;
    },
  });
});
function moveToLocation(entity, targetPos, speed) {
  const pos = entity.location;
  const dx = targetPos.x - pos.x,
    dy = targetPos.y - pos.y,
    dz = targetPos.z - pos.z;
  const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (!mag) return null;
  const x = (dx / mag) * speed,
    y = (dy / mag) * speed,
    z = (dz / mag) * speed;
  if (entity.typeId === "minecraft:player") {
    const hMag = Math.sqrt(x * x + z * z);
    return { x: x / hMag, z: z / hMag, strength: hMag, y };
  }
  return { x, y, z };
}
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:grappledummy_end" && message != "death") return;
  const Leash = event.sourceEntity.getComponent("leashable");
  const Ride = event.sourceEntity.getComponent("rideable");
  event.sourceEntity.remove();
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:grappledummy" && message != "reel") return;
  const Leash = event.sourceEntity.getComponent("leashable");
  const Ride = event.sourceEntity.getComponent("rideable");
  const targetPos = Leash.leashHolder.location;
  const entity = Ride.getRiders().at(0);
  const values = moveToLocation(entity, targetPos, 1);
  event.sourceEntity.applyKnockback(
    { x: values.x * values.strength, z: values.z * values.strength },
    values.y
  );
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:grappling_hook", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      const durability = event.itemStack.getComponent("minecraft:durability");
      const equippable = event.source.getComponent("minecraft:equippable");
      const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
      const HeadLocation = event.source.getHeadLocation();
      const { x, y, z } = event.source.getViewDirection();
      const velocity = { x: x * 1.55, y: y * 1.55, z: z * 1.55 };
      const projectile_entity = event.source.dimension.spawnEntity(
        "thump989:grappling_hook_hook",
        HeadLocation
      );
      const Projectile = projectile_entity.getComponent("projectile");
      Projectile.shoot(velocity);
      const dummy_entity = event.source.dimension.spawnEntity(
        "thump989:grappling_hook_dummy",
        HeadLocation
      );
      const Leash = dummy_entity.getComponent("leashable");
      Leash.leashTo(projectile_entity);
      event.source.dimension.playSound(
        "item.grappling_hook.shoot",
        event.source.location
      );
    },
  });
});
//Moth Wings
world.afterEvents.playerButtonInput.subscribe((event) => {
  const player = event.player;
  const Jump = event.newButtonState;
  const equippable = event.player.getComponent("minecraft:equippable");
  if (Jump == "Pressed") {
    const FallSpeed = player.getVelocity();
    const JumpCount = event.player.getDynamicProperty("thump989:jumpcount");
    const Offhand = equippable.getEquipment(EquipmentSlot.Offhand);
    if (
      JumpCount == 0 ||
      Offhand == undefined ||
      Offhand.typeId != "thump989:faux_moth_wings"
    )
      return;
    else if (
      JumpCount == 1 &&
      Offhand.typeId == "thump989:faux_moth_wings" &&
      FallSpeed.y < 0.25
    ) {
      event.player.setDynamicProperty("thump989:jumpcount", 0);
      player.applyKnockback({ x: 0, z: 0 }, 2);
    }
  } else return;
});
//Moth Wings
world.afterEvents.entityHurt.subscribe((event) => {
  if (
    event.damageSource == undefined ||
    event.hurtEntity == undefined ||
    event.damageSource.damagingEntity == undefined ||
    event.damageSource.damagingEntity.isValid == false ||
    event.damageSource.damagingEntity.getComponent("equippable") == undefined
  )
    return;
  const equippable =
    event.damageSource.damagingEntity.getComponent("equippable");
  const Offhand = equippable.getEquipment(EquipmentSlot.Offhand);
  if (Offhand == undefined || Offhand.typeId != "thump989:ominous_talisman")
    return;
  else {
    event.hurtEntity.addEffect("minecraft:trial_omen", 900);
  }
});
world.afterEvents.projectileHitEntity.subscribe((event) => {
  //explosive projectiles hit block
  ExplosiveProjectile(event);
});
world.afterEvents.projectileHitBlock.subscribe((event) => {
  //explosive projectiles hit block
  ExplosiveProjectile(event);
});
function ExplosiveProjectile(event) {
  if (
    event.projectile.isValid == false ||
    event.projectile.getComponent("type_family") == undefined ||
    event.projectile
      .getComponent("type_family")
      .hasTypeFamily("explosive_projectile") == false
  )
    return;
  const molang = new MolangVariableMap();
  if (event.projectile.getDynamicProperty("shot_power") == undefined)
    event.projectile.setDynamicProperty("shot_power", 0);
  const BlastSize = event.projectile.getProperty("thump989:blast_radius") + 1;
  const BlastDamage =
    event.projectile.getProperty("thump989:blast_damage") +
    event.projectile.getDynamicProperty("shot_power");
  molang.setFloat("variable.particle_amount", Math.pow(BlastSize, 3) + 1);
  molang.setFloat("variable.blast_size", BlastSize);
  const BlastVictims = event.projectile.dimension.getEntities({
    maxDistance: BlastSize,
    location: event.location,
    excludeFamilies: ["inanimate", "player"],
    excludeTypes: ["item"],
  });
  if (
    event.projectile
      .getComponent("type_family")
      .hasTypeFamily("fire_projectile")
  ) {
    event.projectile.dimension.spawnParticle(
      "thump989:explosion_scaleable",
      event.location,
      molang
    );
    event.projectile.dimension.spawnParticle(
      "thump989:fire_explosion_scaleable",
      event.location,
      molang
    );
    event.projectile.dimension.playSound("random.explode", event.location);
    BlastVictims.forEach((entity) => {
      const burn_time = event.projectile.getProperty("thump989:burn_time");
      SetOnFire(entity, burn_time);
      entity.applyDamage(BlastDamage, {
        cause: "entityExplosion",
        damagingEntity: event.projectile.getComponent("tameable").tamedToPlayer,
      });
    });
    event.projectile.remove();
  } else {
    event.projectile.dimension.spawnParticle(
      "thump989:explosion_scaleable",
      event.location,
      molang
    );
    event.projectile.dimension.playSound("random.explode", event.location);
    BlastVictims.forEach((entity) =>
      entity.applyDamage(BlastDamage, {
        cause: "entityExplosion",
        damagingEntity: event.projectile.getComponent("tameable").tamedToPlayer,
      })
    );
    event.projectile.remove();
  }
}
//
function ProjectileShoot(event, component) {
  const Cooldown = event.itemStack.getComponent("cooldown");
  if (Cooldown == undefined) {
  } else Cooldown.startCooldown(event.source);
  const Enchantable = event.itemStack.getComponent("minecraft:enchantable");
  const HeadLocation = event.source.getHeadLocation();
  const S = component.params.projectile_speed;
  const { x, y, z } = event.source.getViewDirection();
  const Velocity = { x: x * S, y: y * S, z: z * S };
  for (let index = 0; index < component.params.projectile_count; index++) {
    const projectile_entity = event.source.dimension.spawnEntity(
      component.params.projectile_entity,
      HeadLocation
    );
    projectile_entity.setDynamicProperty(
      "shot_power",
      Enchantable?.getEnchantment("minecraft:power")?.level
    );
    const Projectile = projectile_entity.getComponent("projectile");
    const Ownership = projectile_entity.getComponent("tameable");
    Ownership.tame(event.source);
    Projectile.shoot(Velocity, {
      uncertainty: component.params.uncertainty,
    });
  }
  event.source.playSound(component.params.shoot_sound, {
    location: HeadLocation,
    pitch: component.params.sound_pitch,
    volume: component.params.sound_volume,
  });
  if (
    event.itemStack.getComponent("durability") != undefined &&
    Enchantable?.hasEnchantment("minecraft:infinity") == false
  )
    Durability(event);
}
//
world.afterEvents.projectileHitEntity.subscribe((event) => {
  //magic projectiles
  if (
    event.projectile.isValid == false ||
    event.projectile.getComponent("type_family") == undefined ||
    event.projectile
      .getComponent("type_family")
      .hasTypeFamily("magic_projectile") == false
  )
    return;
  if (event.projectile.getDynamicProperty("shot_power") == undefined)
    event.projectile.setDynamicProperty("shot_power", 0);
  const DamageValue =
    event.projectile.getComponent("variant").value +
    event.projectile.getDynamicProperty("shot_power");
  const Target = event.getEntityHit();
  Target.entity.applyDamage(DamageValue, {
    cause: "magic",
    damagingEntity: event.source,
  });
  if (
    event.projectile.getComponent("type_family").hasTypeFamily("killable") ==
    true
  )
    event.projectile.kill();
});
//
//
//
world.afterEvents.projectileHitEntity.subscribe((event) => {
  //shotgun projectiles
  if (
    event.projectile.isValid == false ||
    event.projectile.getComponent("type_family") == undefined ||
    event.projectile
      .getComponent("type_family")
      .hasTypeFamily("shotgun_projectile") == false
  )
    return;
  if (event.projectile.getDynamicProperty("shot_punch") == undefined)
    event.projectile.setDynamicProperty("shot_punch", 0);
  if (event.projectile.getDynamicProperty("shot_flame") == undefined)
    event.projectile.setDynamicProperty("shot_flame", 0);
  const DamageValue = event.projectile.getComponent("variant").value;
  const Target = event.getEntityHit();
  Target.entity.applyDamage(DamageValue, {
    cause: "override",
    damagingEntity: event.source,
  });
  Target.entity.addEffect(
    "minecraft:fatal_poison",
    100 * (1 + event.projectile.getDynamicProperty("shot_flame")),
    {
      amplifier: 0 + event.projectile.getDynamicProperty("shot_punch"),
    }
  );
  if (
    event.projectile.getComponent("type_family").hasTypeFamily("killable") ==
    true
  )
    event.projectile.kill();
});
//
//
function ProjectileShotgun(event, component) {
  const Cooldown = event.itemStack.getComponent("cooldown");
  Cooldown.startCooldown(event.source);
  const Enchantable = event.itemStack.getComponent("minecraft:enchantable");
  let PowerLevel = Enchantable?.getEnchantment("minecraft:power")?.level;
  const HeadLocation = event.source.getHeadLocation();
  const S = component.params.projectile_speed;
  const { x, y, z } = event.source.getViewDirection();
  const Velocity = { x: x * S, y: y * S, z: z * S };
  if (PowerLevel == undefined) PowerLevel = 0;
  for (
    let index = 0;
    index < component.params.projectile_count + PowerLevel;
    index++
  ) {
    const projectile_entity = event.source.dimension.spawnEntity(
      component.params.projectile_entity,
      HeadLocation
    );
    projectile_entity.setDynamicProperty(
      "shot_power",
      Enchantable?.getEnchantment("minecraft:power")?.level
    );
    projectile_entity.setDynamicProperty(
      "shot_punch",
      Enchantable?.getEnchantment("minecraft:punch")?.level
    );
    projectile_entity.setDynamicProperty(
      "shot_flame",
      Enchantable?.getEnchantment("minecraft:flame")?.level
    );
    const Projectile = projectile_entity.getComponent("projectile");
    const Ownership = projectile_entity.getComponent("tameable");
    Ownership.tame(event.source);
    Projectile.shoot(Velocity, {
      uncertainty: component.params.uncertainty,
    });
  }
  event.source.playSound(component.params.shoot_sound, {
    location: HeadLocation,
    pitch: component.params.sound_pitch,
    volume: component.params.sound_volume,
  });
  if (
    event.itemStack.getComponent("durability") != undefined &&
    Enchantable?.hasEnchantment("minecraft:infinity") == false
  )
    Durability(event);
}
//
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:icicle_glaive_use", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      const durability = event.itemStack.getComponent("minecraft:durability");
      const equippable = event.source.getComponent("minecraft:equippable");
      const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
      if (durability.damage > 2) {
        event.source.sendMessage("§cInsufficient Charge");
      } else {
        durability.damage = 300;
        mainhand.setItem(event.itemStack);
        event.source.dimension.spawnEntity(
          "thump989:glaive_dummy",
          event.source.location
        );
        event.source.dimension.playSound(
          "freze.generic",
          event.source.location
        );
        const Freeze = event.source.dimension.getEntities({
          maxDistance: 11,
          families: ["monster"],
          location: event.source.location,
        });
        Freeze.forEach((entity) =>
          entity.applyDamage(10, {
            cause: "override",
            damagingEntity: event.source,
          })
        );
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:scythe_attack", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      const Targets = event.source.dimension.getEntities({
        location: event.source.location,
        families: ["monster"],
        maxDistance: 3,
      });
      Targets.forEach((entity) => {
        entity.applyDamage(15, {
          cause: "contact",
          damagingEntity: event.source,
        });
      });
      const Health = event.source.getComponent("health");
      const HealAmount = Health.currentValue + Targets.length;
      if (Health.currentValue + HealAmount > Health.effectiveMax)
        Health.setCurrentValue(
          Health.currentValue + (Health.effectiveMax - Health.currentValue)
        );
      else Health.setCurrentValue(Health.currentValue + HealAmount);
      event.source.dimension.spawnParticle(
        "thump989:scythe_slice",
        event.source.location
      );
      event.source.dimension.playSound(
        "weapon.scythe.sweep",
        event.source.location
      );
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent(
    "thump989:icicle_glaive_charge",
    {
      onHitEntity(event) {
        if (event.hadEffect == false) return;
        const durability = event.itemStack.getComponent("minecraft:durability");
        const equippable = event.attackingEntity.getComponent(
          "minecraft:equippable"
        );
        if (durability.damage == 0) return;
        else {
          const HeadSlot = equippable.getEquipment(EquipmentSlot.Head);
          if (HeadSlot == undefined) {
            const mainhand = equippable.getEquipmentSlot(
              EquipmentSlot.Mainhand
            );
            durability.damage--;
            mainhand.setItem(event.itemStack);
          } else if (HeadSlot.typeId != "thump989:frosthelm") {
            const mainhand = equippable.getEquipmentSlot(
              EquipmentSlot.Mainhand
            );
            durability.damage--;
            mainhand.setItem(event.itemStack);
          } else if (HeadSlot.typeId == "thump989:frosthelm") {
            const mainhand = equippable.getEquipmentSlot(
              EquipmentSlot.Mainhand
            );
            durability.damage--;
            durability.damage--;
            mainhand.setItem(event.itemStack);
          }
        }
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:frostwinds_staff", {
    onUse(event) {
      const HeadLocation = event.source.getHeadLocation();
      const { x, y, z } = event.source.getViewDirection();
      const projectile_entity = event.source.dimension.spawnEntity(
        "thump989:frostwinds",
        HeadLocation
      );
      const equippable = event.source.getComponent("minecraft:equippable");
      const HeadSlot = equippable.getEquipment(EquipmentSlot.Head);
      if (HeadSlot == undefined) {
        const Projectile = projectile_entity.getComponent("projectile");
        const Ownership = projectile_entity.getComponent("tameable");
        Ownership.tame(event.source);
        const Velocity = { x: x * 1, y: y * 1, z: z * 1 };
        Projectile.shoot(Velocity, { uncertainty: 0 });
        const Cooldown = event.itemStack.getComponent("cooldown");
        Cooldown.startCooldown(event.source);
        event.source.playSound("mob.breeze.shoot", {
          location: HeadLocation,
          pitch: 1,
          volume: 0.5,
        });
        event.source.playSound("mob.icecube.spawn", {
          location: HeadLocation,
          pitch: 1,
          volume: 0.5,
        });
      } else if (HeadSlot.typeId != "thump989:frosthelm") {
        const Projectile = projectile_entity.getComponent("projectile");
        const Ownership = projectile_entity.getComponent("tameable");
        Ownership.tame(event.source);
        const Velocity = { x: x * 1, y: y * 1, z: z * 1 };
        Projectile.shoot(Velocity, { uncertainty: 0 });
        const Cooldown = event.itemStack.getComponent("cooldown");
        Cooldown.startCooldown(event.source);
        event.source.playSound("mob.breeze.shoot", {
          location: HeadLocation,
          pitch: 1,
          volume: 0.5,
        });
        event.source.playSound("mob.icecube.spawn", {
          location: HeadLocation,
          pitch: 1,
          volume: 0.5,
        });
      } else if (HeadSlot.typeId == "thump989:frosthelm") {
        const Projectile = projectile_entity.getComponent("projectile");
        const Ownership = projectile_entity.getComponent("tameable");
        Ownership.tame(event.source);
        const Velocity = { x: x * 2, y: y * 2, z: z * 2 };
        Projectile.shoot(Velocity, { uncertainty: 0 });
        const Cooldown = event.itemStack.getComponent("cooldown");
        Cooldown.startCooldown(event.source);
        event.source.startItemCooldown("frostwinds", 10);
        event.source.playSound("mob.breeze.shoot", {
          location: HeadLocation,
          pitch: 1,
          volume: 0.5,
        });
        event.source.playSound("mob.icecube.spawn", {
          location: HeadLocation,
          pitch: 1,
          volume: 0.5,
        });
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:stygian_scope", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      const Snipe = event.source.getEntitiesFromViewDirection({
        families: ["monster"],
        maxDistance: 50,
      });
      if (Snipe.at(0) == undefined) {
        event.source.sendMessage("§cAttack Failed");
        event.source.startItemCooldown("scope", 5);
        return;
      }
      event.source.dimension.playSound(
        "mob.elderguardian.curse",
        event.source.location,
        { pitch: 0.6, volume: 0.25 }
      );
      Snipe.at(0).entity.applyDamage(15, {
        cause: "override",
        damagingEntity: event.source,
      });
      Snipe.at(0).entity.dimension.spawnParticle(
        "thump989:dark_burst",
        Snipe.at(0).entity.getHeadLocation()
      );
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:demon_core", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      event.source.spawnParticle(
        "thump989:demon_core_flash",
        event.source.location
      );
      event.source.dimension.playSound(
        "random.anvil_land",
        event.source.location
      );
      event.source.dimension.playSound("radiation", event.source.location);
      const Targets = event.source.dimension.getEntities({
        location: event.source.location,
        families: ["mob"],
        excludeFamilies: ["inanimate"],
        maxDistance: 8,
      });
      Targets.forEach((entity) =>
        entity.addEffect("fatal_poison", 400, { amplifier: 2 })
      );
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:mosquito_needle", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      event.source.applyDamage(6, { cause: "override" });
      const Effects = event.source.getEffects();
      Effects.forEach((effect) => {
        if (
          effect.typeId == "minecraft:bad_omen" ||
          effect.typeId == "minecraft:raid_omen" ||
          effect.typeId == "minecraft:trial_omen" ||
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
        ) {
          event.source.removeEffect(effect.typeId);
          event.source.addEffect("regeneration", 120, { amplifier: 2 });
        }
      });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:glowworm_queen", {
    onUseOn(event) {
      if (event.blockFace == Direction.Down) return;
      Durability(event);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:astral_mace", {
    onHitEntity(event) {
      for (let index = 0; index < 6; index++) {
        const projectile_entity = event.attackingEntity.dimension.spawnEntity(
          "thump989:stellar_tempest_projectile",
          {
            x: event.hitEntity.location.x,
            y: event.hitEntity.location.y + 15,
            z: event.hitEntity.location.z,
          }
        );
        const Projectile = projectile_entity.getComponent("projectile");
        const Ownership = projectile_entity.getComponent("tameable");
        Ownership.tame(event.attackingEntity);
        Projectile.shoot({ x: 0, y: -1, z: 0 }, { uncertainty: 35 });
      }
      event.attackingEntity.playSound("item.stellar_tempest.use", {
        location: event.attackingEntity.location,
        pitch: 2,
        volume: 0.1,
      });
    },
  });
});

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:shadow_time", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      const HeadLocation = event.source.getHeadLocation();
      const { x, y, z } = event.source.getViewDirection();
      const Velocity = { x: x * 2, y: y * 2, z: z * 2 };
      const projectile_entity = event.source.dimension.spawnEntity(
        "thump989:shadow_chime_projectile",
        HeadLocation
      );
      const Projectile = projectile_entity.getComponent("projectile");
      Projectile.owner = event.source;
      Projectile.shoot(Velocity, { uncertainty: 2.5 });
      event.source.playSound("item.shadow_chime", {
        location: HeadLocation,
        pitch: Math.random() + 0.4,
        volume: 0.1,
      });
      Durability(event);
    },
  });
});

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:fate_tome", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      const sourceEntity = event.source;
      const Health = event.source.getComponent("health");
      let BlastPower = Health.currentValue;
      Health.setCurrentValue(1);
      const Effects = event.source.getEffects();
      Effects.forEach((effect) => {
        if (effect.typeId != "minecraft:health_boost")
          event.source.removeEffect(effect.typeId);
      });
      event.source.addEffect("minecraft:resistance", 200, { amplifier: 200 });
      event.source.addEffect("minecraft:strength", 200, { amplifier: 4 });
      const molang = new MolangVariableMap();
      molang.setFloat(
        "variable.particle_amount",
        Math.pow(BlastPower * 2, 1.25)
      );
      molang.setFloat("variable.blast_size", BlastPower + 1);
      sourceEntity.dimension.spawnParticle(
        "thump989:phantore_xp_blast",
        sourceEntity.location,
        molang
      );
      sourceEntity.dimension.spawnParticle(
        "thump989:phantore_xp_blast_outer",
        sourceEntity.location,
        molang
      );
      sourceEntity.dimension.playSound(
        "mob.phantore.exp_explosion",
        sourceEntity.location,
        {
          volume: 0.5,
        }
      );
      const BlastVictim = sourceEntity.dimension.getEntities({
        location: sourceEntity.location,
        maxDistance: BlastPower,
        families: ["monster"],
        excludeFamilies: ["inanimate"],
        excludeTypes: ["item"],
      });
      if (BlastVictim == undefined) return;
      else {
        BlastVictim.forEach((entity) => {
          entity.applyDamage(BlastPower * 2 + 10, { cause: "magic" });
        });
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:flight_tome", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      const location = event.source.location;
      const Enchantable = event.itemStack.getComponent("minecraft:enchantable");
      event.source.dimension.playSound("wind_charge.burst", location);
      event.source.dimension.spawnParticle("thump989:flight_tome", location);
      event.source.dimension.spawnParticle(
        "minecraft:wind_explosion_emitter",
        location
      );
      if (Enchantable?.getEnchantment("minecraft:power") == undefined) {
        event.source.applyKnockback({ x: 0, z: 0 }, 2);
        Durability(event);
      } else {
        const Power = Enchantable?.getEnchantment("minecraft:power")?.level;
        event.source.applyKnockback({ x: 0, z: 0 }, 2 + Power / 10);
        Durability(event);
      }
      if (Enchantable?.getEnchantment("minecraft:flame") == undefined) return;
      else {
        event.source.dimension.spawnParticle(
          "thump989:fireminister_small_burst",
          event.source.location
        );
        const Firevictim = event.source.dimension.getEntities({
          location: event.source.location,
          maxDistance: 5,
          families: ["monster"],
          excludeFamilies: ["inanimate"],
        });
        Firevictim.forEach((entity) => {
          SetOnFire(entity, 5);
        });
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:sentry_spawn", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      const Target = event.source.getBlockFromViewDirection({
        maxDistance: 50,
      });
      if (Target == undefined) {
        event.source.sendMessage("§cSpawn Failed. Target is too far away");
        event.source.startItemCooldown("watcher_staff", 5);
        return;
      }
      const TargetBlock1 = Target.block.above();
      const TargetBlock2 = Target.block.above(1);
      if (
        TargetBlock1.matches("minecraft:air") == false ||
        TargetBlock2.matches("minecraft:air") == false
      ) {
        event.source.sendMessage("§cSpawn Failed. Target is obstructed");
        event.source.startItemCooldown("watcher_staff", 5);
        return;
      }
      const { x, y, z } = Target.block.bottomCenter();
      const TeleportTarget = { x, y: y + 1, z };
      function distance(
        vector1 = event.source.getHeadLocation(),
        vector2 = TeleportTarget
      ) {
        return Math.sqrt(
          Math.abs(vector1.x - vector2.x) ** 2 +
            Math.abs(vector1.y - vector2.y) ** 2 +
            Math.abs(vector1.z - vector2.z) ** 2
        );
      }
      function line(
        vector1 = event.source.getHeadLocation(),
        vector2 = TeleportTarget,
        step2 = 1
      ) {
        let dist = distance(vector1, vector2);
        let step = {
          x: (vector2.x - vector1.x) / (dist || 1),
          y: (vector2.y - vector1.y) / (dist || 1),
          z: (vector2.z - vector1.z) / (dist || 1),
        };
        let list = [];
        for (let i = 0; i < dist; i += step2) {
          list.push({
            x: vector1.x + i * step.x,
            y: vector1.y + i * step.y,
            z: vector1.z + i * step.z,
          });
        }
        return list;
      }
      for (let loc of line(
        event.source.getHeadLocation(),
        TeleportTarget,
        0.3
      )) {
        {
          event.source.dimension.spawnParticle("thump989:sentry_place", loc);
        }
      }
      event.source.dimension.spawnEntity(
        "thump989:ominous_sentry",
        TeleportTarget
      );
      event.source.dimension.playSound(
        "trial_spawner.break",
        event.source.location
      );
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:coral_spawn", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      const Target = event.source.getBlockFromViewDirection({
        maxDistance: 50,
      });
      if (Target == undefined) {
        event.source.sendMessage("§cSpawn Failed. Target is too far away");
        event.source.startItemCooldown("astral_staff", 5);
        return;
      }
      const TargetBlock1 = Target.block.above();
      const TargetBlock2 = Target.block.above(1);
      if (
        TargetBlock1.matches("minecraft:air") == false ||
        TargetBlock2.matches("minecraft:air") == false
      ) {
        event.source.sendMessage("§cSpawn Failed. Target is obstructed");
        event.source.startItemCooldown("astral_staff", 5);
        return;
      }
      const { x, y, z } = Target.block.bottomCenter();
      const TeleportTarget = { x, y: y + 1, z };
      function distance(
        vector1 = event.source.getHeadLocation(),
        vector2 = TeleportTarget
      ) {
        return Math.sqrt(
          Math.abs(vector1.x - vector2.x) ** 2 +
            Math.abs(vector1.y - vector2.y) ** 2 +
            Math.abs(vector1.z - vector2.z) ** 2
        );
      }
      function line(
        vector1 = event.source.getHeadLocation(),
        vector2 = TeleportTarget,
        step2 = 1
      ) {
        let dist = distance(vector1, vector2);
        let step = {
          x: (vector2.x - vector1.x) / (dist || 1),
          y: (vector2.y - vector1.y) / (dist || 1),
          z: (vector2.z - vector1.z) / (dist || 1),
        };
        let list = [];
        for (let i = 0; i < dist; i += step2) {
          list.push({
            x: vector1.x + i * step.x,
            y: vector1.y + i * step.y,
            z: vector1.z + i * step.z,
          });
        }
        return list;
      }
      for (let loc of line(
        event.source.getHeadLocation(),
        TeleportTarget,
        0.3
      )) {
        {
          event.source.dimension.spawnParticle("thump989:coral_heal", loc);
        }
      }
      event.source.dimension.spawnEntity(
        "thump989:friendly_coral",
        TeleportTarget
      );
      event.source.dimension.playSound(
        "break.big_dripleaf",
        event.source.location
      );
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:teleport_tome", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      const Target = event.source.getBlockFromViewDirection({
        maxDistance: 50,
      });
      if (Target == undefined) {
        event.source.sendMessage("§cTeleport Failed. Target is too far away");
        event.source.startItemCooldown("teleport_tome", 5);
        return;
      }
      const TargetBlock1 = Target.block.above();
      const TargetBlock2 = Target.block.above(1);
      if (
        TargetBlock1.matches("minecraft:air") == false ||
        TargetBlock2.matches("minecraft:air") == false
      ) {
        event.source.sendMessage("§cTeleport Failed. Target is obstructed");
        event.source.startItemCooldown("teleport_tome", 5);
        return;
      }
      const { x, y, z } = Target.block.bottomCenter();
      const TeleportTarget = { x, y: y + 1, z };
      function distance(
        vector1 = event.source.getHeadLocation(),
        vector2 = TeleportTarget
      ) {
        return Math.sqrt(
          Math.abs(vector1.x - vector2.x) ** 2 +
            Math.abs(vector1.y - vector2.y) ** 2 +
            Math.abs(vector1.z - vector2.z) ** 2
        );
      }
      function line(
        vector1 = event.source.getHeadLocation(),
        vector2 = TeleportTarget,
        step2 = 1
      ) {
        let dist = distance(vector1, vector2);
        let step = {
          x: (vector2.x - vector1.x) / (dist || 1),
          y: (vector2.y - vector1.y) / (dist || 1),
          z: (vector2.z - vector1.z) / (dist || 1),
        };
        let list = [];
        for (let i = 0; i < dist; i += step2) {
          list.push({
            x: vector1.x + i * step.x,
            y: vector1.y + i * step.y,
            z: vector1.z + i * step.z,
          });
        }
        return list;
      }
      for (let loc of line(
        event.source.getHeadLocation(),
        TeleportTarget,
        0.3
      )) {
        {
          event.source.dimension.spawnParticle("thump989:teleport_tome", loc);
        }
      }
      event.source.teleport(TeleportTarget, {
        checkForBlocks: true,
      });
      event.source.dimension.playSound("mob.shulker.teleport", TeleportTarget);
      Durability(event);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent(
    "thump989:stellar_tempest_tome",
    {
      onUse(event) {
        const TargetBlock = event.source.getBlockFromViewDirection({
          includeLiquidBlocks: true,
          includePassableBlocks: false,
          maxDistance: 50,
        });
        const TargetEntity = event.source.getEntitiesFromViewDirection({
          maxDistance: 50,
          excludeFamilies: ["player", "inanimate"],
          excludeTypes: ["item"],
        });
        if (TargetEntity.at(0) == undefined) {
          if (TargetBlock == undefined)
            event.source.sendMessage("§cTarget is invalid");
          else {
            for (let index = 0; index < 3; index++) {
              const SpawnLoc = TargetBlock.block.location;
              const projectile_entity = event.source.dimension.spawnEntity(
                "thump989:stellar_tempest_projectile",
                { x: SpawnLoc.x, y: SpawnLoc.y + 12, z: SpawnLoc.z }
              );
              const Projectile = projectile_entity.getComponent("projectile");
              const Ownership = projectile_entity.getComponent("tameable");
              Ownership.tame(event.source);
              Projectile.shoot({ x: 0, y: -1, z: 0 }, { uncertainty: 10 });
            }
            event.source.playSound("item.stellar_tempest.use", {
              location: event.source.location,
              pitch: 2,
              volume: 0.1,
            });
            Durability(event);
          }
        } else {
          for (let index = 0; index < 3; index++) {
            const SpawnLoc = TargetEntity.at(0).entity.location;
            const projectile_entity = event.source.dimension.spawnEntity(
              "thump989:stellar_tempest_projectile",
              { x: SpawnLoc.x, y: SpawnLoc.y + 12, z: SpawnLoc.z }
            );
            const Projectile = projectile_entity.getComponent("projectile");
            const Ownership = projectile_entity.getComponent("tameable");
            Ownership.tame(event.source);
            Projectile.shoot({ x: 0, y: -1, z: 0 }, { uncertainty: 10 });
          }
          event.source.playSound("item.stellar_tempest.use", {
            location: event.source.location,
            pitch: 2,
            volume: 0.1,
          });
          Durability(event);
        }
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:reagent_tome", {
    onUse(event) {
      const TargetBlock = event.source.getBlockFromViewDirection({
        includeLiquidBlocks: true,
        includePassableBlocks: false,
        maxDistance: 50,
      });
      const TargetEntity = event.source.getEntitiesFromViewDirection({
        maxDistance: 50,
        excludeFamilies: ["player", "inanimate"],
        excludeTypes: ["item"],
      });
      if (TargetEntity.at(0) == undefined) {
        if (TargetBlock == undefined) {
          event.source.sendMessage("§cTarget is invalid");
          event.source.startItemCooldown("reagent_tome", 5);
        } else {
          const TargetLocation = TargetBlock.block.location;
          const TargetEntities = TargetBlock.block.dimension.getEntities({
            location: TargetLocation,
            maxDistance: 5,
          });
          TargetEntities.forEach((entity) => {
            entity.dimension.spawnParticle(
              "thump989:reagant_hit",
              entity.location
            );
            const AppliedEffects = entity.getEffects();
            AppliedEffects.forEach((effect) => {
              if (effect.typeId == "minecraft:health_boost") return;
              entity.addEffect(effect.typeId, effect.duration + 200, {
                amplifier: effect.amplifier + 1,
              });
            });
          });
          TargetBlock.block.dimension.spawnParticle(
            "thump989:reagent_particle",
            TargetLocation
          );
          TargetBlock.block.dimension.spawnParticle(
            "thump989:reagent_particle_outer",
            TargetLocation
          );
          const Cooldown = event.itemStack.getComponent("cooldown");
          Cooldown.startCooldown(event.source);
          Durability(event);
        }
      } else {
        const TargetLocation = TargetEntity.at(0).entity.location;
        const TargetEntities = TargetEntity.at(0).entity.dimension.getEntities({
          location: TargetLocation,
          maxDistance: 5,
        });
        TargetEntities.forEach((entity) => {
          entity.dimension.spawnParticle(
            "thump989:reagant_hit",
            entity.location
          );
          const AppliedEffects = entity.getEffects();
          AppliedEffects.forEach((effect) => {
            if (effect.typeId == "minecraft:health_boost") return;
            entity.addEffect(effect.typeId, effect.duration + 200, {
              amplifier: effect.amplifier + 1,
            });
          });
        });
        TargetBlock.block.dimension.spawnParticle(
          "thump989:reagent_particle",
          TargetLocation
        );
        TargetBlock.block.dimension.spawnParticle(
          "thump989:reagent_particle_outer",
          TargetLocation
        );
        const Cooldown = event.itemStack.getComponent("cooldown");
        Cooldown.startCooldown(event.source);
        Durability(event);
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent(
    "thump989:charge_projectile_generic",
    {
      onCompleteUse(event, component) {
        ProjectileShoot(event, component);
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:projectile_generic", {
    onUse(event, component) {
      ProjectileShoot(event, component);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:projectile_shotgun", {
    onUse(event, component) {
      ProjectileShotgun(event, component);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent(
    "thump989:projectile_generic_durability",
    {
      onUse(event, component) {
        ProjectileShoot(event, component);
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:life_tome_dx", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      event.source.dimension.playSound(
        "resonate.amethyst_block",
        event.source.location
      );
      event.source.addEffect("absorption", 2400);
      event.source.addEffect("regeneration", 140, { amplifier: 2 });
      Durability(event);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:cureall_tome", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      event.source.dimension.playSound(
        "resonate.amethyst_block",
        event.source.location
      );
      const Effects = event.source.getEffects();
      Effects.forEach((effect) => {
        if (
          effect.typeId == "minecraft:bad_omen" ||
          effect.typeId == "minecraft:trial_omen" ||
          effect.typeId == "minecraft:raid_omen" ||
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
      Durability(event);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:life_tome", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      event.source.dimension.playSound(
        "resonate.amethyst_block",
        event.source.location
      );
      event.source.addEffect("absorption", 2400);
      event.source.addEffect("regeneration", 100, { amplifier: 1 });
      Durability(event);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:wither_necro_tome", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      const location = event.source.location;
      event.source.dimension.spawnParticle("thump989:necro_spawn_1", location);
      let { x, y, z } = event.source.location;
      for (let index = 0; index < 4; index++) {
        const Variable1 = (Math.random() - 0.5) * 4;
        const Variable2 = (Math.random() - 0.5) * 4;
        if (
          event.source.dimension.getBlock({
            x: x + Variable1,
            y: y + 0.1,
            z: z + Variable2,
          }).isAir
        ) {
          const summon_entity = event.source.dimension.spawnEntity(
            "thump989:necro_wither_skeleton",
            { x: x + Variable1, y: y + 0.1, z: z + Variable2 }
          );
          const Ownership = summon_entity.getComponent("tameable");
          Ownership.tame(event.source);
          summon_entity.nameTag = "Necromancer Skeleton";
        } else {
          const summon_entity = event.source.dimension.spawnEntity(
            "thump989:necro_wither_skeleton",
            location
          );
          const Ownership = summon_entity.getComponent("tameable");
          Ownership.tame(event.source);
          summon_entity.nameTag = "Necromancer Skeleton";
        }
      }
      Durability(event);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:necro_tome", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      const location = event.source.location;
      event.source.dimension.spawnParticle("thump989:necro_spawn_1", location);
      let { x, y, z } = event.source.location;
      for (let index = 0; index < 4; index++) {
        const Variable1 = (Math.random() - 0.5) * 4;
        const Variable2 = (Math.random() - 0.5) * 4;
        if (
          event.source.dimension.getBlock({
            x: x + Variable1,
            y: y + 0.1,
            z: z + Variable2,
          }).isAir
        ) {
          const summon_entity = event.source.dimension.spawnEntity(
            "thump989:necro_skeleton",
            { x: x + Variable1, y: y + 0.1, z: z + Variable2 }
          );
          const Ownership = summon_entity.getComponent("tameable");
          Ownership.tame(event.source);
          summon_entity.nameTag = "Necromancer Skeleton";
        } else {
          const summon_entity = event.source.dimension.spawnEntity(
            "thump989:necro_skeleton",
            location
          );
          const Ownership = summon_entity.getComponent("tameable");
          Ownership.tame(event.source);
          summon_entity.nameTag = "Necromancer Skeleton";
        }
      }
      Durability(event);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent(
    "thump989:reduce_melee_damage",
    {
      onBeforeDurabilityDamage(event) {
        event.durabilityDamage = 1;
      },
    }
  );
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:deny_melee_damage", {
    onBeforeDurabilityDamage(event) {
      event.durabilityDamage = 0;
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:thunder_tome", {
    onUse(event) {
      const HeadLocation = event.source.getHeadLocation();
      const { x, y, z } = event.source.getViewDirection();
      const Velocity = { x: x / 16, y: y / 16, z: z / 16 };
      const projectile_entity = event.source.dimension.spawnEntity(
        "thump989:thunder_orb",
        HeadLocation
      );
      const enchantable = event.itemStack.getComponent("minecraft:enchantable");
      if (enchantable.getEnchantment("minecraft:power") == undefined)
        projectile_entity.setDynamicProperty("shot_power", 2);
      else
        projectile_entity.setDynamicProperty(
          "shot_power",
          2 + enchantable.getEnchantment("minecraft:power").level / 2
        );
      if (enchantable.getEnchantment("minecraft:punch") == undefined)
        projectile_entity.setDynamicProperty("shot_punch", 8);
      else
        projectile_entity.setDynamicProperty(
          "shot_punch",
          8 + enchantable.getEnchantment("minecraft:punch").level
        );
      const Projectile = projectile_entity.getComponent("projectile");
      const Ownership = projectile_entity.getComponent("tameable");
      Ownership.tame(event.source);
      Projectile.shoot(Velocity, { uncertainty: 0 });
      const Cooldown = event.itemStack.getComponent("cooldown");
      Cooldown.startCooldown(event.source);
      event.source.playSound("ambient.weather.thunder", {
        location: HeadLocation,
        pitch: 2,
        volume: 0.5,
      });
      if (
        event.itemStack.getComponent("durability") != undefined &&
        enchantable?.hasEnchantment("minecraft:infinity") == false
      )
        Durability(event);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:exp_sword", {
    onHitEntity(event) {
      if (event.hadEffect == false) return;
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      if (Cooldown.getCooldownTicksRemaining(event.attackingEntity) > 0) return;
      Cooldown.startCooldown(event.attackingEntity);
      const SpawnLocation = event.hitEntity.getHeadLocation();
      for (let index = 0; index < 5; index++) {
        event.hitEntity.dimension.spawnEntity("xp_orb", SpawnLocation);
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:exp_sacrafice", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      const SourceLocation = event.source.location;
      const PlayerLevel = Math.round(event.source.level.valueOf() / 3) % 65;
      if (PlayerLevel <= 0) {
        event.source.sendMessage({ text: "§eInsufficient Experience Points" });
        return;
      } else event.source.resetLevel();
      const item = new ItemStack("thump989:pure_magic", Math.ceil(PlayerLevel));
      const TextMessage = PlayerLevel.toString();
      event.source.sendMessage({
        rawtext: [
          { text: "§e" },
          { text: TextMessage },
          { text: " Pure Magic Obtained" },
        ],
      });
      event.source.dimension.spawnItem(item, SourceLocation);
      event.source.applyDamage(5, { cause: "magic" });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:water_staff_hit", {
    onHitEntity(event) {
      if (event.hadEffect == false) return;
      event.hitEntity.addEffect("slowness", 200, { amplifier: 1 });
      event.hitEntity.addEffect("weakness", 200, { amplifier: 1 });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:water_staff_use", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      const SourceLocation = event.source.location;
      event.source.dimension.spawnParticle(
        "thump989:water_staff_use",
        SourceLocation
      );
      event.source.dimension.playSound(
        "bucket.empty_water",
        event.source.location
      );
      const EntityLocation = event.source.location;
      const Target = event.source.dimension.getEntities({
        location: EntityLocation,
        excludeFamilies: ["monster", "boss", "inanimate"],
        families: ["mob"],
        maxDistance: 6,
      });
      const PlayerTarget = event.source.dimension.getEntities({
        location: EntityLocation,
        excludeFamilies: ["monster", "boss", "inanimate"],
        families: ["player"],
        maxDistance: 6,
      });
      const AllTarget = Target.concat(PlayerTarget);
      AllTarget.forEach((entity) => {
        entity.extinguishFire();
        const Heal = entity.getComponent("health");
        const HealAmount = Heal.currentValue;
        if (Heal.currentValue + 6 > Heal.effectiveMax) {
          Heal.setCurrentValue(
            Heal.currentValue + (Heal.effectiveMax - HealAmount)
          );
          const HeadLocation = entity.getHeadLocation();
          entity.dimension.spawnParticle(
            "minecraft:heart_particle",
            HeadLocation
          );
        } else {
          Heal.setCurrentValue(HealAmount + 6);
          const HeadLocation = entity.getHeadLocation();
          entity.dimension.spawnParticle(
            "minecraft:heart_particle",
            HeadLocation
          );
        }
      });
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:earth_staff_use", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      event.source.addEffect("resistance", 600);
      event.source.dimension.spawnParticle(
        "thump989:earth_staff_use",
        event.source.location
      );
      event.source.dimension.playSound(
        "weapon.earthstaff.use",
        event.source.location
      );
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:sceptre", {
    onHitEntity(event) {
      if (event.hadEffect == false) return;
      event.hitEntity.addEffect("minecraft:trial_omen", 300);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:fire_generic", {
    onHitEntity(event) {
      if (event.hadEffect == false) return;
      const entity = event.hitEntity;
      const burn_time = 7;
      SetOnFire(entity, burn_time);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:blazing_mace", {
    onHitEntity(event) {
      const FireDuration = event.hitEntity.getComponent(
        EntityComponentTypes.OnFire
      );
      if (FireDuration) {
        event.hitEntity.applyDamage(FireDuration.onFireTicksRemaining / 7, {
          cause: "fire",
          damagingEntity: event.attackingEntity,
        });
        event.hitEntity.dimension.spawnParticle(
          "thump989:blazing_mace_blast",
          event.hitEntity.getHeadLocation()
        );
        event.hitEntity.extinguishFire();
      }
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:vampire_dagger", {
    onHitEntity(event) {
      if (event.hadEffect == false) return;
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      if (Cooldown.getCooldownTicksRemaining(event.attackingEntity) > 0) return;
      const Health = event.attackingEntity.getComponent("minecraft:health");
      Cooldown.startCooldown(event.attackingEntity);
      Health.setCurrentValue(Health.currentValue + 1);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:brine_mace", {
    onHitEntity(event) {
      if (event.hadEffect == false) return;
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      if (Cooldown.getCooldownTicksRemaining(event.attackingEntity) > 0) return;
      const Health = event.attackingEntity.getComponent("minecraft:health");
      if (Health.currentValue == Health.effectiveMax) return;
      Cooldown.startCooldown(event.attackingEntity);
      Health.setCurrentValue(Health.currentValue + 1);
    },
  });
});
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:blemished_mace", {
    onUse(event) {
      const Cooldown = event.itemStack.getComponent("minecraft:cooldown");
      Cooldown.startCooldown(event.source);
      const Rayvictim = event.source.getEntitiesFromViewDirection({
        maxDistance: 50,
        families: ["monster"],
      });
      const BlockRayVictim = event.source.getBlockFromViewDirection({
        maxDistance: 50,
      });
      if (Rayvictim.at(0) == undefined) {
        if (BlockRayVictim == undefined) {
          event.source.sendMessage("§cTarget is too far away");
          event.source.startItemCooldown("blemished_mace", 5);
          return;
        }
        const SpawnLoc = BlockRayVictim.block.above().bottomCenter();
        const Quake = BlockRayVictim.block.dimension.spawnEntity(
          "thump989:earth_staff_dummy",
          SpawnLoc
        );
        Quake.getComponent("tameable").tame(event.source);
      } else {
        const SpawnLoc = Rayvictim.at(0).entity.location;
        const Quake = Rayvictim.at(0).entity.dimension.spawnEntity(
          "thump989:earth_staff_dummy",
          SpawnLoc
        );
        Quake.getComponent("tameable").tame(event.source);
      }
    },
  });
});
