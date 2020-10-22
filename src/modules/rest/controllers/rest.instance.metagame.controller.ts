import {ClassSerializerInterceptor, Controller, Get, Inject, Param, Query, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import InstanceMetagameTerritoryEntity from '../../data/entities/instance/instance.metagame.territory.entity';
import MongoOperationsService from '../../../services/mongo/mongo.operations.service';
import {Ps2alertsEventState} from '../../data/constants/eventstate.consts';
import {OptionalIntPipe} from '../pipes/OptionalIntPIpe';
import {World} from '../../data/constants/world.consts';
import {ApiImplicitQuery} from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';
import {WORLD_IMPLICIT_QUERY} from './common/rest.world.query';
import Pagination from '../../../services/mongo/pagination';

@ApiTags('Instances')
@Controller('instances')
export class RestInstanceMetagameController {
    constructor(
        @Inject(MongoOperationsService) private readonly mongoOperationsService: MongoOperationsService,
    ) {}

    @Get('/:instance')
    @ApiOperation({summary: 'Returns a single metagame instance'})
    @ApiResponse({
        status: 200,
        description: 'The Metagame Instance',
        type: InstanceMetagameTerritoryEntity,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('instance') instanceId: string): Promise<InstanceMetagameTerritoryEntity> {
        return await this.mongoOperationsService.findOne(InstanceMetagameTerritoryEntity, {instanceId});
    }

    @Get('/active')
    @ApiOperation({summary: 'Returns all currently running metagame instances, optionally requested by world'})
    @ApiImplicitQuery(WORLD_IMPLICIT_QUERY)
    @ApiResponse({
        status: 200,
        description: 'A list of active metagame instances',
        type: InstanceMetagameTerritoryEntity,
        isArray: true,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    async findActives(
        @Query('world', OptionalIntPipe) world?: World, 
        @Query('sortBy') sortBy?: string, 
        @Query('order') order?: string, 
        @Query('page', OptionalIntPipe) page?: number,
        @Query('pageSize', OptionalIntPipe) pageSize?: number): Promise<InstanceMetagameTerritoryEntity[]> {
        var worldObject: {[k: string]: any} = {state: Ps2alertsEventState.STARTED};
        if(world) worldObject.world = world;
        return await this.mongoOperationsService.findMany(InstanceMetagameTerritoryEntity, worldObject, Pagination.create(sortBy, order, page, pageSize));
    }

    @Get('/territory-control')
    @ApiOperation({summary: 'Return a paginated list of metagame territory control instances, optionally requested by world'})
    @ApiImplicitQuery(WORLD_IMPLICIT_QUERY)
    @ApiResponse({
        status: 200,
        description: 'List of MetagameTerritory Instances',
        type: InstanceMetagameTerritoryEntity,
        isArray: true,
    })
    async findAllTerritoryControl(@Query('world', OptionalIntPipe) world?: World): Promise<InstanceMetagameTerritoryEntity[]> {
        return world
            ? await this.mongoOperationsService.findMany(InstanceMetagameTerritoryEntity, {world})
            : await this.mongoOperationsService.findMany(InstanceMetagameTerritoryEntity);
    }

}
