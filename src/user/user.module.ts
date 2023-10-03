import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Providers, Services } from 'src/utils/contants';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/utils/entity/user.entity';
import { DatabaseModule } from 'src/database/database.module';

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
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserEntity),
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
