const AppError = require("../utils/app-error");

const validate = (schema) => (req, res, next) => {
  try {
    const targets = ["body", "query", "params"];

    for (const target of targets) {
      if (!schema[target]) {
        continue;
      }

      const parsed = schema[target].safeParse(req[target]);
      if (!parsed.success) {
        const message = parsed.error.issues
          .map((issue) => `${issue.path.join(".") || target}: ${issue.message}`)
          .join("; ");
        throw new AppError(`Validation error - ${message}`, 400);
      }

      req[target] = parsed.data;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
