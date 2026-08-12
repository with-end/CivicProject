const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const dbConnect = require("./config/dbConnect.js");
const cloudinaryConfig = require("./config/cloudinaryConfig.js");
const { PORT, FRONTEND_URL } = require("./config/dotenv.config.js");

const nagarPalikaRoutes = require("./routes/nagarPalika.js");
const ReportRoutes = require("./routes/Report.js");
const departmentRoutes = require("./routes/department.js");
const officersRoutes = require("./routes/officer.js");
const translationRoutes = require("./routes/translation.js");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Backend is live now updated");
});

app.use("/api/nagarpalika", nagarPalikaRoutes);
app.use("/api/reports", ReportRoutes);
app.use("/api", departmentRoutes);
app.use("/api/officer", officersRoutes);
app.use("/api", translationRoutes);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("updateFrontend", (data) => {
    console.log("Frontend update received:", data);
    socket.broadcast.emit("updateFrontend", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on the port :${PORT}`);
  dbConnect();
  cloudinaryConfig();
});