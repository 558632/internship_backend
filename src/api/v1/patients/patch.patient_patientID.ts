import {Request, Response} from 'express'
import Joi from "joi";
import { Op } from 'sequelize';
import { models } from '../../../db'
import {GENDER, GENDERS} from './../../../utils/enums'

export const schema = Joi.object({
    body: Joi.object({
        firstName: Joi.string().max(100).optional(),
        lastName: Joi.string().max(100).optional(),
        birthdate: Joi.date().optional(),
        weight: Joi.number().integer().min(1).max(200).optional(),
        height: Joi.number().integer().min(1).optional(),
        identificationNumber: Joi.string().pattern(/^[a-zA-Z0-9]*$/).length(12).optional(),
        gender: Joi.string().valid(...GENDERS).optional(),
        diagnoseID: Joi.number().integer().min(1).optional()
    }),
    query: Joi.object(),
    params: Joi.object({
        patientID: Joi.number().integer().required()
    })
})

interface IPatient{
    firstName: string,
    lastName: string,
    birthdate: Date,
    weight: number,
    height: number,
    identificationNumber: string,
    gender: GENDER,
    diagnoseID: number
}

export const workflow = async (req: Request, res: Response) => {
    const {body} : {body:IPatient} = req
    const { Patient, Diagnose } = models

    const patient_ID = await Patient.findAll({
        where: {
            id: req.params.patientID
        }
    })
    if (patient_ID.length === 0){
        res.status(404).json({
            message: 'Patient with such a id specified is not present in database.'
        })
    }
    if(!(body.diagnoseID===undefined)){
        const diagnose = await Diagnose.findAll({
            where:{
                id: body.diagnoseID
            }
        })
        if (diagnose.length === 0){
            res.status(404).json({
                message: 'Diagnose not found.'
            })
        }
    }if(!(body.identificationNumber===undefined)){
        const patientID = await Patient.findAll({
            where: {
                identificationNumber: body.identificationNumber,
                id: {
                    [Op.not]: req.params.patientID
                }
            }
        })
        if (patientID.length !== 0){
            res.status(409).json({
                message: 'Another patient with such a identificationNumber specified is already present in database.'
            })
        }
    }
    const patient = await Patient.update({
        ...body
    },{
        where:{
            id: req.params.patientID
        }
    })
    res.status(200).json({
        "messages":[{
            "message": "Patient's data updated successfully.'",
            "type": "SUCCESS"
        }]
    })
}