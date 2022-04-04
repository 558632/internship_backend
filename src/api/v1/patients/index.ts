import { Router } from 'express'
import * as GetPatients from './get.patients'
import * as GetPatient_patientID from './get.patient_patientID'
import * as PostPatient from './post.patient'
import * as UpdatePatient_patientID from './patch.patient_patientID'
import * as DeletePatient_patientID from './delete.patient_patientID'
import validate from '../../../middlewares/validate'

const router = Router()

export default () => {
    router.get('/', validate(GetPatients.schema), GetPatients.workflow)
    router.post('/', validate(PostPatient.schema), PostPatient.workflow)
    router.get('/:patientID', validate(GetPatient_patientID.schema), GetPatient_patientID.workflow)
    router.patch('/:patientID', validate(UpdatePatient_patientID.schema), UpdatePatient_patientID.workflow)
    router.delete('/:patientID', validate(DeletePatient_patientID.schema),DeletePatient_patientID.workflow)
    return router
}