import { Request, Response, NextFunction} from 'express'
import {isNumber} from "lodash";

export default function validate() {
    return (req: Request, res: Response, next: NextFunction) => {
        let firstName:string = req.body.firstName
        let lastName:string = req.body.lastName
        let birthdate:string = req.body.birthdate
        if(!isNumber(req.body.weight)){
            res.sendStatus(400);
        }else{
            let weight:number = req.body.weight
        }
        if(!isNumber(req.body.height)){
            res.sendStatus(400);
        }else{
            let height:number = req.body.height
        }
        let identificationNumber:string = req.body.identificationNumber
        let gender:string = req.body.gender
        if(!isNumber(req.body.diagnoseID)){
            res.sendStatus(400);
        }else{
            let diagnoseID:number = req.body.diagnoseID
        }
        return next()
    }
}