import { readFileSync } from "fs";

require("@/configs/dotenv.config");

export default {
  server: {
    host:
      process.env["HOST_NAME"] || `localhost:${process.env["PORT"] || 8765}`,
    protocol: "http",
    debug: true,
    name: "LOCAL NAME",
    port: process.env["PORT"] || 8765,
    secret: process.env["SERVER_SECRET"] || "SERVER_SECRET",
    is_localhost: process.env["IS_LOCALHOST"] == "true",
    logger: process.env["LOGGER"] ? JSON.parse(`${process.env["LOGGER"]}`) : [],
    path_images: "images",
    path_files: "files",
    path_audio: "audio",
    public_key: process.env["PATH_PUBLIC_KEY"] || "public_key.pem",
    private_key: process.env["PATH_PRIVATE_KEY"] || "public_key.pem",
    timezone: process.env["DEFAULT_TIME_ZONE"] || "+0700",
  },
  service: {
    identity: {
      url: process.env["URL_IDENTITY_SERVICE"] || "http://localhost:4000",
      path_public_key: process.env["IDENTITY_PATH_PUBLIC_KEY"] || "identity_public_key.pem",
      path_private_key: process.env["IDENTITY_PATH_PRIVATE_KEY"] || "identity_private_key.pem",
      public_key: readFileSync(process.env["IDENTITY_PATH_PUBLIC_KEY"] || "identity_public_key.pem") || ""
    },
  },
  socket: {
    port: process.env["PORT_SOCKET"] || 8686,
  },
  database: {
    mongo: process.env["MONGODB_URI"],
    sessionSecret: process.env["SESSION_SECRET"],
    defaultPageSize: 50,
    sql: {
      username: process.env["DB_USER"] || "",
      password: process.env["DB_PASS"] || "",
      database: process.env["DB_NAME"] || "",
      host: process.env["DB_HOST"] || "",
      timezone: process.env["DB_TIMEZONE"] || "+00:00",
      port: process.env["DB_PORT"] || 5432,
      url: process.env["DATABASE_URL_WITH_SCHEMA"] || "",
      dialect: "postgresql",
    },
  },
  firebase: {
    title: process.env["FIREBASE_TITLE"],
    type: process.env["FIREBASE_TYPE"],
    project_id: process.env["FIREBASE_PROJECT_ID"],
    private_key_id: process.env["FIREBASE_PRIVATE_KEY_ID"],
    private_key: process.env["FIREBASE_PRIVATE_KEY"]?.replace(/\\n/g, "\n"),
    client_email: process.env["FIREBASE_CLIENT_EMAIL"],
    client_id: process.env["FIREBASE_CLIENT_ID"],
    auth_uri: process.env["FIREBASE_AUTH_URI"],
    token_uri: process.env["FIREBASE_TOKEN_URI"],
    auth_provider_x509_cert_url:
      process.env["FIREBASE_AUTH_PROVIDER_X509_CERT_URL"],
    client_x509_cert_url: process.env["FIREBASE_CLIENT_X509_CERT_URL"],
  },
  firebaseDbURL: process.env["FIREBASE_DATABASE_URL"],
};
