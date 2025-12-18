let tenants = [];  

 exports.getAllTenants = (req, res) => {
  res.json(tenants);
};

 exports.addTenant = (req, res) => {
  const newTenant = {
    id: tenants.length + 1,
    ...req.body,
    created_at: new Date(),
    updated_at: new Date()
  };
  tenants.push(newTenant);
  res.status(201).json(newTenant);
};

 exports.updateTenant = (req, res) => {
  const id = parseInt(req.params.id);
  const tenant = tenants.find(t => t.id === id);
  if (!tenant) return res.status(404).json({ message: "Tenant not found" });

  tenant.payment_status = req.body.payment_status || tenant.payment_status;
  tenant.updated_at = new Date();
  res.json(tenant);
};

 exports.deleteTenant = (req, res) => {
  const id = parseInt(req.params.id);
  const index = tenants.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: "Tenant not found" });

  tenants.splice(index, 1);
  res.json({ message: "Tenant deleted successfully" });
};
