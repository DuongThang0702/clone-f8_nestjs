import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Providers, Services } from 'src/utils/contants';
import { User, UserSchema } from 'src/utils/schema/user.schema';
import { DatabaseModule } from 'src/database/database.module';
import { Connection } from 'mongoose';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    {
      provide: Services.USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: Providers.USER_REPOSITORY,
      useFactory: (connection: Connection) =>
        connection.model(User.name, UserSchema),
      inject: [`${Providers.DATA_SOURCE}`],
    },
  ],
  exports: [
    {
      provide: Services.USER_SERVICE,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
