import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacksService } from './packs.service';
import { PacksController } from './packs.controller';
import { Pack } from './pack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pack])],
  providers: [PacksService],
  controllers: [PacksController],
})
export class PacksModule {}
