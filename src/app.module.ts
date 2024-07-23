import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PacksModule } from './packs/packs.module';
import { HealthController } from './health/health.controller';
import { AppDataSource } from './config/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    PacksModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
