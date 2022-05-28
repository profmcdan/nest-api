import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Bookmarks API")
    .setDescription("The Bookmarks API")
    .setVersion("1.0")
    .addTag("bookmarks")
    .build();

    const options: SwaggerDocumentOptions = {
      deepScanRoutes: true,
    }

  const document = SwaggerModule.createDocument(app, config, options);
  
  SwaggerModule.setup('api/v1/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(3333);
}
bootstrap();
