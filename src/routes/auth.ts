import { Request, Response, Router } from "express";
import User  from "../entity/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import auth from '../middleware/auth'
import { z } from 'zod' 
import { validate, isEmpty } from 'class-validator'
// import { prisma } from '../index'

const UserValidation = z.object({
  id: z.number().optional(),
  name: z.string().min(4).max(255),
  email: z.string().email().optional(),
  password: z.string()
})

interface errorType {
  name?: string,
  email?: string,
  password?: string
}

type UserType = z.infer<typeof UserValidation>

const register = async (req: Request, res: Response) => {
  try {
    const validation = UserValidation.parse(req.body)
    let errors: errorType = {}
    const user = new User()
    user.name = validation.name
    user.email = validation.email
    user.password = validation.password
    const validationErrors = await validate(user)
    if (validationErrors.length > 0) {
      validationErrors.forEach(e => {
        errors[e.property] = Object.values(e.constraints)[0]
      })
      return res.status(400).json({errors})
    }
    const usedEmail = await User.findOneBy({ email: validation.email })
    if (usedEmail) {
      errors.email = 'email already exists'
      return res.status(400).json({errors})
    }
    await user.save()
    // const user = await prisma.user.create({
    //   data: { 
    //     name: validation.name,
    //     email: validation.email,
    //     password: await bcrypt.hash(validation.password, 6)
    //   }
    // })
    const key = process.env.JWT_SECRET
    const token = jwt.sign({ userId: user.id }, key)
    res.json({token})
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const validation = UserValidation.parse(req.body)
    // const user = await prisma.user.findFirst({where: {name: validation.name}})
    const user = await User.findOneBy({ name: validation.name })
    if (user) {
      const passwordMatch = await bcrypt.compare(validation.password, user.password)
      if (passwordMatch) {
        const key = process.env.JWT_SECRET
        const token = jwt.sign({ userId: user.id }, key)
        res.json({token})
      } else res.sendStatus(401)
    } else {
      res.sendStatus(401)
    }
  } catch (err) {
    console.error(err) 
    res.sendStatus(500)
  }
}

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneBy({ id : res.locals.userId })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(404).json({error: 'not found'})
  }
}

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.toString()})
  }
}


const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/currentUser', auth, getCurrentUser)
router.get('/users', auth, getUsers)

export default router