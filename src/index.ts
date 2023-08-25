import "reflect-metadata";
import express from 'express'
import dotenv from "dotenv"
import { DataSource } from "typeorm"
import cors from 'cors'
// import { PrismaClient } from '@prisma/client'

dotenv.config()
const app = express()

import authRouter from './routes/auth'
const port = process.env.PORT

app.use(express.json())
app.use(cors())
// export const prisma = new PrismaClient()
app.get('/', (_, res) => res.send('hello world'))
app.use('/api/auth', authRouter)
// app.listen(port, () => console.log(`server running on port ${port}`))

export const AppDataSource = new DataSource({
	type: "mssql",
	host: "172.17.0.1",
  port: 1433,
  username: "SA",
  password: "M#45#ssqlserver",
  database: "TestDB",
  synchronize: true,
  logging: true,
	entities: [
    "build/entity/**/*{.ts, .js}",
    "src/entity/**/*{.ts, .js}"
  ],
  options: {
    encrypt: false
  }
})
AppDataSource.initialize()
	.then(() => app.listen(port, () => console.log(`server running on port ${port}`)))
	.catch((err) => console.error(err))
// app.listen(port, async () => {
// 	console.log(`server running on port ${port}`)
// 	try {
// 		await createConnection({
// 			type: "postgres",
// 			url: process.env.DATABASE_URL,
// 			entities: ["build/entity/**/*.js"],
// 			synchronize: true,
// 			ssl: { //this flag only for heroku
// 				rejectUnauthorized: false
// 			}
// 		})
// 		console.log('database connected')
// 	} catch (err) {
// 		console.error(err)
// 	}
// });
