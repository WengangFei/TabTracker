const multer = require('multer');
const fs = require('fs');
const path = require('path');

//create the uploads folder if it doesn't exist
const usersDir = path.join('images','users');
const puppiesDir = path.join('images','puppies');
if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir,{ recursive: true });
}
if(!fs.existsSync(puppiesDir)) {
    fs.mkdirSync(puppiesDir,{ recursive: true });
}
//set up storage engine for multer
const storage = multer.diskStorage({
    //set up storage config
      destination: (req, file, cb) => {
        // console.log('image upload =>',file);
        // Set the destination folder to store the uploaded files
          const destination = req.body.imageUploadType === 'users' ? usersDir : puppiesDir;
          cb(null, destination);
      },
      filename: (req, file, cb) => {
        // Use original file name or custom naming convention
          cb(null,Date.now() + '-' + file.originalname);
      }
});
    //filter out image files
const fileFilter = (req, file, cb) => {
    // Allow only image files
    const fileTypes = /jpeg|jpg|png|gif/;//check file actual file content
    const mimeType = fileTypes.test(file.mimetype);//check file extension
    //path.extname() is a Node.js function that extracts the file extension from the filename. 
    // For example, if the filename is image.jpg, path.extname() will return .jpg.
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
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;