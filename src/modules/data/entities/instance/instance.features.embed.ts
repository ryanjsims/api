import {ApiProperty} from '@nestjs/swagger';
import {Column} from 'typeorm';

export default class InstanceFeaturesEmbed{
    @ApiProperty({example: true, description: 'Whether Capture History was captured on this instance'})
    @Column({
        type: 'boolean',
        default: false,
    })
    captureHistory: boolean;
}
