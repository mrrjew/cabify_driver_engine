"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const log_1 = tslib_1.__importDefault(require("../utils/log"));
// user
const user_1 = tslib_1.__importDefault(require("./user/user"));
function initDB(config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_1.connect)(config.uri, { autoIndex: true });
            log_1.default.info('Connected to database successfully');
            yield user_1.default.createCollection();
            return {
                User: user_1.default
            };
        }
        catch (e) {
            throw new Error(`Error while connecting to database : ${e}`);
        }
    });
}
exports.default = initDB;
//# sourceMappingURL=index.js.map