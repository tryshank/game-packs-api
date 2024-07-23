import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { PacksService } from './packs.service';
import { CreatePackDto } from './dto/create-pack.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('packs')
@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pack' })
  @ApiResponse({ status: 201, description: 'The pack has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreatePackDto })
  create(@Body() createPackDto: CreatePackDto) {
    return this.packsService.create(createPackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packs' })
  @ApiResponse({ status: 200, description: 'Successfully returned all packs.' })
  findAll() {
    return this.packsService.findAll();
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Get content of a pack including its child packs' })
  @ApiResponse({ status: 200, description: 'Successfully returned pack content.' })
  @ApiResponse({ status: 404, description: 'Pack not found.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the pack' })
  findContent(@Param('id') id: string) {
    if (!id) throw new BadRequestException('ID parameter is required');
    return this.packsService.findContent(id);
  }
}
