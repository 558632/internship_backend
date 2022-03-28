import { Router } from 'express'
import * as GetPatients from './get.patients'
import validationMiddlewares from './../../../middlewares/validationMiddlewares'

const router = Router()

export default () => {
    router.get('/', validationMiddlewares(), GetPatients.workflow)
    return router
}