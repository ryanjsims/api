import {Column, ObjectIdColumn, Entity, Index, ObjectID} from "typeorm";
import {World, worldArray} from '../../../constants/world';
import {FacilityControlFaction} from "../common/facility-control-faction";

@Entity()
@Index(["facility", "world"], {unique: true})
export class FactionsFacilityControlEntity {
    @ObjectIdColumn()
    _id: ObjectID;

    @Column({
        type: "number",
        nullable: false
    })
    facility: number;

    @Column({
        type: "enum",
        enum: worldArray,
        nullable: false
    })
    world: World;

    @Column(type => FacilityControlFaction)
    vs: FacilityControlFaction;

    @Column(type => FacilityControlFaction)
    nc: FacilityControlFaction;

    @Column(type => FacilityControlFaction)
    tr: FacilityControlFaction;

    // No NSO, they cannot capture bases on behalf of their faction. Their outfits can though strangely!

    @Column(type => FacilityControlFaction)
    totals: FacilityControlFaction;
}
