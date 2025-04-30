import express from "express";

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
    res.send("API server running on http://localhost:8080");
});




app.listen(8080, () => {
    console.log("API server running on http://localhost:8080");
});