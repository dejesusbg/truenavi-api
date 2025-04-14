import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
import auth from "./routes/auth";
import nodes from "./routes/nodes";
import edges from "./routes/edges";
import preferences from "./routes/preferences";
import routes from "./routes/routes";

const app = express();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/auth", auth);
app.use("/api/nodes", nodes);
app.use("/api/edges", edges);
app.use("/api/preferences", preferences);
app.use("/api/routes", routes);

app.get("/", (req, res) => {
  res.send("TrueNavi API is running...");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${(err as Error).message}`);
  server.close(() => process.exit(1));
});
