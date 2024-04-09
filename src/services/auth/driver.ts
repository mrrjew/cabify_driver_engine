import IService, { IAppContext } from '../../types/app';
import sendSms from '../../utils/sms';
import log from '../../utils/log';
import otp from 'otp-generator';

export default class DriverService extends IService {
  constructor(context: IAppContext) {
    super(context);
  }

  // registers Driver
  async registerDriver(req, res) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(422).send('no input was received');
      }
      const _Driver = await this.models.Driver.findOne({ phoneNumber });
      if (_Driver) throw new Error('Driver already exists');

      const Driver = new this.models.Driver({ phoneNumber });
      await Driver.save();

      await sendSms(
        phoneNumber,
        `This is your cab app verification code: ${Driver.verificationCode}. Thank you for signing up.`
      );

      return res.status(200).json(Driver);
    } catch (e) {
      return res.status(500).send(`Error creating new Driver: ${e}`);
    }
  }

  //verifies Driver
  async verifyDriver(req, res): Promise<boolean> {
    const { id, verificationCode } = req.body;
    if (!id || !verificationCode) {
      return res.status(422).send('missing required fields');
    }
    try {
      // Find the Driver by Id
      const Driver = await this.authenticate_driver(id);
      // Check if the Driver is already verified
      if (Driver.verified) {
        return res.status(500).send('Driver is already verified');
      }

      // Check if verificationCode matches
      if (Driver.verificationCode != verificationCode) {
        return res.status(500).send('Invalid verification code');
      }

      // Set verified to true and save Driver
      Driver.verified = true;
      await Driver.save();

      return res.status(200).send(true);
    } catch (e) {
      return res.status(500).send(`Error validating Driver: ${e}`);
    }
  }

  // sends password reset code to Driver's email
  async forgotPassword(req, res) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(422).send('no input received');
      }

      const Driver = await this.models.Driver.findOne({ phoneNumber });

      if (!Driver) {
        return res.status(404).send('Driver not found');
      }

      if (!Driver.verified) {
        return res.status(500).send('Driver is not verified');
      }

      const passwordResetCode = otp.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      Driver.passwordResetCode = passwordResetCode;

      await Driver.save();

      await sendSms(phoneNumber, `This is your cab app password reset code:${Driver.passwordResetCode}`);

      log.debug(`Password reset code sent to ${Driver.phoneNumber}`);

      const message = 'password reset code sent';
      return res.status(200).send(message);
    } catch (e) {
      return res.status(500).send(`error handing password reset: ${e}`);
    }
  }

  // resets Driver's password to new password from email
  async resetPassword(req, res) {
    try {
      const { id, passwordResetCode, newPassword } = req.body;

      if (!id || !passwordResetCode || !newPassword) {
        return res.status(422).send('missing required fields');
      }

      const Driver = await this.authenticate_driver(id);

      if (!Driver || Driver.passwordResetCode !== passwordResetCode) {
        return res.status(404).send('Could not reset password');
      }

      Driver.passwordResetCode = null;

      Driver.password = newPassword;

      await Driver.save();

      const message = 'Successfully updated password';
      return res.status(200).send(message);
    } catch (e) {
      return res.status(500).send('error reseting password');
    }
  }
  // login user
  async loginDriver(req, res) {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(500).send('missing required fields');
    }

    const driver = await this.models.Driver.findOne({ phoneNumber });
    if (!driver) {
      return res.status(404).send('user not found');
    }

    try {
      const valid = await driver.validatePassword(password);
      console.log(valid);
      if (!valid) {
        return res.status(500).send('password incorrect');
      }
    } catch (e) {
      return res.status(500).send(`error logging in ${e}`);
    }

    return res.status(200).json(driver);
  }

  // updates Driver details
  async updateDriver(req, res) {
    try {
      console.log(req.user._id);
      const Driver = await this.authenticate_driver(req.user._id);

      await Driver.updateOne({ $set: { ...req.body } });

      await Driver.save();

      return res.status(200).json(Driver);
    } catch (e) {
      return res.status(500).send(`Error updating Driver: ${e.message}`);
    }
  }

  // deletes Driver account
  async deleteDriver(req, res) {
    const Driver = await this.authenticate_driver(req.user._id);
    if (!Driver) {
      return res.status(404).send('Error deleting Driver');
    }

    try {
      await this.models.Driver.findByIdAndDelete(req.user._id);
      return res.status(200).send(`Deleted Driver successfully`);
    } catch (e) {
      return res.status(500).send(`Error deleting Driver`);
    }
  }
}
