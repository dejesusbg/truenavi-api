const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require("./routes/auth");
const nodes = require("./routes/nodes");
const edges = require("./routes/edges");
const preferences = require("./routes/preferences");
const routes = require('./routes/routes');

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
app.use('/api/routes', routes);

app.get("/", (req, res) => {
  res.send("TrueNavi API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
