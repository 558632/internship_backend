import {expect} from 'chai'
import supertest = require("supertest");
import app from './../.././../../../src/app'

const endpoint = (patientID: number | string) => `/api/v1/patients/${patientID}`

describe(`[PATCH] ${endpoint(':patientID')}`,()=>{
    it('Response should return code 404 - patient with such a id is not present in database.', async()=> {
        const data={
            identificationNumber: "ddddeeeetttt",
            gender: "FEMALE",
            diagnoseID: 14732
        }
        const response = await supertest(app)
            .patch(endpoint(1999999))
            .set('Content-Type', 'application/json')
            .send(data)
        console.log(response.error)
        expect(response.status).to.eq(404)
        expect(response.type).to.eq('application/json')
    })
    it('Response should return code 404 - diagnose not found.', async()=> {
        const data={
            identificationNumber: "ddddeeeetttt",
            gender: "FEMALE",
            diagnoseID: 14732111
        }
        const response = await supertest(app)
            .patch(endpoint(28))
            .set('Content-Type', 'application/json')
            .send(data)
        console.log(response.error)
        expect(response.status).to.eq(404)
        expect(response.type).to.eq('application/json')
    })
    it('Response should return code 409 - confilict with identificationNumber of another patient present in database..', async()=> {
        const data={
            identificationNumber: "160701yrtuvl",
            gender: "FEMALE",
            diagnoseID: 14732
        }
        const response = await supertest(app)
            .patch(endpoint(28))
            .set('Content-Type', 'application/json')
            .send(data)
        console.log(response.error)
        expect(response.status).to.eq(409)
        expect(response.type).to.eq('application/json')
    })
})