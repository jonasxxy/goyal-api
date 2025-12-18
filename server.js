require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const xml2js = require("xml2js");

const app = express();

 app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 app.use((req, res, next) => {
  if (req.is("application/xml")) {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end", () => {
      xml2js.parseString(data, { explicitArray: false }, (err, result) => {
        if (err) return res.status(400).json({ error: "Invalid XML format" });
        req.body = result.tenant || result;
        next();
      });
    });
  } else {
    next();
  }
});

 app.use(express.static(path.join(__dirname, "public")));
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  ssl: { rejectUnauthorized: false }
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("DB connection failed:", err);
    // Still start the server to avoid hanging Railway
  } else {
    console.log("MySQL Connected!");
    connection.release();
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

 
app.get("/api/tenants", (req, res) => {
  db.query("SELECT * FROM tenants", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

 app.get("/api/tenants/:id", (req, res) => {
  db.query(
    "SELECT * FROM tenants WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: "Tenant not found" });
      res.status(200).json(results[0]);
    }
  );
});

 app.post("/api/tenants", (req, res) => {
  const { name, room_number, contact, monthly_rent } = req.body;
  if (!name || !room_number || !contact || !monthly_rent) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.query(
    "INSERT INTO tenants (name, room_number, contact, monthly_rent) VALUES (?, ?, ?, ?)",
    [name, room_number, contact, monthly_rent],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Tenant created successfully", id: result.insertId });
    }
  );
});

 app.put("/api/tenants/:id", (req, res) => {
  const { name, room_number, contact, monthly_rent } = req.body;
  if (!name || !room_number || !contact || !monthly_rent) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.query(
    "UPDATE tenants SET name=?, room_number=?, contact=?, monthly_rent=? WHERE id=?",
    [name, room_number, contact, monthly_rent, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Tenant not found" });
      res.status(200).json({ message: "Tenant updated successfully" });
    }
  );
});

 app.delete("/api/tenants/:id", (req, res) => {
  db.query(
    "DELETE FROM tenants WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Tenant not found" });
      res.status(200).json({ message: "Tenant deleted successfully" });
    }
  );
});

 app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

 