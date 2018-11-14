const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 5000;

export default {
  port,
  host,
  // jwt token
  token: "secret-jwt-token",
  database: {
    host: process.env.DB_HOST || "localhost",
    databaseName: process.env.DB_NAME || "mm",
    port: process.env.DB_PORT || 27019,
    options: {
      autoIndex: false,
      connectTimeoutMS: 1000,
      user: process.env.DB_USER,
      pass: process.env.DB_PASSWORD,
      auth: {
        authdb: process.env.DB_AUTHSOURCE
      }
    }
  },
  // List of modules enabled in app, loaded from src/modules
  modules: ["users", "auth", "feeds"],
  recaptcha: {
    siteSecret: "6LecGmEUAAAAADXvFDUrR5OEVOgpJs7Nin9MxhO1"
  },
  google: {
    clientID:
      "197441299861-7f1p4sh7drtbg46bk5s1i8sgvnbm1ovd.apps.googleusercontent.com"
  }
};
