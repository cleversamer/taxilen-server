const fs = require("fs");
const sharp = require("sharp");
const crypto = require("crypto");
const { server } = require("../../../config/system");
const utils = require("../../../utils");

module.exports.storeFile = async (file, title = "") => {
  let path = "";

  try {
    // Reading input file
    const readFile = Buffer.from(file.data, "base64");

    // Decide file's name on disk
    const diskName = title
      ? `${title}_${utils.getCurrentDate()}`
      : crypto.randomUUID();

    // Get file's extenstion
    const nameParts = file.name.split(".");
    const extension = nameParts[nameParts.length - 1];

    // Writing file to local disk storage
    const name = utils.filterName(`${diskName}.${extension}`);
    path = `/${name}`;
    fs.writeFileSync(`./uploads${path}`, readFile, "utf8");

    // Check if file is a photo and compress it
    if (server.SUPPORTED_PHOTO_EXTENSIONS.includes(extension)) {
      await this.compressPhoto(`./uploads${path}`);
      return { originalName: file.name, name, path };
    } else {
      return { originalName: file.name, name, path };
    }

    // TODO: check if file is a video and compress it
  } catch (err) {
    // Delete stored file in case of error
    await this.deleteFile(path);

    throw err;
  }
};

module.exports.deleteFile = async (filePath) => {
  try {
    fs.unlink(`./uploads${filePath}`, (err) => {});
    return true;
  } catch (err) {
    throw err;
  }
};

module.exports.compressPhoto = async (path) => {
  try {
    // Get metadata of the photo
    // const metadata = await sharp(inputImage).metadata();

    // resize and compress the image using sharp
    const outputBuffer = await sharp(path)
      .resize(400, 400) // set the maximum width and height to 400 pixels
      .jpeg({ quality: 80 }) // compress the image to 40% quality JPEG
      .toBuffer();

    fs.writeFileSync(path, outputBuffer);

    return path;
  } catch (err) {
    await this.deleteFile(path);

    throw err;
  }
};
