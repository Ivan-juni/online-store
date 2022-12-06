const path = require('path')
const fs = require('fs')

// Remove old photo
module.exports = removePhoto = (imagePath) => {
  if (imagePath) {
    const oldPath = path.join(
      __dirname,
      '..',
      'assets',
      path.basename(imagePath)
    )

    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
  }
}
