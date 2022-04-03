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

    //zistenie max id pacienta, nový bude mať id +1
    //id pacienta do premennej budeme vracať
    //pridanie do databázy pacienta nového

    /*res.json({
        "messages": [
            {
                "message": "Zadaného údaje nového pacienta prešli kontrolou.",
                "type": "SUCCESS"
            },
            {
                "message": "Pacient bol úspešne pridaný do databázy.",
                "type": "SUCCESS"
            }
        ],
        "patient": {
            "id": 82426777
        }
    })*/
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

    const patient = await Patient.create({
        ...body
    })
    res.json({
        id: patient.id
    })
}