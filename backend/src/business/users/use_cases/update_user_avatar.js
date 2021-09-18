const sharp = require("sharp");

module.exports = repository => {
    const upload = async (id, avatar) => {
        avatar = await sharp(avatar)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();

        return repository.updateById(id, { avatar });
    }

    const remove = async (id) => {
        return repository.updateById(id, { avatar: null });
    }

    return { upload, remove };
}