"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = tslib_1.__importDefault(require("../types/app"));
const sms_1 = tslib_1.__importDefault(require("../utils/sms"));
const log_1 = tslib_1.__importDefault(require("../utils/log"));
const otp_generator_1 = tslib_1.__importDefault(require("otp-generator"));
class UserService extends app_1.default {
    constructor(context) {
        super(context);
    }
    // registers user
    registerUser(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber } = req.body;
                if (!phoneNumber) {
                    res.status(422).send('no input was received');
                }
                const _user = yield this.models.User.findOne({ phoneNumber });
                if (_user)
                    throw new Error('User already exists');
                const user = new this.models.User({ phoneNumber });
                yield user.save();
                yield (0, sms_1.default)(phoneNumber, `This is your cab app verification code: ${user.verificationCode}. Thank you for signing up.`);
                return user;
            }
            catch (e) {
                res.status(500).send(`Error creating new user: ${e}`);
            }
        });
    }
    //verifies user
    verifyUser(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { id, verificationCode } = req.body;
            if (!id || !verificationCode) {
                res.status(422).send('missing required fields');
            }
            try {
                // Find the user by Id
                const user = yield this.authenticate_user(id);
                // Check if the user is already verified
                if (user.verified) {
                    res.status(500).send('user is already verified');
                }
                // Check if verificationCode matches
                if (user.verificationCode != verificationCode) {
                    res.status(500).send('Invalid verification code');
                }
                // Set verified to true and save user
                user.verified = true;
                yield user.save();
                return true;
            }
            catch (e) {
                res.status(500).send(`Error validating user: ${e}`);
            }
        });
    }
    // sends password reset code to user's email
    forgotPassword(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber } = req.body;
                if (!phoneNumber) {
                    res.status(422).send('no input received');
                }
                const user = yield this.models.User.findOne({ phoneNumber });
                if (!user) {
                    res.status(404).send('user not found');
                }
                if (!user.verified) {
                    res.status(500).send('user is not verified');
                }
                const passwordResetCode = otp_generator_1.default.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                user.passwordResetCode = passwordResetCode;
                yield user.save();
                yield (0, sms_1.default)(phoneNumber, `This is your cab app password reset code:${user.passwordResetCode}`);
                log_1.default.debug(`Password reset code sent to ${user.phoneNumber}`);
                const message = 'password reset code sent';
                return message;
            }
            catch (e) {
                res.status(500).send(`error handing password reset: ${e}`);
            }
        });
    }
    // resets user's password to new password from email
    resetPassword(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const { id, passwordResetCode, newPassword } = req.body;
                if (!id || !passwordResetCode || !newPassword) {
                    res.status(422).send('missing required fields');
                }
                const user = yield this.authenticate_user(id);
                if (!user || user.passwordResetCode !== passwordResetCode) {
                    res.status(404).send('Could not reset password');
                }
                user.passwordResetCode = null;
                user.password = newPassword;
                yield user.save();
                const message = 'Successfully updated password';
                return message;
            }
            catch (e) {
                res.status(500).send('error reseting password');
            }
        });
    }
    // login user
    loginUser(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { phoneNumber, password } = req.body;
            if (!phoneNumber || !password) {
                res.status(500).send('missing required fields');
            }
            const user = yield this.models.User.findOne({ phoneNumber });
            if (!user) {
                res.status(404).send('user not found');
            }
            try {
                const valid = yield user.validatePassword(password);
                if (!valid) {
                    res.status(500).send('password incorrect');
                }
            }
            catch (e) {
                res.status(500).send('error logging in');
            }
            return user;
        });
    }
    // updates user details
    updateUser(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authenticate_user(req.user._id);
                if ('rating' in req.body) {
                    user.rating = req.body.rating;
                }
                else {
                    if (user._id.toString() !== req.user._id.toString()) {
                        throw new Error(`Unauthorized: Cannot update another user's details`);
                    }
                    for (const key in req.body) {
                        if (key !== 'rating') {
                            user[key] = req.body[key];
                        }
                    }
                }
                yield user.save();
                return user;
            }
            catch (e) {
                res.status(500).send(`Error updating user: ${e.message}`);
            }
        });
    }
    // deletes user account
    deleteUser(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.authenticate_user(req.user._id);
            if (!user) {
                res.status(404).send('Error deleting user');
            }
            try {
                yield this.models.User.findByIdAndDelete(req.user._id);
                res.status(200).send(`Deleted user successfully`);
            }
            catch (e) {
                res.status(500).send(`Error deleting user`);
            }
        });
    }
    // getting user rating
    getUserRating(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.models.User.findOne({ _id: req.user._id });
                if (user.rating.length === 0) {
                    return {
                        averageRating: 0,
                        totalRatings: 0,
                    };
                }
                const totalScore = user.rating.reduce((sum, rating) => sum + rating.score, 0);
                const averageRating = totalScore / user.rating.length;
                return {
                    averageRating,
                    totalRatings: user.rating.length,
                };
            }
            catch (error) {
                res.status(500).send('Failed to fetch ratings');
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.js.map