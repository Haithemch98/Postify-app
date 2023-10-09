const multer = require('multer')
const path = require('path')


const fileConfigs = {
    profilePicture: {
        destination: 'assets/profile-pictures/',
        allowedTypes: /jpeg|jpg|png|svg/,
        maxFileSize: 1024 * 1024 * 5
    },
    postsImages: {
        destination: 'assets/post-images/',
        allowedTypes: /jpeg|jpg|png|svg/,
        maxFileSize: 1024 * 1024 * 5
    }
};

const createStorageAndFilter = (config) => {
    return {
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, config.destination);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname));
            },
        }),
        fileFilter: function (req, file, cb) {
            const isAllowed = config.allowedTypes.test(
                path.extname(file.originalname).toLowerCase()
            );
            if (isAllowed) {
                cb(null, true);
            } else {
                cb(
                    new Error('Invalid file type. Only the allowed types are accepted.'),
                    false
                );
            }
        },
    }
};
const storagesAndFilters = {
    profilePicture : createStorageAndFilter(fileConfigs.profilePicture),
    postsImages : createStorageAndFilter(fileConfigs.postsImages)
}

const upload = {
    profilePicture: multer({
        storage: storagesAndFilters.profilePicture.storage,
        limits: {
            fileSize: fileConfigs.profilePicture.maxFileSize,
        },
        fileFilter: storagesAndFilters.profilePicture.fileFilter,
    }),
    postsImages: multer({
        storage: storagesAndFilters.postsImages.storage,
        limits: {
            fileSize: fileConfigs.postsImages.maxFileSize,
        },
        fileFilter: storagesAndFilters.postsImages.fileFilter,
    }),
}

module.exports = upload