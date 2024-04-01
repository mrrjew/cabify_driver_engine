"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//user
const user_1 = tslib_1.__importDefault(require("./user"));
const session_1 = tslib_1.__importDefault(require("./session"));
function initServices(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return {
            UserService: new user_1.default(context),
            UserSessionService: new session_1.default(context),
        };
    });
}
exports.default = initServices;
//# sourceMappingURL=index.js.map