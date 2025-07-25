import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.use(cors({
  origin : process.env.CORS_ORIGIN,
  Credentials : true
}));

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())

// Routes import
import userRouter from "./routes/main/owner.user.routes.js";

app.use("/users", userRouter)


export { app }