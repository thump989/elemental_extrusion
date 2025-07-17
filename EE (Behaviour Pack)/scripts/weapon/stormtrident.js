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
} from "@minecraft/server";
world.afterEvents.playerSpawn.subscribe((event) => {
  let Property = event.player.getDynamicProperty("thump989:stormmcount");
  let PropertyJump = event.player.getDynamicProperty("thump989:jumpcount");
  if ((Property = undefined)) {
    event.player.setDynamicProperty("thump989:stormmcount", 0);
  }
  if ((PropertyJump = undefined)) {
    event.player.setDynamicProperty("thump989:jumpcount", 0);
  }
});
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
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  itemComponentRegistry.registerCustomComponent("thump989:storm_trident", {
    onCompleteUse(event, component) {
      const equippable = event.source.getComponent("minecraft:equippable");
      if (!equippable) return;
      let PropertyValue = event.source.getDynamicProperty(
        "thump989:stormmcount"
      );
      if (PropertyValue < 12) {
        if (event.itemStack.getComponent("cooldown") == undefined);
        else {
          const Cooldown = event.itemStack.getComponent("cooldown");
          Cooldown.startCooldown(event.source);
        }
        event.source.setDynamicProperty(
          "thump989:stormmcount",
          PropertyValue + 1
        );
        const HeadLocation = event.source.getHeadLocation();
        const S = component.params.projectile_speed;
        const { x, y, z } = event.source.getViewDirection();
        const Velocity = { x: x * S, y: y * S, z: z * S };
        for (
          let index = 0;
          index < component.params.projectile_count;
          index++
        ) {
          const projectile_entity = event.source.dimension.spawnEntity(
            component.params.projectile_entity,
            HeadLocation
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
      } else {
        if (event.itemStack.getComponent("cooldown") == undefined);
        else {
          const Cooldown = event.itemStack.getComponent("cooldown");
          Cooldown.startCooldown(event.source);
        }
        event.source.setDynamicProperty("thump989:stormmcount", 0);
        const HeadLocation = event.source.getHeadLocation();
        const S = component.params.projectile_speed;
        const { x, y, z } = event.source.getViewDirection();
        const Velocity = { x: x * S, y: y * S, z: z * S };
        for (
          let index = 0;
          index < component.params.projectile_count;
          index++
        ) {
          const projectile_entity = event.source.dimension.spawnEntity(
            component.params.projectile_entity,
            HeadLocation
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
        event.source.playSound("ambient.weather.thunder", {
          location: HeadLocation,
          pitch: 2,
          volume: 0.5,
        });
        ThunderShot(
          1 / 32,
          1 / 32,
          event.source,
          component.params.projectile_entity_charged,
          {
            x: 2,
            y: 0,
            z: 2,
          }
        );
        ThunderShot(
          -1 / 32,
          1 / 32,
          event.source,
          component.params.projectile_entity_charged,
          {
            x: 2,
            y: 0,
            z: 2,
          }
        );
        ThunderShot(
          1 / 32,
          -1 / 32,
          event.source,
          component.params.projectile_entity_charged,
          {
            x: 2,
            y: 0,
            z: 2,
          }
        );
        ThunderShot(
          -1 / 32,
          -1 / 32,
          event.source,
          component.params.projectile_entity_charged,
          {
            x: 2,
            y: 0,
            z: 2,
          }
        );
        ThunderShot(
          0,
          1 / 16,
          event.source,
          component.params.projectile_entity_charged,
          {
            x: 2,
            y: 0,
            z: 2,
          }
        );
        ThunderShot(
          1 / 16,
          0,
          event.source,
          component.params.projectile_entity_charged,
          {
            x: 2,
            y: 0,
            z: 2,
          }
        );
        ThunderShot(
          0,
          -1 / 16,
          event.source,
          component.params.projectile_entity_charged,
          {
            x: 2,
            y: 0,
            z: 2,
          }
        );
        ThunderShot(
          -1 / 16,
          0,
          event.source,
          component.params.projectile_entity_charged,
          {
            x: 2,
            y: 0,
            z: 2,
          }
        );
      }
    },
  });
});
