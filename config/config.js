/**
 * port
 */
process.env.PORT = process.env.PORT ? process.env.PORT : 8080;

/**
 * Environment
 */
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";

/**
 * Token expiration
 */
process.env.TOKEN_DURATION = "1h";

/**
 * Authentication SEED
 */
process.env.SEED_TOKEN = process.env.SEED_TOKEN
  ? process.env.SEED_TOKEN
  : "somesupersecretsecret";

/**
 * Databases
 */
let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB =
    "mongodb+srv://mern_user:yqgUWiCPZaaGExOs@cluster0.bpinj.mongodb.net/messages?retryWrites=true";
} else {
  urlDB = process.env.MONGO_URI;
}

/**
 * Creation of the environment
 */
process.env.URLDB = urlDB;
