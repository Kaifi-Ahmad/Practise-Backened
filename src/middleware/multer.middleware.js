import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueName=Date.now()+"-"+file.originalname
    cb(null, uniqueName)
  },
  limit:{
    fileSize:1*1000*1000
  }
})
export const upload = multer({ storage })