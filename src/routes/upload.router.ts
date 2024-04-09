import multer from "multer"
import path from "path"
import express,{Request,Response} from "express"
import setContext from "../middlewares/context";
import Driver from "../models/user/driver"

const app = express()


// storages
const avatarStorage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads', 'avatars'),
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const ghanaCardStorage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads', 'ghana-cards'),
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const driversLicenseStorage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads', 'driver-Lincenses'),
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    throw new Error('Error: Images only! (jpeg, jpg, png)');
  }
}

//middlewares
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
const uploadGhanaCard = multer({
  storage: ghanaCardStorage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
const uploadDriversLicense = multer({
  storage: driversLicenseStorage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

interface FileRequest extends Request {
  user?: {
    _id: string;
  };
  file?: {
    path?: string;
  };
}
app.post('/upload-profile-picture', uploadAvatar.single('avatar'), setContext, async (req: FileRequest, res) => {
  try {
    const user = await Driver.findOne({ _id: req.user._id });
    await user.updateOne({ $set: { profile: { avatar: req.file.path } } }, { new: true, upsert: true });
    await user.save();
    return res.status(201).send('Avatar uploaded');
  } catch (e) {
    return res.status(500).send(`Error processing request: ${e}`);
  }
});
app.post('/upload-ghana-card', uploadGhanaCard.single('ghana-card'), setContext, async (req: FileRequest, res) => {
  try {
    const user = await Driver.findOne({ _id: req.user._id });
    await user.updateOne({ $set: { profile: { ghanaCard: req.file.path } } }, { new: true, upsert: true });
    await user.save();
    return res.status(201).send('Ghana Card uploaded');
  } catch (e) {
    return res.status(500).send(`Error processing request: ${e}`);
  }
});
app.post('/upload-driving-license', uploadDriversLicense.single('driving-license'), setContext, async (req: FileRequest, res) => {
  try {
    const user = await Driver.findOne({ _id: req.user._id });
    await user.updateOne({ $set: { profile: { driversLicense: req.file.path } } }, { new: true, upsert: true });
    await user.save();
    return res.status(201).send('Driving License uploaded');
  } catch (e) {
    return res.status(500).send(`Error processing request: ${e}`);
  }
});

export default app
