import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";
import { buildCanvaHandoff } from "./services/canvaService.js";
import "./lib/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS allows the local frontend to talk to the backend cleanly.
const allowedOrigins = [
  "http://localhost:5173",
  "https://contenteditor.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/server requests
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());
app.use(express.json());

// Health check route.
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Server is running."
  });
});

// Main AI routes.
app.use("/api/ai", aiRoutes);

// Canva handoff route.
// This is a practical bridge, not a fake direct Magic Write API.
app.post("/api/canva/handoff", (req, res) => {
  const { text = "", title = "Generated content" } = req.body || {};
  const handoff = buildCanvaHandoff({ text, title });
  res.json(handoff);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
