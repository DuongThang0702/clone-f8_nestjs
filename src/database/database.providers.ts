import { DataSource } from 'typeorm';
import entities from '../utils/entity';
import { Providers } from 'src/utils/contants';
export const databaseProviders = [
  {
    provide: Providers.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true,
        entities,
      });

      return dataSource.initialize();
    },
  },
];
