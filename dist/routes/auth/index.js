"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const user_router_1 = tslib_1.__importDefault(require("./user.router"));
const session_router_1 = tslib_1.__importDefault(require("./session.router"));
const googleOauth_router_1 = tslib_1.__importDefault(require("./googleOauth.router"));
const router = express_1.default.Router();
router.use(user_router_1.default);
router.use(session_router_1.default);
router.use(googleOauth_router_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map