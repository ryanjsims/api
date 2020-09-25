import {BadRequestException, Controller} from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RmqContext} from '@nestjs/microservices';
import AggregatorMessageInterface from '../../interfaces/AggregatorMessageInterface';
import AggregatorBaseController from '../AggregatorBaseController';
import {MQAcceptedPatterns} from '../../../data/constants/MQAcceptedPatterns';
import InstanceFacilityControlEntity from '../../../data/entities/instance/instance.facilitycontrol.entity';

@Controller()
export default class AggregatorInstanceDeathEventController extends AggregatorBaseController {
    @MessagePattern(MQAcceptedPatterns.INSTANCE_FACILITY_CONTROL)
    public async process(@Payload() data: AggregatorMessageInterface, @Ctx() context: RmqContext): Promise<void> {
        try {
            await this.create(data, context, InstanceFacilityControlEntity);
        } catch (err) {
            throw new BadRequestException('Unable to process message!', MQAcceptedPatterns.INSTANCE_FACILITY_CONTROL);
        }
    }
}
