import multer from "multer";
import path from 'node:path'

const storage = multer.diskStorage({
    destination: function (res, file, callback) {
        const route = path.join(import.meta.dirname, '..', 'public', 'images')
        callback(null, route)

    }

})

const upload = multer({ storage })

export default upload;