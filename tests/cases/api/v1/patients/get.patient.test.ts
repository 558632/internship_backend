import {expect} from 'chai'
import supertest = require("supertest");
import app from './../.././../../../src/app'
import {responseSchema} from "../../../../../src/api/v1/patients/get.patient_patientID";

const endpoint = (patientID: number | string) => `/api/v1/patients/${patientID}`

describe(`[GET] ${endpoint(':patientID')}`,()=>{
    it('Response should return code 200', async()=> {
        const response = await supertest(app)
            .get(endpoint(19))
            .set('Content-Type', 'application/json')
        expect(response.status).to.eq(200)
        expect(response.type).to.eq('application/json')
        const validationResult = responseSchema.validate(response.body)
        //console.log(validationResult.error)
        expect(validationResult.error).to.eq(undefined)
    })
})