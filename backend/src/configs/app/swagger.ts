import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import packageJson from '../../../package.json';

export const setSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder().setTitle('Cats example').setDescription('The cats API description').setVersion(packageJson.version).build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
};
