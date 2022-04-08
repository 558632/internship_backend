import {Request, Response, NextFunction} from 'express'
import {PatientModel} from "../../../db/models/patients";
import {models} from '../../../db'
import {GENDERS, RECORS_LIMITS, PERSON_TYPES, SUBSTANCE_TIME_UNITS} from "../../../utils/enums";
import Joi from "joi";
import {map} from "lodash"
import {calculateAgeFromBirthdate, getPersonType, calculateSubstanceAmount} from "./../../../utils/pat"

const defPageLimit:number = Number.MAX_SAFE_INTEGER
const defOrder:string = "id:asc"

export const paginationResponse=Joi.object({
    limit:Joi.number().integer().min(1).required(),
    page:Joi.number().integer().min(1).required(),
    totalPages:Joi.number().integer().min(0).required(),
    totalCount:Joi.number().integer().min(0).required()
}).required()

export const requestSchema = Joi.object({
    body: Joi.object(),
    query: Joi.object({
        gender: Joi.string().valid(...GENDERS).optional(),
        order: Joi.string().pattern(/^[a-zA-Z]*(:)(desc|asc|DESC|ASC)$/).optional(),
        limit: Joi.number().valid(...RECORS_LIMITS).optional(),
        page: Joi.number().optional()
    }),
    params: Joi.object()
})

export const responseSchema = Joi.object({
    patients:Joi.array()
        .items(
            Joi.object({
                id: Joi.number().integer().min(1).required(),
                firstName: Joi.string().max(100).required(),
                lastName: Joi.string().max(100).required(),
                birthdate: Joi.date().iso().required(),
                weight: Joi.number().integer().min(1).max(200).required,
                height: Joi.number().integer().min(1).required(),
                identificationNumber: Joi.string().alphanum().length(12).required(),
                gender: Joi.string().valid(...GENDERS).required(),
                age: Joi.number().integer().min(0).required(),
                personType: Joi.string().valid(...PERSON_TYPES).required(),
                substanceAmount: Joi.number().min(1).required(),
                diagnose: Joi.object({
                    id: Joi.number().integer().min(1).required(),
                    name: Joi.string().max(100).required(),
                    description: Joi.string().max(200).required(),
                    substance: Joi.object({
                        id: Joi.number().integer().min(1).required(),
                        name: Joi.string().max(100).required(),
                        timeUnit: Joi.string().valid(...SUBSTANCE_TIME_UNITS).required(),
                        halfLife: Joi.number().min(0).required()
                    })
                }).required()
            }).required()
        ).required(),
    pagination: paginationResponse
})

export const workflow = async (req: Request, res: Response, next: NextFunction) => {
    const {query} : {query:any} = req
    const {Patient, Diagnose, Substance} = models

    /*const patients: PatientModel[] = await Patient.findAll({
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
    })*/

    try{
        const [patients, patientCount] = await Promise.all([
            Patient.findAll({
                attributes: ['id', 'firstName', 'lastName', 'birthdate', 'weight', 'height', 'identificationNumber', 'gender'],
                include: [{
                    model: Diagnose,
                    required: true,
                    attributes: ['id', 'name', 'description'],
                    include: [{
                        model: Substance,
                        required: true,
                        attributes: ['id','name','timeUnit','halfLife']
                    }]
                }],
                where:{
                    gender: query.gender,
                },
                offset: ((query.limit===undefined) ? 0 : Number(query.limit)) * ((query.page===undefined) ? 0:(Number(query.page)-1)),
                limit: (query.limit===undefined) ? defPageLimit : Number(query.limit),
                order: [
                    [((query.order)).substring(0,String(query.order).indexOf(":")),
                        (query.order).substring(String(query.order).indexOf(":")+1)]
                ],
                logging: true
            }),
            Patient.count({
                col: 'id',
                where:{
                    gender: query.gender,
                }
            })
        ])

        return res.json({
            patients: map(patients, (patient) => {
                const age = calculateAgeFromBirthdate (patient.birthdate)
                const personType = getPersonType(age, patient.weight)
                const substanceAmount = calculateSubstanceAmount(personType, patient.weight)
                return {
                    id: patient.id,
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    birthdate: patient.birthdate,
                    weight: patient.weight,
                    height: patient.height,
                    identificationNumber: patient.identificationNumber,
                    gender: patient.gender,
                    age,
                    personType,
                    substanceAmount,
                    diagnose: patient.diagnose
                        ? {
                            id: patient.diagnose.id,
                            name: patient.diagnose.name,
                            description: patient.diagnose.description,
                            substance: patient.diagnose.substance
                                ? {
                                    id: patient.diagnose.substance.id,
                                    name: patient.diagnose.substance.name,
                                    timeUnit: patient.diagnose.substance.timeUnit,
                                    halfLife: patient.diagnose.substance.halfLife
                                }
                                : null
                        }
                        : null
                }
            }),
            pagination:{
                offset: ((query.limit===undefined) ? 0 : Number(query.limit)) * ((query.page===undefined) ? 0:(Number(query.page)-1)),
                limit: (query.limit===undefined) ? defPageLimit : Number(query.limit),
                totalPages: Math.ceil(patientCount / Number((query.limit===undefined) ? defPageLimit : Number(query.limit))) || 0,
                totalCount: patientCount
            }
        })
    }catch(error){
        return next(error)
    }
}