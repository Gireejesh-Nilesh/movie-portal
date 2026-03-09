const { z } = require("zod");

const signupSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().email(),
    password: z.string().min(6).max(128),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(6).max(128),
  }),
};

module.exports = {
  signupSchema,
  loginSchema,
};
