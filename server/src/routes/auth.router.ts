import express from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middleware/auth.middleware'
import checkRole from '../middleware/check-role.middleware'
import asyncHandler from '../middleware/async-handler.middleware'

export default function createAuthRoutes() {
  const router = express.Router()

  router.post('/registration', asyncHandler(authController.registration))
  router.post('/login', asyncHandler(authController.login))
  router.post('/logout', authMiddleware, asyncHandler(authController.logout))
  router.get('/refresh', asyncHandler(authController.refresh))
  router.get('/activate/:link', asyncHandler(authController.activate))

  // @route DELETE /api/auth/changeRole?id=u34ut043cf&role=ADMIN
  // @des Change user role
  router.put('/changeRole', checkRole('OWNER'), asyncHandler(authController.changeRole))

  return router
}
