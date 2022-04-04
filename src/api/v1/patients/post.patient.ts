import {Request, Response} from 'express'
import Joi from 'joi'
import { models } from '../../../db'
import {GENDER, GENDERS} from './../../../utils/enums'

export const schema = Joi.object({
    body: Joi.object({
        firstName: Joi.string().max(100).required(),
        lastName: Joi.string().max(100).required(),
        birthdate: Joi.date().required(),
        weight: Joi.number().integer().min(1).max(200).required(),
        height: Joi.number().integer().min(1).required(),
        identificationNumber: Joi.string().pattern(/^[a-zA-Z0-9]*$/).length(12).required(),
        gender: Joi.string().valid(...GENDERS).required(),
        diagnoseID: Joi.number().integer().min(1).required()
    }),
    query: Joi.object(),
    params: Joi.object()
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

    const { Patient, Diagnose } = models
    const {body, params, query} : {body:IPatient, params:any, query:any} = req

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

    const patientID = await Patient.findAll({
        where: {
            identificationNumber: body.identificationNumber
        }
    })

    if (patientID.length !== 0){
        res.status(409).json({
            message: 'Patient with such a identificationNumber specified is already present in database.'
        })
    }

    const patient = await Patient.create({
        ...body
    })

    res.status(200).json({
        "messages":[{
            "message": "Patient added to database successfully",
            "type": "SUCCESS"
        }],
        "patient": {
            "id": patient.id
        }
    })
}
