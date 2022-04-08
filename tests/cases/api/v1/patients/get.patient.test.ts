import {expect} from 'chai'
import supertest = require("supertest");
import app from './../.././../../../src/app'

const endpoint = (patientID: number | string) => `/api/v1/patients/${patientID}`

describe(`[GET] ${endpoint(':patientID')}`,()=>{
    it('Response should return code 404 patient not found', async()=> {
        const response = await supertest(app)
            .get(endpoint(9999))
            .set('Content-Type', 'application/json')
        expect(response.status).to.eq(404)
    })

    it('Response should return code 200', async()=> {
        const response = await supertest(app)
            .get(endpoint(21))
            .set('Content-Type', 'application/json')
        expect(response.status).to.eq(200)
        expect(response.type).to.eq('application/json')
    })
})