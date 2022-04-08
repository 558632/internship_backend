import {Request, Response, NextFunction} from 'express'
import {PatientModel} from "../../../db/models/patients";
import {models} from '../../../db'
import {GENDERS, RECORS_LIMITS} from "../../../utils/enums";
import Joi from "joi";
import {map} from "lodash"
import {calculateAgeFromBirthdate, getPersonType, calculateSubstanceAmount} from "./../../../utils/pat"

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