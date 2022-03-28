import { Router } from 'express'
import * as GetPatients from './get.patients'
import * as GetPatient_patientID from './get.patient_patientID'
import * as PostPatient from './post.patient'
import * as UpdatePatient_patientID from './patch.patient_patientID'
import * as DeletePatient_patientID from './delete.patient_patientID'
import validationMiddlewares from './../../../middlewares/validationMiddlewares'
import validatePerson from './../../../middlewares/validatePerson_mi'

const router = Router()

export default () => {
    router.get('/', validationMiddlewares(), GetPatients.workflow)
    router.post('/', validatePerson(), PostPatient.workflow)
    router.get('/:patientID', GetPatient_patientID.workflow)
    router.patch('/:patientID', validatePerson(), UpdatePatient_patientID.workflow)
    router.delete('/:patientID', DeletePatient_patientID.workflow)
    return router
}