import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nodepop API',
            version: '1.0.0',
            description: 'API para la gestión de productos en Nodepop',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./routes/api.js'], // Importará las definiciones desde este archivo
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
