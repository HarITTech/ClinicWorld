const multer = require('multer');
const path = require('path');
const fs = require('fs');

const checkDirExists = (dir)=>{
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true});
    }
};

// Adding storage with dynamic destination based on file type
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        let dest = '';
        if(file.fieldname === 'profilePhoto'){
            dest = 'uploads/profilePhotos';
        }
        else if(file.fieldname === 'degreeCertificate'){
            dest = 'uploads/degreeCertificates';
        }
        else if(file.fieldname === 'licenseCertificate'){
            dest = 'uploads/licenseCertificates';
        }
        else if(file.fieldname === 'achievements'){
            dest = 'uploads/achievements';
        }
        else if(file.fieldname === 'clinicPhotos'){
            dest = 'uploads/clinicPhotos';
        }
        else{
            dest = 'uploads/others';
        }
        checkDirExists(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb){
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, uniqueName)
    }
});

const upload = multer({ storage });

module.exports = upload;