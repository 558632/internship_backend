import { Router } from 'express'
import * as amounts from './get.amounts'

const router = Router()

export default () => {
    router.get('/', amounts.workflow)
    return router
}