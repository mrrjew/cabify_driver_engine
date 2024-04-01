import { Schema, model, CallbackError } from 'mongoose';
import { IUserDocument } from '../../types/user/user';
import code from 'otp-generator'
import bcrypt from 'bcrypt';

export const privateField = ['password', '__v', 'verificationCode', 'passwordResetCode', 'verified'];

const driverSchema = new Schema<IUserDocument>(
  {
    firstname: { type: String },
    lastname: { type: String },
    othernames: { type: String },
    email: { type: String },
    phoneNumber:{type:String,required:true},
    password: { type: String },
    type: { type: String, enum: ['DRIVER','PASSENGER'] },
    verificationCode: { type: String, required: true, default: () => code.generate(4,{upperCaseAlphabets:false,specialChars:false,lowerCaseAlphabets:false}) },
    passwordResetCode: { type: String },
    verified: { type: Boolean, required: true, default:false },
    profile: {
      avatar:{ type: String}, 
      basicInformation: { type: String},
      ghanaCard: { type: String},
      driversLicense: { type: String},
      driverPaymentDetails:{
        accountNumber:{type: String},
        bankCode:{type: String},
      },
      vehicleDetails: {
        brand: {type:String},
        model: {type:String},
        numberPlate: {type:String},
        additionalInformation: {type:String},
      }
     },
    rating: [{
      ratedBy: { type: Schema.Types.ObjectId }, // User who is giving the rating
      criteria: { type: String }, // Criteria for the rating (e.g., professionalism, communication)
      score: { type: Number, required: true, min: 1, max: 5 }, // Rating score (1 to 5)
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
    latitude:{type: Number, required: false},
    longitude:{type: Number, required: false},
  },
  {
    timestamps: true,
  }
);

driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

driverSchema.methods.validatePassword = async function (pass: string) {
  return bcrypt.compare(pass, this.password);
};

const Driver = model('User', driverSchema);

export default Driver;
