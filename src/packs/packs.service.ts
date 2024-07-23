import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pack } from './pack.entity';
import { CreatePackDto } from './dto/create-pack.dto';

@Injectable()
export class PacksService {
  constructor(
    @InjectRepository(Pack)
    private readonly packsRepository: Repository<Pack>,
  ) {}

  async create(createPackDto: CreatePackDto): Promise<Pack> {
    try {
      if (!createPackDto.id) {
        throw new BadRequestException('Pack id is required');
      }

      const existingPack = await this.packsRepository.findOne({ where: { id: createPackDto.id } });
      if (existingPack) {
        throw new BadRequestException(`Pack with id ${createPackDto.id} already exists`);
      }

      const childPacks = await this.packsRepository.find({
        where: createPackDto.childPackIds.map(id => ({ id })),
      });

      if (childPacks.length !== createPackDto.childPackIds.length) {
        throw new BadRequestException('One or more child packs do not exist');
      }

      const pack = this.packsRepository.create(createPackDto);
      return await this.packsRepository.save(pack);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating the pack');
    }
  }

  async findAll(): Promise<Pack[]> {
    try {
      return await this.packsRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while retrieving the packs');
    }
  }

  async findContent(packId: string): Promise<string[]> {
    try {
      const contentSet = new Set<string>();

      const gatherContent = async (id: string) => {
        const currentPack = await this.packsRepository.findOne({ where: { id } });

        if (currentPack) {
          currentPack.content.forEach((item) => contentSet.add(item));

          const childPackIds = currentPack.childPackIds || [];
          for (const childPackId of childPackIds) {
            await gatherContent(childPackId);
          }
        }
      };

      await gatherContent(packId);
      return Array.from(contentSet);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while retrieving the pack content');
    }
  }
}
