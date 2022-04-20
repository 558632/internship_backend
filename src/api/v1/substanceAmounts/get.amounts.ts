import {Request, Response} from 'express';
import {calculateSubstanceAmount} from './../../../utils/pat'
import {PERSON_TYPE} from "../../../utils/enums";

export const workflow = async (req:Request, res: Response) => {
    let values:string = ""
    for(let i:number=1;i<=400;i++){
        if(i<=200){
            values+=`adult|${i}|${calculateSubstanceAmount(PERSON_TYPE.ADULT, i)}`
        }else{
            values+=`children|${i-200}|${calculateSubstanceAmount(PERSON_TYPE.CHILD, i-200)}`
        }
        values+='\n'
    }
    await console.log(values)
    return res.json({
        values
    })
}