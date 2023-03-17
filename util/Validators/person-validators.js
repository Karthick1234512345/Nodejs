// const Joi = require('@hapi/joi');

// const getLoginPOSTSchema = Joi.object({

//   email: Joi.string()
//     .email()
//     .min(5)
//     .max(50)
//     .required(),
//   password: Joi.string().required(),
// });

// const sendOTPSchema = Joi.object({
//   userName: Joi.string().email().required(),
// });

// const verifyOTPSchema = Joi.object({
//   userName: Joi.string().email().required(),
//   otp: Joi.number(),
// });
// const ResetPasswordSchema = Joi.object({
//   temporaryPassword: Joi.string().required(),
//   newPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/m),
//   confirmPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$$/m),
// });
// const changePasswordSchema = Joi.object({
//   temporaryPassword: Joi.string().required(),
//   newPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/m),
//   confirmPassword: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$$/m),
// });
// const getResendSchema = Joi.object({
//   userName: Joi.string().email().required(),
// });

// const getpersonlogoutSchema = Joi.object({
//   userId: Joi.string().email().required(),
// });

// const createPersonSchema = Joi.object({
//   firstName: Joi.string().required(),
//   lastName: Joi.string().required(),
//   email: Joi.string().email().required(),
//   accountType: Joi.string().valid('I', 'C').required(),
//   phoneNumber: Joi.string().required(),
//   status: Joi.string().valid('active', 'inactive').required(),
// });
// const updatePersonSchema = Joi.object({
//   firstName: Joi.string().required(),
//   lastName: Joi.string().required(),
//   email: Joi.string().email().required(),
//   accountType: Joi.string().valid('I', 'C').required(),
//   phoneNumber: Joi.string().required(),
//   status: Joi.string().valid('active', 'inactive').required(),
// });

// const getuserNameSchema = Joi.object({
//   userName: Joi.string().required(),
// });
// module.exports = {
//   getLoginPOSTSchema,
//   sendOTPSchema,
//   verifyOTPSchema,
//   getResendSchema,
//   getpersonlogoutSchema,
//   ResetPasswordSchema,
//   changePasswordSchema,
//   createPersonSchema,
//   updatePersonSchema,
//   getuserNameSchema,
// };
