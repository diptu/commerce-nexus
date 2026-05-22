import express from "express";

import userRoutes from "./routes/user.route.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("API Running");
});

// Mount Routes
app.use("/api/v1/users", userRoutes);

export default app;