// src/server.ts
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import errorHandler from './middleware/errorHandler'
import usersRouter from './routes/users'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT || 4000
const app = express()

app.use(cors({
  exposedHeaders: ['X-Total-Count']
}))
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.send('MERN Challenge Backend'))
app.use('/api/users', usersRouter)

// error handler (should be last)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})