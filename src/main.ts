import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CrudConfigService } from '@nestjsx/crud';
// import { USER_REQUEST_KEY } from './constants';

// Important: load config before (!!!) you import AppModule
// https://github.com/nestjsx/crud/wiki/Controllers#global-options
CrudConfigService.load({
    auth: {
        // property: 'auth',
    },
    routes: {
        // exclude: ['createManyBase'],
    },
    query: {
        alwaysPaginate: true,
        limit: 20,
        maxLimit: 50,
    },
});

import { HttpExceptionFilter } from './filter/exception/https-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());

    const options = new DocumentBuilder()
        .setTitle('LARQ')
        .setDescription('LARQ API description')
        .setVersion('2.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api/v2/docs', app, document);

    await app.listen(3000);
}

bootstrap();
