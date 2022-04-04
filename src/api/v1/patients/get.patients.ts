import {Request, Response} from 'express'
import {PatientModel} from "../../../db/models/patients";
import {models} from '../../../db'
import {GENDERS, RECORS_LIMITS} from "../../../utils/enums";
import Joi from "joi";

const defPageLimit:number = Number.MAX_SAFE_INTEGER
const defOrder:string = "id:asc"

export const schema = Joi.object({
    body: Joi.object(),
    query: Joi.object({
        gender: Joi.string().valid(...GENDERS).optional(),
        order: Joi.string().pattern(/^[a-zA-Z]*(:)(desc|asc|DESC|ASC)$/).optional(),
        limit: Joi.number().valid(...RECORS_LIMITS).optional(),
        page: Joi.number().optional()
    }),
    params: Joi.object()
})

export const workflow = async (req: Request, res: Response) => {
    const {query} : {query:any} = req
    const {Patient} = models

    const patients: PatientModel[] = await Patient.findAll({
        limit: (query.limit===undefined) ? defPageLimit : Number(query.limit),
        offset: ((query.limit===undefined) ? 0 : Number(query.limit)) * ((query.page===undefined) ? 0:(Number(query.page)-1)),
        where:{
            gender: query.gender,
        },
        order: [
            [((query.order)).substring(0,String(query.order).indexOf(":")),
                (query.order).substring(String(query.order).indexOf(":")+1)]
        ],
        logging: true
    })

    res.json({
        patients
    })
}