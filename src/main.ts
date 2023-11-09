import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription(
      `描述信息:
      json信息:<a href="/api-docs-json" target="_blank">json格式接口信息</a>`,
    )
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
