import {NextFunction, Request, Response} from 'express'
import Joi from "joi";
import {models} from "../../../db";
import {MESSAGE_TYPE} from "../../../utils/enums";

export const schema = Joi.object({
    body: Joi.object(),
    query: Joi.object(),
    params: Joi.object({
        patientID: Joi.number().integer().required()
    })
})

export const workflow = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {params} = req
        const {Patient} = models
        const del = await Patient.destroy({
            where: {
                id: parseInt(params.patientID,10)
            },
            logging: true
        })
        if(del){
            return res.status(200).json({
                messages: [{
                    type: MESSAGE_TYPE.SUCCESS,
                    message:"Patient was deleted from database successfully."
                }]
            })
        }else{
            return res.status(404).json({
                messages: [{
                    type: MESSAGE_TYPE.FAILURE,
                    message:"Patient with such a id specified is not present in database."
                }]
            })
        }
    }catch(error){
        next(error)
    }
}