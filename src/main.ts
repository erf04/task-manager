import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // useContainer(app.select(AppModule),{fallbackOnErrors:true});
  const config = new DocumentBuilder()
  .setTitle('Task Manager')
  .setDescription('API description')
  .setVersion('1.0')
  .build()
  
  const documentFactory = () => SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
