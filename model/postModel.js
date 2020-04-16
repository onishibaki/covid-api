const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment-timezone");

const postSchema = mongoose.Schema({
  country: String,
  covid_positive: Number,
  covid_death: Number,
  covid_recovered: Number,
  covid_date: { type: String, default: moment().tz("Asia/Tokyo").format("L") },
});

postSchema.methods.joiValidate = (obj) => {
  const schema = {
    country: Joi.types
      .String()
      .regex(/[a-zA-Z]/)
      .required()
      .message({
        "string.base": "Invalid type, Country must be a string",
        "string.empty": "Invalid type, Country must be a string",
        "string.pattern.base": "Country must contain only number",
        "any.required": "Country is required",
      }),
    covid_positive: Joi.types.Number().required(),
    covid_death: Joi.types.Number().required(),
    covid_recovered: Joi.types.Number().required(),
  };

  return Joi.validate(obj, schema);
};

module.exports = mongoose.model("covidUpdate", postSchema);
