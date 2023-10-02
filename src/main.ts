import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT } = process.env;
  app.setGlobalPrefix('api');
  await app.listen(PORT, () => {
    console.log(`app is running with port: ${PORT}`);
  });
}
bootstrap();
