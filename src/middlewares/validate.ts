import { Request, Response, NextFunction} from 'express'
import Joi, {Schema} from 'joi'

export default function validate(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const {query, body, params} = req
        const validationResult = schema.validate({query, body, params})
        if(validationResult.error){
            return res.status(400).json(validationResult.error.details[0].message)
        }
        req.body = validationResult.value.body
        req.query = validationResult.value.query
        req.params = validationResult.value.params
        return next()
    }
}