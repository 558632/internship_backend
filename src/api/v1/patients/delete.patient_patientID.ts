import {Request, Response} from 'express'
import Joi from "joi";
import {models} from "../../../db";

export const schema = Joi.object({
    body: Joi.object(),
    query: Joi.object(),
    params: Joi.object({
        patientID: Joi.number().integer().required()
    })
})

export const workflow = async (req: Request, res: Response) => {
    const {params} = req
    const {Patient} = models
    const del = await Patient.destroy({
        where: {
            id: params.patientID
        },
        logging: true
    })
    if(del){
        res.status(200).json({
            "messages": [
                {
                    "message": "Patient was deleted from database successfully.",
                    "type": "SUCCESS"
                }
            ]
        })
    }else{
        res.status(404).json({
            "messages": [
                {
                    "message": "Patient with such a id specified is not present in database.",
                    "type": "FAULT"
                }
            ]
        })
    }
}