import multer from 'multer';
import path from 'path';
import HttpError from '../utils/httpError';

// Set up multer storage configuration
const storage = multer.memoryStorage(); // Store file in memory as a Buffer

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb: any) => {
    const fileTypes = /jpeg|jpg|png|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image or PDF files are allowed!'), false);
    }
  },
}).single('document'); // Accepting a single file with the name 'document'

export default upload;
