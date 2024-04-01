"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const pino_1 = tslib_1.__importDefault(require("pino"));
const config_1 = tslib_1.__importDefault(require("../config"));
const level = config_1.default.logger.level;
const log = (0, pino_1.default)({
    transport: {
        target: 'pino-pretty',
    },
    level,
    base: {
        pid: false,
    },
    timestamp: () => `,"Time:" "${(0, dayjs_1.default)().format()}"`
});
exports.default = log;
//# sourceMappingURL=log.js.map