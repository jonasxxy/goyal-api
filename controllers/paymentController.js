const db = require("../config/db");
const { paymentSchema, updateStatusSchema } = require("../validators/paymentValidator");


exports.getPayments = (req, res) => {
  db.query("SELECT * FROM payments", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json(results);
  });
};


exports.createPayment = (req, res) => {
  const { error } = paymentSchema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }

  const { tenant_name, amount, method } = req.body;

  db.query(
    "INSERT INTO payments (tenant_name, amount, method) VALUES (?, ?, ?)",
    [tenant_name, amount, method],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Insert failed" });
      }
      res.status(201).json({
        message: "Payment created successfully",
        id: result.insertId
      });
    }
  );
};


exports.updatePaymentStatus = (req, res) => {
  const { error } = updateStatusSchema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details[0].message });
  }

  const { status } = req.body;

  db.query(
    "UPDATE payments SET status=? WHERE id=?",
    [status, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Update error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.status(200).json({ message: "Payment status updated" });
    }
  );
};
