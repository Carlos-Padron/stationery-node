const sharp = require("sharp");

const resizeImgBuffer = async (buffer) => {
  try {
    let newBuffer = await sharp(buffer)
      .resize({
        width: 500,
        height: 500,
      })
      .toBuffer();
    return { error: false, result: newBuffer };
  } catch (error) {
    return { error: true, result: error.message };
  }
};

module.exports = {
  resizeImgBuffer,
};
