import { Router } from 'express'
import routerP from './patients'
import routerS from './substanceAmounts'

const router1 = Router()

export default () => {
    router1.use('/patients', routerP())
    router1.use('/substanceAmounts', routerS())
    return router1
}