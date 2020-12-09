// Resize.js

const sharp = require('sharp');
const path = require('path');

class Resize {
  constructor(folderPath) {
    this.folderPath = folderPath;
  }
  async save(buffer) {
    const filepath = this.filepath();

    await sharp(buffer)
      .resize(200, 350, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    return filepath;
  }
  filepath() {
    return path.resolve(`${this.folderPath}`)
  }
}
module.exports = Resize;