import {BadRequestException, Controller} from '@nestjs/common';
import {Ctx, MessagePattern, Payload, RmqContext} from '@nestjs/microservices';
import AggregatorBaseController from '../../AggregatorBaseController';
import {MQAcceptedPatterns} from '../../../../data/constants/MQAcceptedPatterns';
import AggregatorMessageInterface from '../../../interfaces/AggregatorMessageInterface';
import InstanceFacilityControlAggregateEntity from '../../../../data/entities/aggregate/instance/instance.facility.control.aggregate.entity';

@Controller()
export default class AggregatorInstanceFacilityControlAggregateController extends AggregatorBaseController {
    @MessagePattern(MQAcceptedPatterns.INSTANCE_FACILITY_CONTROL_AGGREGATE)
    public async process(@Payload() data: AggregatorMessageInterface, @Ctx() context: RmqContext): Promise<void> {
        try {
            await this.update(data, context, InstanceFacilityControlAggregateEntity);
        } catch (err) {
            throw new BadRequestException('Unable to process message!', MQAcceptedPatterns.INSTANCE_FACILITY_CONTROL_AGGREGATE);
        }
    }
}
