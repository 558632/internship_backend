import {Request, Response} from 'express'
import Joi from "joi";

enum GENDER{
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export const schema = Joi.object({
    body: Joi.object({
        firstName: Joi.string().max(100).optional(),
        lastName: Joi.string().max(100).optional(),
        birthdate: Joi.date().optional(),
        weight: Joi.number().integer().min(1).max(200).optional(),
        height: Joi.number().integer().min(1).optional(),
        identificationNumber: Joi.string().pattern(/^[a-zA-Z0-9]*$/).length(12).optional(),
        gender: Joi.string().valid(...Object.values(GENDER)).optional(),
        diagnoseID: Joi.number().integer().min(1).optional()
    }),
    query: Joi.object(),
    params: Joi.object()
})

export const workflow = (req: Request, res: Response) => {
    // prečítame záznam z databázy kde je id pacienta z parametra
    // ak nevráti pacienta, pacient neexistuje
    // v opačnom prípade existuje a aktualizuje sa
    res.json({
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
    })
}