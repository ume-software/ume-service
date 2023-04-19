import { databaseConfig } from "./database"

require('dotenv').config()

export default {
    server: {
        host: 'localhost',
        protocol: 'http',
        debug: true,
        name: 'LOCAL NAME',
        port: process.env["DEV_PORT"] || 8765,
        secret: process.env["DEV_SERVER_SECRET"] || "DEV_SERVER_SECRET",
        is_localhost: process.env["DEV_IS_LOCALHOST"] == 'true',
        logger: process.env["DEV_LOGGER"] ? JSON.parse(`${process.env["DEV_LOGGER"]}`) : [],
        path_images: 'images',
        path_files: 'files',
        public_key: process.env["DEV_PATH_PUBLIC_KEY"] || "booking_public_key.pem",
        private_key: process.env["DEV_PATH_PRIVATE_KEY"] || "booking_private_key.pem",
    },
    service: {
        identity: {
            url: process.env["DEV_URL_IDENTITY_SERVICE"] || "http://localhost:5000",
            public_key: process.env["DEV_INDENTITY_PATH_PUBLIC_KEY"] || "identity_public_key.pem"
        }
    },
    socket: {
        port: process.env["DEV_PORT_SOCKET"] || 8686
    },
    database: {
        mongo: process.env["DEV_MONGODB_URI"],
        sessionSecret: process.env["DEV_SESSION_SECRET"],
        defaultPageSize: 50,
        sql: databaseConfig.development
    },
    firebase: {
        title: process.env["FIREBASE_TITLE"],
        type: process.env["FIREBASE_TYPE"],
        project_id: process.env["FIREBASE_PROJECT_ID"],
        private_key_id: process.env["FIREBASE_PRIVATE_KEY_ID"],
        private_key: process.env["FIREBASE_PRIVATE_KEY"]?.replace(/\\n/g, '\n'),
        client_email: process.env["FIREBASE_CLIENT_EMAIL"],
        client_id: process.env["FIREBASE_CLIENT_ID"],
        auth_uri: process.env["FIREBASE_AUTH_URI"],
        token_uri: process.env["FIREBASE_TOKEN_URI"],
        auth_provider_x509_cert_url: process.env["FIREBASE_AUTH_PROVIDER_X509_CERT_URL"],
        client_x509_cert_url: process.env["FIREBASE_CLIENT_X509_CERT_URL"]
    },
    firebaseDbURL: process.env["FIREBASE_DATABASE_URL"]
}
