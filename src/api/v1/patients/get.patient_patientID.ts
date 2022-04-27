import {Request, Response, NextFunction} from 'express'
import Joi from 'joi'
import {models} from "../../../db";
import {calculateAgeFromBirthdate, getPersonType, calculateSubstanceAmount} from "./../../../utils/pat"
import {GENDERS, PERSON_TYPES, SUBSTANCE_TIME_UNITS, USER_ROLE} from "../../../utils/enums";

export const schema = Joi.object({
    body: Joi.object(),
    query: Joi.object(),
    params: Joi.object({
        patientID: Joi.number().integer().required()
    })
})

export const responseSchema = Joi.object({
    patient:Joi.object({
        id: Joi.number().integer().min(1).required(),
        firstName: Joi.string().max(100).required(),
        lastName: Joi.string().max(100).required(),
        birthdate: Joi.date().iso().required(),
        weight: Joi.number().integer().min(1).max(200).required(),
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
})

export const workflow = async (req: Request, res: Response, next:NextFunction) => {
    try{
        const {params, user}= req
        const {Patient,Diagnose,Substance,User} = models

        const patient = await Patient.findByPk(parseInt(params.patientID, 10),{
            attributes: ['id', 'firstName', 'lastName', 'birthdate', 'weight', 'height', 'identificationNumber', 'gender'],
            include:[{
                model: Diagnose,
                required: true,
                attributes: ['id','name','description'],
                include:[{
                    model: Substance,
                    required:true,
                    attributes:['id','name','timeUnit','halfLife']
                }]
            }]
        })
        if (!patient){
            res.status(404).json({
                message: 'Patient with such a id specified is not present in database.'
            })
        }else if (user.role === USER_ROLE.USER && user.identificationNumber !== patient.identificationNumber){
            res.status(404).json({
                message: 'Patient do not requires his data.'
            })
        }else{
            const age = calculateAgeFromBirthdate(patient.birthdate)
            const personType = getPersonType(age, patient.weight)
            const substanceAmount = calculateSubstanceAmount(personType, patient.weight)

            return res.json({
                patient: {
                    id:patient.id,
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
                        ?{
                            id:patient.diagnose.id,
                            name: patient.diagnose.name,
                            description: patient.diagnose.description,
                            substance: patient.diagnose.substance
                                ?{
                                    id:patient.diagnose.substance.id,
                                    name:patient.diagnose.substance.name,
                                    timeUnit:patient.diagnose.substance.timeUnit,
                                    halfLife:patient.diagnose.substance.halfLife
                                }
                                :null
                        }
                        :null
                }
            })
        }
    }catch(error){
        return next(error)
    }
}