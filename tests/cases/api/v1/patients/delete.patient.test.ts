import {expect} from 'chai'
import supertest = require("supertest");
import app from './../.././../../../src/app'

const endpoint = (patientID: number | string) => `/api/v1/patients/${patientID}`

describe(`[DELETE] ${endpoint(':patientID')}`,()=>{
    it('Response should return code 404', async()=> {
        const response = await supertest(app)
            .delete(endpoint(1999999))
            .set('Content-Type', 'application/json')
        console.log(response.error)
        expect(response.status).to.eq(404)
        expect(response.type).to.eq('application/json')
    })
})