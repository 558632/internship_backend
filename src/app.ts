import express from 'express'
import router1 from './api/v1'

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Register router
app.use('/api/v1', router1())


export default app