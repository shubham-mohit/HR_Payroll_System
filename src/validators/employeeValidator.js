import { body, param, validationResult } from 'express-validator';


const fullNameRule = body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name cannot be blank")
    .isLength({ min: 3, max: 100 })
    .withMessage("Full name must be 3-100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Full name contains invalid characters");

const emailRule = body('email')
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Invalid email address')
    .isLength({ max: 254 }).withMessage('Email too long');

const countryRule = body("country")
    .optional()
    .trim()
    .notEmpty().withMessage(`country cannot be blank`)
    .isLength({ min: 2, max: 50 }).withMessage(`country must be 2–50 characters`)
    .matches(/^[a-zA-Z\s'-]+$/).withMessage(`country contains invalid characters`);

const departmentRule = body("department")
    .optional()
    .trim()
    .notEmpty().withMessage(`department cannot be blank`)
    .isLength({ min: 2, max: 50 }).withMessage(`department must be 2–50 characters`)
    .matches(/^[a-zA-Z\s'-]+$/).withMessage(`department contains invalid characters`);

const jobTitleRole = body("jobTitle")
    .optional()
    .trim()
    .notEmpty().withMessage(`jobTitle cannot be blank`)
    .isLength({ min: 2, max: 50 }).withMessage(`jobTitle must be 2–50 characters`)
    .matches(/^[a-zA-Z\s'-]+$/).withMessage(`jobTitle contains invalid characters`);

const ageRule = body('age')
    .optional()
    .isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120')
    .toInt();


const salaryRule = body('salary')
    .optional()
    .isInt()
    .toInt()

const passwordRuleForLogin = body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character");



// ── Exported validators ───────────────────────────────────────────────────────

export const validateUpdateUser = [
    fullNameRule,
    emailRule,
    ageRule,
    departmentRule,
    jobTitleRole,
    countryRule,
    salaryRule,

    // At least one updatable field must be present
    body().custom((body) => {
        const allowed = ['fullName', 'email', 'age', 'department', 'jobTitle', 'country', 'salary'];
        const provided = Object.keys(body).filter((k) => allowed.includes(k));
        if (provided.length === 0) {
            throw new Error('Request body must contain at least one updatable field');
        }
        return true;
    }),

    // Block unknown fields (prevents mass-assignment)
    body().custom((body) => {
        const allowed = new Set(['fullName', 'email', 'age', 'department', 'jobTitle', 'country', 'salary']);
        const unknown = Object.keys(body).filter((k) => !allowed.has(k));
        if (unknown.length > 0) {
            throw new Error(`Unknown field(s): ${unknown.join(', ')}`);
        }
        return true;
    }),
];

export const valiadateCreateUser = [
    fullNameRule,
    emailRule,
    ageRule,
    departmentRule,
    jobTitleRole,
    countryRule,
    salaryRule,
    passwordRuleForLogin,

    body().custom((body) => {
        const allowed = new Set(['fullName', 'email', 'age', 'department', 'jobTitle', 'country', 'salary', 'password']);
        const unknown = Object.keys(body).filter((k) => !allowed.has(k));
        if (unknown.length > 0) {
            throw new Error(`Unknown field(s): ${unknown.join(', ')}`);
        }
        return true;
    }),
]

export const validateLoginUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  body().custom((body) => {
    const allowed = new Set(["email", "password"]);

    const unknown = Object.keys(body).filter(
      (k) => !allowed.has(k)
    );

    if (unknown.length > 0) {
      throw new Error(`Unknown field(s): ${unknown.join(", ")}`);
    }

    return true;
  }),
];

// Middleware to collect and return validation errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};
