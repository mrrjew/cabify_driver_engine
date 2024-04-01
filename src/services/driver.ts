import IService, { IAppContext } from '../types/app';
import sendSms from '../utils/sms';
import log from '../utils/log';
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
        res.status(422).send('no input was received');
      }
      const _driver = await this.models.Driver.findOne({ phoneNumber });
      if (_driver) throw new Error('driver already exists');

      const driver = new this.models.Driver({ phoneNumber });
      await driver.save();

      await sendSms(
        phoneNumber,
        `This is your cab app verification code: ${driver.verificationCode}. Thank you for signing up.`
      );

      return driver;
    } catch (e) {
      res.status(500).send(`Error creating new driver: ${e}`);
    }
  }

  //verifies Driver
  async verifyDriver(req, res): Promise<boolean> {
    const { id, verificationCode } = req.body;
    if (!id || !verificationCode) {
      res.status(422).send('missing required fields');
    }
    try {
      // Find the Driver by Id
      const driver = await this.authenticate_driver(id);
      // Check if the Driver is already verified
      if (driver.verified) {
        res.status(500).send('Driver is already verified');
      }

      // Check if verificationCode matches
      if (driver.verificationCode != verificationCode) {
        res.status(500).send('Invalid verification code');
      }

      // Set verified to true and save Driver
      driver.verified = true;
      await driver.save();

      return true;
    } catch (e) {
      res.status(500).send(`Error validating Driver: ${e}`);
    }
  }

  // sends password reset code to Driver's email
  async forgotPassword(req, res) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        res.status(422).send('no input received');
      }

      const Driver = await this.models.Driver.findOne({ phoneNumber });

      if (!Driver) {
        res.status(404).send('Driver not found');
      }

      if (!Driver.verified) {
        res.status(500).send('Driver is not verified');
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
      return message;
    } catch (e) {
      res.status(500).send(`error handing password reset: ${e}`);
    }
  }

  // resets Driver's password to new password from email
  async resetPassword(req, res) {
    try {
      const { id, passwordResetCode, newPassword } = req.body;

      if (!id || !passwordResetCode || !newPassword) {
        res.status(422).send('missing required fields');
      }

      const driver = await this.authenticate_driver(id);

      if (!driver || driver.passwordResetCode !== passwordResetCode) {
        res.status(404).send('Could not reset password');
      }

      driver.passwordResetCode = null;

      driver.password = newPassword;

      await driver.save();

      const message = 'Successfully updated password';
      return message;
    } catch (e) {
      res.status(500).send('error reseting password');
    }
  }

  // login Driver
  async loginDriver(req, res) {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      res.status(500).send('missing required fields');
    }

    const Driver = await this.models.Driver.findOne({ phoneNumber });
    if (!Driver) {
      res.status(404).send('Driver not found');
    }

    try {
      const valid = await Driver.validatePassword(password);
      if (!valid) {
        res.status(500).send('password incorrect');
      }
    } catch (e) {
      res.status(500).send('error logging in');
    }

    return Driver;
  }

  // updates Driver details
  async updateDriver(req, res) {
    try {
      const driver = await this.authenticate_driver(req.Driver._id);

      if ('rating' in req.body) {
        driver.rating = req.body.rating;
      } else {
        if (driver._id.toString() !== req.Driver._id.toString()) {
          throw new Error(`Unauthorized: Cannot update another Driver's details`);
        }

        for (const key in req.body) {
          if (key !== 'rating') {
            driver[key] = req.body[key];
          }
        }
      }

      await driver.save();

      return driver;
    } catch (e) {
      res.status(500).send(`Error updating Driver: ${e.message}`);
    }
  }

  // deletes Driver account
  async deleteDriver(req, res) {
    const Driver = await this.authenticate_driver(req.Driver._id);
    if (!Driver) {
      res.status(404).send('Error deleting Driver');
    }

    try {
      await this.models.Driver.findByIdAndDelete(req.Driver._id);
      res.status(200).send(`Deleted Driver successfully`);
    } catch (e) {
      res.status(500).send(`Error deleting Driver`);
    }
  }

  // getting Driver rating
  async getDriverRating(req, res) {
    try {
      const driver = await this.models.Driver.findOne({ _id: req.Driver._id });
      if (driver.rating.length === 0) {
        return {
          averageRating: 0,
          totalRatings: 0,
        };
      }

      const totalScore = driver.rating.reduce((sum: any, rating: any) => sum + rating.score, 0);
      const averageRating = totalScore / driver.rating.length;

      return {
        averageRating,
        totalRatings: driver.rating.length,
      };
    } catch (error) {
      res.status(500).send('Failed to fetch ratings');
    }
  }
}
