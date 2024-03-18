import multer, { diskStorage } from "multer";

export default function fileUpload() {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    // if the file is not a pdf throw error
    if (file.mimetype !== "application/pdf")
      cb(new Error("Only PDF is allowed !"), false);

    // if the file is a pdf
    cb(null, true);
  };
  const multerUpload = multer({ storage, fileFilter });
  return multerUpload;
}
