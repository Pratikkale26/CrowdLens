import express from "express";
import userRouter from "./routers/user";
import workerRouter from "./routers/worker";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("API server running on http://localhost:8080");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/worker", workerRouter);


app.listen(8080, () => {
    console.log("API server running on http://localhost:8080");
});