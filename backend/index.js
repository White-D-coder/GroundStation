import 'dotenv/config';
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import startSerial from "./serialmonitor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(express.static(path.join(__dirname, ".."))); // Serve from parent directory where index.html is located
app.use(express.json());

// ====================================
// DATABASE CONNECTION POOL
// ====================================
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "djdevil09876",
  database: "GroundStation"
});

app.get("/api/data", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT id, value, voltage, timestamp FROM potentiometer_readings ORDER BY timestamp DESC LIMIT 1000"
    );
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/export/csv", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT id, value, voltage, timestamp FROM potentiometer_readings ORDER BY timestamp DESC"
    );
    connection.release();

    const parser = new Parser({
      fields: ["id", "value", "voltage", "timestamp"]
    });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", `attachment; filename="sensor-data-${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ====================================
// API: EXPORT TO XLSX
// ====================================
app.get("/api/export/xlsx", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT id, value, voltage, timestamp FROM potentiometer_readings ORDER BY timestamp DESC"
    );
    connection.release();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sensor Data");

    // Add headers
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "ADC Value", key: "value", width: 12 },
      { header: "Voltage (V)", key: "voltage", width: 15 },
      { header: "Timestamp", key: "timestamp", width: 25 }
    ];

    // Add data rows
    rows.forEach(row => {
      worksheet.addRow(row);
    });

    // Style header
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF667eea" } };

    res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.header("Content-Disposition", `attachment; filename="sensor-data-${Date.now()}.xlsx"`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("XLSX Export Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ====================================
// API: GET LATEST DATA POINT
// ====================================
app.get("/api/latest", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT id, value, voltage, timestamp FROM potentiometer_readings ORDER BY timestamp DESC LIMIT 1"
    );
    connection.release();
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start serial communication and data emission
startSerial(io);

// Start the server
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📊 CSV Export: http://localhost:${PORT}/api/export/csv`);
  console.log(`📈 XLSX Export: http://localhost:${PORT}/api/export/xlsx`);
});