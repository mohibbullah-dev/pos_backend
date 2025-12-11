import dotenv from "dotenv";
import { app } from "./src/app.js";
import { PORT } from "./src/constant.js";
import { MONGODB_CONNECTION } from "./src/db/index.js";
dotenv.config({ path: "./env" });

MONGODB_CONNECTION()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on the port locolhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
