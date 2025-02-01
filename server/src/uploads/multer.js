const multer = require('multer');
const fs = require('fs');
const path = require('path');

//create the up;oads folder if it doesn't exist
const uploadsDir = path.join(__dirname, '/');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    //set up storage config
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            cb(null,Date.now() + '-' + file.originalname);
        }
    });
    //filter out image files
    const fileFilter = (req, file, cb) => {
        // Allow only image files
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extName) {
          return cb(null, true);
        } else {
          cb(new Error('Only image files are allowed.'));
        }
      };


    //set up middleware
    const upload = multer({ 
        storage,
        fileFilter,
        // Limit file size to 5MB 
        limits: { fileSize: 5 * 1024 * 1024 }});
    
    module.exports = upload;