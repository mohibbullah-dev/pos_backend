import path from "path";
import multer from "multer";
const alloweFileExtension = [".png", ".jpeg", ".jpg", ".webP", ".svg"];
const filter = (req, file, cb) => {
  if (alloweFileExtension.includes(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(
      new Error("invalid file! file should be [.png, .jpeg], .jpg,.webP, .svg")
    );
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/tem");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const singleFileUpload = multer({
  storage: storage,
  limits: 5 * 1024 * 1024,
  filter,
});

export { singleFileUpload };
