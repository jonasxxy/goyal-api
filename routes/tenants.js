const express = require("express");
const db = require("../config/db");

const router = express.Router();

 router.get("/", (req, res) => {
  db.query("SELECT * FROM tenants", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

 router.get("/:id", (req, res) => {
  db.query("SELECT * FROM tenants WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Tenant not found" });
    res.json(results[0]);
  });
});

 router.post("/", (req, res) => {
  const { name, room_number, contact, monthly_rent } = req.body;
  if (!name || !room_number || !contact || !monthly_rent)
    return res.status(400).json({ error: "All fields are required" });

  db.query(
    "INSERT INTO tenants (name, room_number, contact, monthly_rent) VALUES (?, ?, ?, ?)",
    [name, room_number, contact, monthly_rent],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query("SELECT * FROM tenants WHERE id = ?", [result.insertId], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(rows);  
      });
    }
  );
});

 router.put("/:id", (req, res) => {
  const { name, room_number, contact, monthly_rent } = req.body;
  db.query(
    "UPDATE tenants SET name=?, room_number=?, contact=?, monthly_rent=? WHERE id=?",
    [name, room_number, contact, monthly_rent, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Tenant not found" });
      res.json({ message: "Tenant updated successfully" });
    }
  );
});

 router.delete("/:id", (req, res) => {
  db.query("DELETE FROM tenants WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Tenant not found" });
    res.json({ message: "Tenant deleted successfully" });
  });
});

module.exports = router;
