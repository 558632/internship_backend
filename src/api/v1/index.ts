import { Router } from 'express'
import router from './patients'

const router1 = Router()

export default () => {
    router1.use('/patients', router())
    return router1
}