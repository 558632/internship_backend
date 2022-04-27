import { Router } from 'express'
import * as GetPatients from './get.patients'
import * as GetPatient_patientID from './get.patient_patientID'
import * as PostPatient from './post.patient'
import * as UpdatePatient_patientID from './patch.patient_patientID'
import * as DeletePatient_patientID from './delete.patient_patientID'
import validate from '../../../middlewares/validate'
import passport from 'passport'
import permisionMiddleware from "../../../middlewares/permisionMiddleware";
import {USER_ROLE} from "../../../utils/enums";

const router = Router()

export default () => {
    router.get('/',
        passport.authenticate('jwt-api'),
        permisionMiddleware([USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN]),
        validate(GetPatients.requestSchema),
        GetPatients.workflow)
    router.post('/',
        passport.authenticate('jwt-api'),
        permisionMiddleware([USER_ROLE.SUPER_ADMIN]),
        validate(PostPatient.schema),
        PostPatient.workflow)
    router.get('/:patientID',
        passport.authenticate('jwt-api'),
        permisionMiddleware([USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.USER]),
        validate(GetPatient_patientID.schema),
        GetPatient_patientID.workflow)
    router.patch('/:patientID',
        passport.authenticate('jwt-api'),
        permisionMiddleware([USER_ROLE.SUPER_ADMIN]),
        validate(UpdatePatient_patientID.schema),
        UpdatePatient_patientID.workflow)
    router.delete('/:patientID',
        passport.authenticate('jwt-api'),
        permisionMiddleware([USER_ROLE.SUPER_ADMIN]),
        validate(DeletePatient_patientID.schema),
        DeletePatient_patientID.workflow)
    return router
}