import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import upLoadImg from "./routes/uploadImage.js";
import "dotenv/config";

const app = express();

app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use("/auth", authRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/uploadImg", upLoadImg);

app.get("/", (req, res) => {
  res.send("OK...my message");
});

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server listening on port " + process.env.PORT);
  });
});
