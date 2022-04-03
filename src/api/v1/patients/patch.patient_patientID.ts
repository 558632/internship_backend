import {Request, Response} from 'express'
import Joi from "joi";
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

export const workflow = (req: Request, res: Response) => {
    // prečítame záznam z databázy kde je id pacienta z parametra
    // ak nevráti pacienta, pacient neexistuje
    // v opačnom prípade existuje a aktualizuje sa
    /*res.json({
        "messages": [
            {
                "message": "Pacient bol zistený v databáze.",
                "type": "SUCCESS"
            },
            {
                "message": "Údaje pacienta boli aktualizované",
                "type": "SUCCESS"
            }
        ]
    })*/

    const {body, params, query} : {body:IPatient, params:any, query:any} = req
    console.log(body)
    res.json({})
}