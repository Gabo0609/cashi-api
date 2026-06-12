import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `${crypto.randomUUID()}${extension}`);
    },
});
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only JPEG, PNG or WebP files are allowed"));
        }
        cb(null, true);
    },
});
//# sourceMappingURL=upload.middleware.js.map