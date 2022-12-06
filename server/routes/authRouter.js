const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')
const { check } = require('express-validator')

router.post(
  '/registration',
  [
    check('email', "email can't be empty").notEmpty(),
    check(
      'password',
      'Password should be longer than 4 and shorter than 15 symbols'
    ).isLength({ min: 4, max: 15 }),
  ],
  authController.registration
)
router.post('/login', authController.login)
router.get('/', authMiddleware, authController.check)

// @route DELETE /api/auth/changeRole?id=u34ut043cf&role=ADMIN
// @des Change user role
router.put('/changeRole', checkRole('ADMIN'), authController.changeRole)

module.exports = router
