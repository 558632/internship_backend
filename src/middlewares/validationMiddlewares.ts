import { Request, Response, NextFunction} from 'express'

export default function validationMiddlewares() {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('Hello from middleware')
        return next()
    }
}