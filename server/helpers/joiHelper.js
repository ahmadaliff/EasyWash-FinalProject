const joi = require("joi");
const { handleClientError } = require("./handleResponseHelper");

//Function to return error status and hanlde response
exports.validateJoi = (res, data, schema, field = null) => {
  const { error } = handleValidateJoi(data, schema, field);
  if (error) {
    return {
      error: true,
      handleRes: handleClientError(res, 400, error.details[0].message),
    };
  }
  return { error: false, handleRes: null };
};

//Function validate with joi and dynamic schema
const handleValidateJoi = (data, schema, field) => {
  if (!field) {
    return joi.object(schema).validate(data);
  } else {
    const dynamicSchema = Object.keys(schema)
      .filter((key) => field.includes(key))
      .reduce((obj, key) => {
        obj[key] = schema[key];
        return obj;
      }, {});
    return joi.object(dynamicSchema).validate(data);
  }
};

//Schema User
exports.schemaUser = {
  fullName: joi.string().min(3).required(),
  phone: joi.string().min(6).max(15).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  role: joi.string().required(),
};

//Schema Merchant
exports.schemaMerchant = {
  name: joi.string().required(),
  description: joi.string().required(),
  imagePath: joi.string().optional(),
  userId: joi.number().optional(),
  location: joi.string().optional(),
  isVerified: joi.boolean().optional(),
};

//Schema Service
exports.schemaService = {
  name: joi.string().required(),
  price: joi.number().required(),
  isUnit: joi.boolean().required(),
};
