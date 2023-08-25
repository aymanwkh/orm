import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization
    const token = header && header.split(' ')[1]
    if (!token) res.sendStatus(401)
    else {
      const result = jwt.verify(token, process.env.JWT_SECRET)
      res.locals.userId = result['userId']
    }
    next()
  } catch (err) {
    if (err instanceof Error) res.status(401).json({error : err.message})
    else console.log(err)
  }
}

export default auth