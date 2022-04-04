import {Request, Response} from 'express'
import Joi from 'joi'
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
    const patient = await Patient.findAll({
        where: {
            id: params.patientID
        }
    })
    if (patient.length === 0){
        res.status(404).json({
            message: 'Patient with such a id specified is not present in database.'
        })
    }else{
        res.status(200).json({
            patient
        })
    }
}