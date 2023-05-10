import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as swagger from 'express-swagger-typescript';
import { ErrorResponse } from '@/common/responses/error.response';
import { config } from '@/configs';

const swaggerData: any = swagger.swaggerData({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My api',
      version: '1.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },

    },
    responses: {
      500: {
        content: {
          [swagger.SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: ErrorResponse },
          }
        },
        description: "500 Internal Server Error Response"
      },
    },
    externalDocs: {
      url: 'My url',
    },

  },
})

if (config.server.is_localhost) {
  fs.writeFileSync('swagger.yml', yaml.dump(swaggerData));

  console.log('Swagger YAML file created successfully.');
}

export default swaggerData;
