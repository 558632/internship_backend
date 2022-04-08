import {Request, Response, NextFunction} from 'express'
import Joi from 'joi'
import {models} from "../../../db";
import {calculateAgeFromBirthdate, getPersonType, calculateSubstanceAmount} from "./../../../utils/pat"

export const schema = Joi.object({
    body: Joi.object(),
    query: Joi.object(),
    params: Joi.object({
        patientID: Joi.number().integer().required()
    })
})

export const workflow = async (req: Request, res: Response, next:NextFunction) => {
    try{
        const {params} = req
        const {Patient,Diagnose,Substance} = models

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