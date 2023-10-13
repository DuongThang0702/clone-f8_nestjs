import { Providers } from 'src/utils/contants';
import mongoose from 'mongoose';
export const databaseProviders = [
  {
    provide: Providers.DATA_SOURCE,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.URL_MONGOOSE),
  },
];
