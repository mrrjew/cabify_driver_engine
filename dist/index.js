"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const development_1 = tslib_1.__importDefault(require("./development"));
const production_1 = tslib_1.__importDefault(require("./production"));
const config = process.env.NODE_ENV === 'development' ? development_1.default : production_1.default;
exports.default = config;
//# sourceMappingURL=index.js.map