import {Zone} from './zone';
import {Faction} from './faction';

export enum MetagameEventType {
    // Current Generation normal alerts
    INDAR_SUPERIORITY = 147,
    INDAR_ENLIGHTENMENT = 148,
    INDAR_LIBERATION = 149,
    ESAMIR_SUPERIORITY = 150,
    ESAMIR_ENLIGHTENMENT = 151,
    ESAMIR_LIBERATION = 152,
    HOSSIN_SUPERIORITY = 153,
    HOSSIN_ENLIGHTENMENT = 154,
    HOSSIN_LIBERATION = 155,
    AMERISH_SUPERIORITY = 156,
    AMERISH_ENLIGHTENMENT = 157,
    AMERISH_LIBERATION = 158,

    // Current Generation Unstable Meltdowns, presumably based off faction trigger
    // TODO: VERIFY FACTION TRIGGERS https://github.com/ps2alerts/websocket/issues/138
    ESAMIR_UNSTABLE_MELTDOWN = 176,
    HOSSIN_UNSTABLE_MELTDOWN = 177,
    AMERISH_UNSTABLE_MELTDOWN = 178,
    INDAR_UNSTABLE_MELTDOWN = 179,

    ESAMIR_UNSTABLE_MELTDOWN_2 = 186,
    HOSSIN_UNSTABLE_MELTDOWN_2 = 187,
    AMERISH_UNSTABLE_MELTDOWN_2 = 188,
    INDAR_UNSTABLE_MELTDOWN_2 = 189,

    ESAMIR_UNSTABLE_MELTDOWN_3 = 190,
    HOSSIN_UNSTABLE_MELTDOWN_3 = 191,
    AMERISH_UNSTABLE_MELTDOWN_3 = 192,
    INDAR_UNSTABLE_MELTDOWN_3 = 193,
}

export const metagameEventTypeArray = [
    147,
    148,
    149,
    150,
    151,
    152,
    153,
    154,
    155,
    156,
    157,
    158,
    176,
    177,
    178,
    179,
    186,
    189,
    191,
    193,
    208,
    209,
    210,
];

const longAlert = 90 * 60 * 1000;
const shortAlert = 45 * 60 * 1000;
