import { Column, ObjectIdColumn, Entity, ObjectID } from 'typeorm';
import { World, worldArray } from '../../../constants/world.consts';
import CombatStats from '../common/combatstats.embed';

@Entity({
  name: 'aggregate_global_factioncombat'
})
export default class FactionsCombat {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({
    type: 'enum',
    enum: worldArray,
  })
  world: World;

  @Column(() => CombatStats)
  vs: CombatStats;

  @Column(() => CombatStats)
  nc: CombatStats;

  @Column(() => CombatStats)
  tr: CombatStats;

  @Column(() => CombatStats)
  nso: CombatStats;

  @Column(() => CombatStats)
  totals: CombatStats;
}

