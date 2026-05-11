import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { SerializeResponseInterceptor } from './common/interceptors/serialize-response.interceptor';

interface ConfigureAppOptions {
  enableSwagger?: boolean;
}

export function configureApp(app: INestApplication, options: ConfigureAppOptions = {}): void {
  const { enableSwagger = true } = options;

  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)));
  app.useGlobalInterceptors(new SerializeResponseInterceptor());

  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Rural Producers API')
      .setDescription('API REST para cadastro de produtores rurais, fazendas, safras, culturas e dashboard.')
      .setVersion('1.0.0')
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));
  }
}
