"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const security_1 = require("../middleware/security");
const router = (0, express_1.Router)();
// Apply rate limiting to auth routes
router.use(security_1.authLimiter);
// POST /api/auth/register
router.post('/register', authController_1.register);
// POST /api/auth/login
router.post('/login', authController_1.login);
// GET /api/auth/profile (protected)
router.get('/profile', auth_1.authenticateToken, authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map