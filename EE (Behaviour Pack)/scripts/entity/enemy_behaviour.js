import {
  EffectType,
  Entity,
  system,
  world,
  Player,
  MolangVariableMap,
} from "@minecraft/server";
function SetOnFire(entity, burn_time) {
  if (entity.getComponent("fire_immune")) return;
  if (entity.getEffect("minecraft:fire_resistance")) return;
  entity.setOnFire(burn_time, true);
}
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:boomerang" && message != "return") return;
  {
    const Direction = event.sourceEntity.getVelocity();
    const projectile = event.sourceEntity.getComponent("projectile");
    projectile.shoot({
      x: -Direction.x * 4,
      y: -Direction.y * 4,
      z: -Direction.z * 4,
    });
  }
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (
    id != "thump989:staff_fireball_explode" &&
    message != "staff_fireexplode1"
  )
    return;
  const Victims = event.sourceEntity.dimension.getEntities({
    maxDistance: 5.5,
    excludeFamilies: ["player", "inanimate"],
    excludeTypes: ["item", "minecraft:xp_orb"],
    location: sourceEntity.location,
  });
  sourceEntity.dimension.spawnParticle(
    "thump989:phantore_fire_explosion_burst",
    sourceEntity.location
  );
  sourceEntity.dimension.spawnParticle(
    "minecraft:huge_explosion_emitter",
    sourceEntity.location
  );
  sourceEntity.dimension.playSound(
    "item.meteor.fireball_explode",
    sourceEntity.location,
    {
      volume: 2,
    }
  );
  const Owner = event.sourceEntity.getComponent("tameable").tamedToPlayer;
  if (Victims.at(0) == undefined) return;
  Victims.forEach((entity) => {
    entity.applyDamage(50, { cause: "fire", damagingEntity: Owner });
    const burn_time = 20;
    SetOnFire(entity, burn_time);
  });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:fireball_explode" && message != "fireexplode1") return;
  const Victims = event.sourceEntity.dimension.getEntities({
    maxDistance: 4.5,
    excludeFamilies: ["monster", "skeletonhorse", "ominous", "inanimate"],
    excludeTypes: ["item", "minecraft:xp_orb"],
    location: sourceEntity.location,
  });
  sourceEntity.dimension.spawnParticle(
    "thump989:phantore_fire_explosion_burst",
    sourceEntity.location
  );
  sourceEntity.dimension.spawnParticle(
    "minecraft:huge_explosion_emitter",
    sourceEntity.location
  );
  sourceEntity.dimension.playSound(
    "mob.phantore.fireball_explode",
    sourceEntity.location,
    {
      volume: 2,
    }
  );
  if (Victims.at(0) == undefined) return;
  Victims.forEach((entity) => {
    entity.applyDamage(60, { cause: "fire" });
    const burn_time = 20;
    SetOnFire(entity, burn_time);
  });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_homing_shot_2" && message != "homing2") return;
  for (let index = 0; index < 14; index++) {
    const velocity = sourceEntity.getViewDirection();
    const shot = event.sourceEntity.dimension.spawnEntity(
      "thump989:sinister_witch_blast",
      {
        x: sourceEntity.location.x,
        y: sourceEntity.location.y + 1,
        z: sourceEntity.location.z,
      }
    );
    const Rand = Math.random() * 12;
    const Projectile = shot.getComponent("projectile");
    Projectile.shoot(
      {
        x: velocity.x * Rand,
        y: velocity.y * Rand,
        z: velocity.z * Rand,
      },
      {
        uncertainty: 10,
      }
    );
  }
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_homing_shot" && message != "homing1") return;
  for (let index = 0; index < 14; index++) {
    const velocity = sourceEntity.getViewDirection();
    const shot = event.sourceEntity.dimension.spawnEntity(
      "thump989:sinister_witch_blast",
      {
        x: sourceEntity.location.x,
        y: sourceEntity.location.y + 1,
        z: sourceEntity.location.z,
      }
    );
    const Rand = Math.random() * 6;
    const Projectile = shot.getComponent("projectile");
    Projectile.shoot(
      {
        x: velocity.x * Rand,
        y: velocity.y * Rand,
        z: velocity.z * Rand,
      },
      {
        uncertainty: 10,
      }
    );
  }
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_xp_explosion" && message != "xp_explosion")
    return;
  const molang = new MolangVariableMap();
  molang.setFloat(
    "variable.particle_amount",
    Math.pow(sourceEntity.getProperty("thump989:xp_blast_amount") * 2, 1.25)
  );
  molang.setFloat(
    "variable.blast_size",
    sourceEntity.getProperty("thump989:xp_blast_amount") + 1
  );
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
    maxDistance: sourceEntity.getProperty("thump989:xp_blast_amount"),
    excludeFamilies: ["monster", "inanimate", "ominous"],
    excludeTypes: ["item"],
  });
  if (BlastVictim == undefined) return;
  else {
    BlastVictim.forEach((entity) => {
      entity.applyDamage(
        sourceEntity.getProperty("thump989:xp_blast_amount") * 2 + 10,
        { cause: "magic" }
      );
    });
  }
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_xp_kill" && message != "xp_kill") return;
  const EXP = sourceEntity.dimension.getEntities({
    location: sourceEntity.location,
    maxDistance: 1,
    type: "minecraft:xp_orb",
  });
  if (EXP == undefined) return;
  else if (
    sourceEntity.getProperty("thump989:xp_blast_amount") + EXP.length * 0.2 >
    50
  ) {
    sourceEntity.dimension.spawnParticle(
      "thump989:xp_max_warn",
      sourceEntity.location
    );
    EXP.forEach((entity) => {
      entity.remove();
    });
  } else {
    sourceEntity.setProperty(
      "thump989:xp_blast_amount",
      sourceEntity.getProperty("thump989:xp_blast_amount") + EXP.length * 0.2
    );
    EXP.forEach((entity) => {
      entity.remove();
    });
  }
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_xp_absorb" && message != "xp") return;
  const EXPSource = sourceEntity.dimension.getEntities({
    location: sourceEntity.location,
    maxDistance: 30,
    type: "minecraft:player",
  });
  if (EXPSource == undefined) return;
  else {
    EXPSource.forEach((player) => {
      if (player.getTotalXp() == 0) return;
      else if (player.xpEarnedAtCurrentLevel == 0) {
        player.addLevels(-1);
        player.addExperience(player.totalXpNeededForNextLevel - 3);
      } else {
        player.addExperience(-1);
        const location = player.location;
        player.dimension.spawnEntity("minecraft:xp_orb", {
          x: location.x,
          y: location.y + 3,
          z: location.z,
        });
      }
    });
  }
});
//
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:astral_star_recursive" && message != "starburst") return;
  for (let index = 0; index < 30; index++) {
    const projectile = event.sourceEntity.dimension.spawnEntity(
      "thump989:mini_astral_shot",
      event.sourceEntity.location
    );
    const component = projectile.getComponent("projectile");
    component.shoot(
      { x: 0.005 + Math.random() / 4, y: 0.025, z: 0 },
      { uncertainty: 360 }
    );
  }
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_skullshoot_2" && message != "skullshot2") return;
  WarningShot(1, 0.5, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, 0.5, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(1, -0.5, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, -0.5, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(0.5, 1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-0.5, 1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(0.5, -1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-0.5, -1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  event.sourceEntity.dimension.playSound(
    "mob.wither.shoot",
    event.sourceEntity.location,
    { pitch: 0.5 }
  );
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_skullwarn_2" && message != "skull2") return;
  WarningShot(1, 0.5, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, 0.5, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(1, -0.5, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, -0.5, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(0.5, 1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-0.5, 1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(0.5, -1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-0.5, -1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
});
//
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_skullshoot_1" && message != "skullshot1") return;
  WarningShot(1, 1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, 1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(1, -1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, -1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(0, 1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(1, 0, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(0, -1, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, 0, event.sourceEntity, "thump989:phantore_evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  event.sourceEntity.dimension.playSound(
    "mob.wither.shoot",
    event.sourceEntity.location,
    { pitch: 0.5 }
  );
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:phantore_skullwarn_1" && message != "skull1") return;
  WarningShot(1, 1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, 1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(1, -1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, -1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(0, 1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(1, 0, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(0, -1, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, 0, event.sourceEntity, "thump989:warning_shot", {
    x: 2,
    y: 0,
    z: 2,
  });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:witch_blast" && message != "home") return;
  const Projectile = event.sourceEntity.getComponent("projectile");
  const Shot = sourceEntity;
  const ShotTargets = Shot.dimension.getEntities({
    location: Shot.location,
    maxDistance: 15,
    excludeFamilies: ["inanimate"],
    families: ["player"],
  });
  if (ShotTargets.at(0) == undefined) return;
  else {
    const Target = ShotTargets.at(0);
    const Value1 = Target.location.x - Shot.location.x;
    const Value2 = Target.location.z - Shot.location.z;
    const Value3 = Target.location.y - Shot.location.y;
    Projectile.shoot({ x: Value1 / 3, y: Value3 / 3 + 0.5, z: Value2 / 3 });
  }
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:shadowflame1" && message != "fire1") return;
  const Victims = event.sourceEntity.dimension.getEntities({
    maxDistance: 1,
    excludeFamilies: ["monster", "skeletonhorse", "inanimate"],
    excludeTypes: ["item", "minecraft:xp_orb"],
    location: sourceEntity.location,
  });
  if (Victims.at(0) == undefined) return;
  Victims.forEach((entity) => {
    entity.applyDamage(6, { cause: "magic" });
    const burn_time = 7;
    SetOnFire(entity, burn_time);
  });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:darkzombie_attack1" && message != "skull") return;
  WarningShot(1, 1, event.sourceEntity, "thump989:evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, 1, event.sourceEntity, "thump989:evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(1, -1, event.sourceEntity, "thump989:evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  WarningShot(-1, -1, event.sourceEntity, "thump989:evil_skull", {
    x: 2,
    y: 0,
    z: 2,
  });
  event.sourceEntity.dimension.playSound(
    "mob.wither.shoot",
    event.sourceEntity.location,
    { pitch: 0.5 }
  );
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:darkzombie" && message != "warningshot") return;
  WarningShot(1, 1, event.sourceEntity, "thump989:warning_shot", {
    x: 3,
    y: 0,
    z: 3,
  });
  WarningShot(-1, 1, event.sourceEntity, "thump989:warning_shot", {
    x: 3,
    y: 0,
    z: 3,
  });
  WarningShot(1, -1, event.sourceEntity, "thump989:warning_shot", {
    x: 3,
    y: 0,
    z: 3,
  });
  WarningShot(-1, -1, event.sourceEntity, "thump989:warning_shot", {
    x: 3,
    y: 0,
    z: 3,
  });
});
function WarningShot(
  xMultiplier,
  ZMultiplier,
  ShootingEntity,
  projectile,
  { x, y, z }
) {
  const Shot = ShootingEntity.getViewDirection();
  const ShotProjectile = ShootingEntity.dimension.spawnEntity(projectile, {
    x: ShootingEntity.location.x,
    y: ShootingEntity.location.y + 1,
    z: ShootingEntity.location.z,
  });
  const component = ShotProjectile.getComponent("projectile");
  component.shoot({ x: 1 * xMultiplier, y: 0, z: 1 * ZMultiplier });
}
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:caldpteron" && message != "impulse") return;
  const Impulse = { x: 0, y: 3, z: 0 };
  event.sourceEntity.applyImpulse(Impulse);
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:friendly_coral" && message != "friend_heal") return;
  const SourceLocation = event.sourceEntity.location;
  const TargetLocation = event.sourceEntity.dimension.getEntities({
    maxDistance: 25,
    location: SourceLocation,
    type: "player",
  });
  TargetLocation.forEach((entity) => {
    function distance(
      vector1 = SourceLocation,
      vector2 = entity.getHeadLocation()
    ) {
      return Math.sqrt(
        Math.abs(vector1.x - vector2.x) ** 2 +
          Math.abs(vector1.y - vector2.y) ** 2 +
          Math.abs(vector1.z - vector2.z) ** 2
      );
    }
    function line(
      vector1 = SourceLocation,
      vector2 = entity.location,
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
    for (let loc of line(SourceLocation, entity.location, 0.3)) {
      {
        sourceEntity.dimension.spawnParticle("thump989:coral_heal", loc);
      }
    }
    const Health = entity.getComponent("health");
    if (Health.currentValue + 2 > Health.effectiveMax)
      Health.setCurrentValue(
        Health.currentValue + (Health.effectiveMax - Health.currentValue)
      );
    else Health.setCurrentValue(Health.currentValue + 2);
  });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:astral_coral" && message != "heal") return;
  const SourceLocation = event.sourceEntity.location;
  const TargetLocation = event.sourceEntity.dimension.getEntities({
    maxDistance: 25,
    location: SourceLocation,
    type: "thump989:astral_minister",
  });
  TargetLocation.forEach((entity) => {
    function distance(
      vector1 = SourceLocation,
      vector2 = entity.getHeadLocation()
    ) {
      return Math.sqrt(
        Math.abs(vector1.x - vector2.x) ** 2 +
          Math.abs(vector1.y - vector2.y) ** 2 +
          Math.abs(vector1.z - vector2.z) ** 2
      );
    }
    function line(
      vector1 = SourceLocation,
      vector2 = entity.location,
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
    for (let loc of line(SourceLocation, entity.location, 0.3)) {
      {
        sourceEntity.dimension.spawnParticle("thump989:coral_heal", loc);
      }
    }
    const Health = entity.getComponent("health");
    if (Health.currentValue + 8 > Health.effectiveMax)
      Health.setCurrentValue(
        Health.currentValue + (Health.effectiveMax - Health.currentValue)
      );
    else Health.setCurrentValue(Health.currentValue + 8);
  });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:black_hole" && message != "suction") return;
  const Hole = sourceEntity;
  const HoleTargets = Hole.dimension.getEntities({
    location: Hole.location,
    maxDistance: 25,
    excludeFamilies: ["monster", "boss", "inanimate"],
    excludeTypes: ["item"],
  });
  HoleTargets.forEach((entity) => {
    if (entity.getComponent("projectile")) return;
    const Value1 = entity.location.x - Hole.location.x;
    const Value2 = entity.location.z - Hole.location.z;
    entity.applyKnockback({ x: -Value1 * 0.08, z: -Value2 * 0.08 }, 0);
  });
  const DamageTarget = Hole.dimension.getEntities({
    location: Hole.location,
    maxDistance: 2.5,
    excludeFamilies: ["monster", "boss", "inanimate"],
    excludeTypes: ["item"],
  });
  DamageTarget.forEach((entity) => {
    entity.applyDamage(6, { cause: "override" });
  });
});

world.afterEvents.entityHurt.subscribe((event) => {
  if (event.hurtEntity.typeId != "thump989:astral_minister") return;
  if (event.damageSource.cause != "entityAttack") return;
  const { x, y, z } = event.damageSource.damagingEntity.getViewDirection();
  const KBDirection = { x: -x / 2, y: -y / 2, z: -z / 2 };
  event.damageSource.damagingEntity.applyKnockback(
    { x: KBDirection.x * 1, z: KBDirection.z * 1 },
    0.25
  );
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (
    id != "thump989:astral_minister_blackhole" &&
    message != "blackhole_spawn"
  )
    return;
  function StarSpawnLocation() {
    const { x, y, z } = sourceEntity.location;
    const Vector = {
      x: x + (Math.random() - 0.5) * 23,
      y: y,
      z: z + (Math.random() - 0.5) * 23,
    };
    return Vector;
  }
  sourceEntity.dimension.spawnEntity(
    "thump989:black_hole",
    StarSpawnLocation()
  );
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:astral_minister_coral" && message != "coral_spawn")
    return;
  function StarSpawnLocation() {
    const { x, y, z } = sourceEntity.location;
    const Vector = {
      x: x + (Math.random() - 0.5) * 23,
      y: y,
      z: z + (Math.random() - 0.5) * 23,
    };
    return Vector;
  }
  sourceEntity.dimension.spawnEntity(
    "thump989:astral_coral",
    StarSpawnLocation()
  );
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:astral_minister_star" && message != "star_rain") return;
  function StarSpawnLocation() {
    const { x, y, z } = sourceEntity.location;
    const Vector = {
      x: x + (Math.random() - 0.5) * 23,
      y: y + 18,
      z: z + (Math.random() - 0.5) * 23,
    };
    return Vector;
  }
  const Int = Math.random();
  if (Int > 0.025) {
    let Star = sourceEntity.dimension.spawnEntity(
      "thump989:minister_star",
      StarSpawnLocation()
    );
    const Velocity = { x: 0, y: -1, z: 0 };
    Star.getComponent("projectile").owner = sourceEntity;
    Star.getComponent("projectile").shoot(Velocity);
  } else {
    let Star = sourceEntity.dimension.spawnEntity(
      "thump989:astral_shot",
      StarSpawnLocation()
    );
    const Velocity = { x: 0, y: -0.25, z: 0 };
    Star.getComponent("projectile").owner = sourceEntity;
    Star.getComponent("projectile").shoot(Velocity);
  }
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:voidskipper_stinger" && message != "stinger_explode")
    return;
  const ExplosionLocation = sourceEntity.location;
  event.sourceEntity.dimension.spawnParticle(
    "thump989:voidskipper_explosion",
    ExplosionLocation
  );
  event.sourceEntity.dimension.playSound("random.explode", ExplosionLocation, {
    volume: 0.75,
  });
  const VoidskipperExplosion = sourceEntity.dimension.getEntities({
    excludeFamilies: ["monster", "inanimate"],
    excludeTypes: ["item"],
    location: ExplosionLocation,
    maxDistance: 2,
  });
  VoidskipperExplosion.forEach((entity) => {
    entity.applyDamage(5, { cause: "override" });
    entity.addEffect("slowness", 20, { amplifier: 4 });
  });
  event.sourceEntity.triggerEvent("thump989:instant_despawn");
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:fire_minister_phase2" && message != "fire_aura") return;
  const FireMinisterLocation = sourceEntity.location;
  const FireMinisterExplosion = sourceEntity.dimension.getEntities({
    excludeFamilies: ["monster", "inanimate"],
    excludeTypes: ["item"],
    location: FireMinisterLocation,
    maxDistance: 25,
  });
  FireMinisterExplosion.forEach((entity) => {
    const FireImmune = entity.getEffect("fire_resistance");
    if (FireImmune) return;
    const burn_time = 6;
    SetOnFire(entity, burn_time);
  });
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:fire_minister" && message != "fire_burst") return;
  const FireMinisterLocation = sourceEntity.location;
  const FireMinisterExplosion = sourceEntity.dimension.getEntities({
    excludeFamilies: ["monster"],
    location: FireMinisterLocation,
    maxDistance: 5,
  });
  event.sourceEntity.dimension.spawnParticle(
    "thump989:fireminister_small_burst",
    FireMinisterLocation
  );
  FireMinisterExplosion.forEach((entity) => {
    entity.applyDamage(7, { cause: "fire" });
    const burn_time = 10;
    SetOnFire(entity, burn_time);
  });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:thunder_ball" && message != "thunder_arc") return;
  const SourceLocation = event.sourceEntity.location;
  let Damage = event.sourceEntity.getDynamicProperty("shot_power");
  if (Damage == undefined) {
    event.sourceEntity.setDynamicProperty("shot_power", 2);
    Damage = event.sourceEntity.getDynamicProperty("shot_power");
  }
  let Distance = event.sourceEntity.getDynamicProperty("shot_punch");
  if (Distance == undefined) {
    event.sourceEntity.setDynamicProperty("shot_punch", 8);
    Distance = event.sourceEntity.getDynamicProperty("shot_punch");
  }
  const TargetLocation = event.sourceEntity.dimension.getEntities({
    maxDistance: Distance,
    location: SourceLocation,
    excludeFamilies: ["player", "wolf", "irongolem", "axolotl", "inanimate"],
    families: ["monster"],
  });
  TargetLocation.forEach((entity) => {
    function distance(
      vector1 = SourceLocation,
      vector2 = entity.getHeadLocation()
    ) {
      return Math.sqrt(
        Math.abs(vector1.x - vector2.x) ** 2 +
          Math.abs(vector1.y - vector2.y) ** 2 +
          Math.abs(vector1.z - vector2.z) ** 2
      );
    }
    function line(
      vector1 = SourceLocation,
      vector2 = entity.location,
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
    for (let loc of line(SourceLocation, entity.location, 0.3)) {
      {
        sourceEntity.dimension.spawnParticle("thump989:thunder_tome", loc);
      }
    }
    entity.applyDamage(Damage, { cause: "override" });
  });
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
  const { id, message, sourceEntity } = event;
  if (id != "thump989:stormtrident" && message != "thunder_arc_2") return;
  const SourceLocation = event.sourceEntity.location;
  let Damage = event.sourceEntity.getDynamicProperty("shot_power");
  if (Damage == undefined) {
    event.sourceEntity.setDynamicProperty("shot_power", 2);
    Damage = event.sourceEntity.getDynamicProperty("shot_power");
  }
  let Distance = event.sourceEntity.getDynamicProperty("shot_punch");
  if (Distance == undefined) {
    event.sourceEntity.setDynamicProperty("shot_punch", 4);
    Distance = event.sourceEntity.getDynamicProperty("shot_punch");
  }
  const TargetLocation = event.sourceEntity.dimension.getEntities({
    maxDistance: Distance,
    location: SourceLocation,
    excludeFamilies: ["player", "wolf", "irongolem", "axolotl", "inanimate"],
    families: ["monster"],
  });
  TargetLocation.forEach((entity) => {
    function distance(
      vector1 = SourceLocation,
      vector2 = entity.getHeadLocation()
    ) {
      return Math.sqrt(
        Math.abs(vector1.x - vector2.x) ** 2 +
          Math.abs(vector1.y - vector2.y) ** 2 +
          Math.abs(vector1.z - vector2.z) ** 2
      );
    }
    function line(
      vector1 = SourceLocation,
      vector2 = entity.location,
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
    for (let loc of line(SourceLocation, entity.location, 0.3)) {
      {
        sourceEntity.dimension.spawnParticle("thump989:thunder_tome", loc);
      }
    }
    entity.applyDamage(Damage, { cause: "override" });
  });
});
