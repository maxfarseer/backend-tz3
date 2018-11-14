const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 5000;

export default {
  port,
  host,
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
  modules: ["users", "auth", "feeds"],
  recaptcha: {
    siteSecret: "6LecGmEUAAAAADXvFDUrR5OEVOgpJs7Nin9MxhO1"
  },
  google: {
    clientID:
      "247120247682-tvla5t1r1q4895mi0tgde9rafllqjjn7.apps.googleusercontent.com"
  }
};