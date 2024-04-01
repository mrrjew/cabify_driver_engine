"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateField = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const otp_generator_1 = tslib_1.__importDefault(require("otp-generator"));
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
exports.privateField = ['password', '__v', 'verificationCode', 'passwordResetCode', 'verified'];
const userSchema = new mongoose_1.Schema({
    firstname: { type: String },
    lastname: { type: String },
    othernames: { type: String },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    password: { type: String },
    type: { type: String, enum: ['DRIVER', 'PASSENGER'] },
    verificationCode: { type: String, required: true, default: () => otp_generator_1.default.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false }) },
    passwordResetCode: { type: String },
    verified: { type: Boolean, required: true, default: false },
    profile: {
        avatar: { type: String },
        basicInformation: { type: String },
        ghanaCard: { type: String },
        driversLicense: { type: String },
        driverPaymentDetails: {
            accountNumber: { type: String },
            bankCode: { type: String },
        },
        vehicleDetails: {
            brand: { type: String },
            model: { type: String },
            numberPlate: { type: String },
            additionalInformation: { type: String },
        }
    },
    rating: [{
            ratedBy: { type: mongoose_1.Schema.Types.ObjectId },
            criteria: { type: String },
            score: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String }, // Optional comment
        }],
    settings: {
        // General Settings
        language: { type: String, enum: ['EN', 'FR', 'ES', 'DE', 'ZH', 'JA', 'KO'], default: 'EN' },
        theme: { type: String, enum: ['LIGHT', 'DARK'], default: 'LIGHT' },
        notificationEnabled: { type: Boolean, default: true },
        soundEnabled: { type: Boolean, default: true },
        autoSaveInterval: { type: Number, default: 10 },
        // Privacy Settings
        profileVisibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
        contactInfoVisibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC' },
        locationSharingEnabled: { type: Boolean, default: true },
        activityTrackingEnabled: { type: Boolean, default: true },
        dataSharingEnabled: { type: Boolean, default: true },
        dataRetentionPeriod: { type: Number, default: 365 },
        // Security Settings
        twoFactorAuthEnabled: { type: Boolean, default: false },
        dataEncryptionEnabled: { type: Boolean, default: false },
    },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(this.password, salt);
            this.password = hash;
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
userSchema.methods.validatePassword = function (pass) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(pass, this.password);
    });
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map