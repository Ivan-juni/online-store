import path from 'path'
import fs from 'fs'

// Remove old photo
export default async function removePhoto(imagePath: string) {
  if (imagePath) {
    const oldPath = path.join(__dirname, '..', 'assets', path.basename(imagePath))

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
