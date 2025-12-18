const Joi = require("joi");

exports.paymentSchema = Joi.object({
  tenant_name: Joi.string().min(3).required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().required()
});

exports.updateStatusSchema = Joi.object({
  status: Joi.string().valid("PENDING", "PAID", "FAILED").required()
});
