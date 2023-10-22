import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { Services } from 'src/utils/contants';
import { User, UserSchema } from 'src/utils/schema/';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController, AdminController],
  providers: [
    {
      provide: Services.USER_SERVICE,
      useClass: UserService,
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
