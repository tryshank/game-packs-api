import { DataSource } from 'typeorm';
import { Pack } from '../packs/pack.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Pack],
  synchronize: true, // Set to false in production to avoid data loss.
  logging: true,
});
