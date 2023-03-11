import { object, string, number, boolean, mixed } from 'yup'

export const addGameSchema = object({
  name: string().required('Please, type the name of the Game'),
  price: number().required('Please, type the price of the Game').positive(),
  isAvailable: boolean().default(true),
  categoryName: string().required('Please, type the category of the Game'),
  file: mixed().required('Please, add the Game image'),
  gameInfo: object()
    .shape({
      title: string().max(100, 'Title is too long (> 100)'),
      description: string().max(400, 'Description is too long (> 400)'),
    })
    .nullable(),
})

export const registrationSchema = object({
  email: string().email().required(),
  password: string()
    .min(4, 'Password should be longer than 3 symbols')
    .max(30, 'Password should be shorter than 30 symbols')
    .matches(/^[a-zA-Z0-9-]+$/, 'Only English letters and numbers')
    .required(),
  role: string().default('USER'),
})

export const loginSchema = object({
  email: string().email('Invalid email format').required('Please, type the email'),
  password: string()
    .min(4, 'Password should be longer than 3 symbols')
    .max(30, 'Password should be shorter than 30 symbols')
    .matches(/^[a-zA-Z0-9-]+$/, 'Only English letters and numbers')
    .required('Please, type the password'),
})
