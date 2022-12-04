import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { PORT, NODE_ENV, MONGO_URI, SESS_NAME, SESS_SECRET, SESS_LIFETIME } from "./config";
import { userRoutes } from "./routes";

(async () => {
  try {
    const mongoClient =  mongoose.connect(MONGO_URI, ({useNewUrlParser: true})).then((db) => db.connection.getClient())
    console.log('mongodb connected')

    const app = express();

    //middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.disable("x-powered-by");

    app.use(session({
      name: SESS_NAME,
      secret: SESS_SECRET,
      saveUninitialized: false,
      resave: false,
      store: MongoStore.create({
        clientPromise: mongoClient,
        collection: 'session',
        ttl: parseInt(SESS_LIFETIME) / 1000
      }),
      cookie:{
        sameSite: true,
        secure: NODE_ENV === "production",
        maxAge: parseInt(SESS_LIFETIME)
      }
    }))

    const apiRouter = express.Router();
    app.use("/api", apiRouter);
    apiRouter.use("/user", userRoutes);

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
})();
