const { z } = require("zod");

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(25),
    email: z.string().email(),
    phone: z.string().min(8).max(20),
    password: z.string().min(6),
  }),
});

module.exports = { signupSchema };
