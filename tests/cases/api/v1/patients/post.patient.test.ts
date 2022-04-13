import supertest from 'supertest'
import {expect} from 'chai'
import app from './../.././../../../src/app'
import { GENDER } from '../../../../../src/utils/enums'


const url = '/api/v1/patients'

describe(`[POST] ${url}`, () =>{
    it('Response should return 404 - diagnose not found.', async () => {
        const data = {
            firstName: "Lukas",
            lastName: "LUkas",
            birthdate: "2012-07-23T07:35:58.902Z",
            weight: 138,
            height: 485,
            identificationNumber: "111111115588",
            gender: GENDER.MALE,
            diagnoseID: 14732111
        }
        const response = await supertest(app)
            .post(url)
            .send(data)
        console.log(response.error)
        expect(response.status).to.eq(404)
        expect(response.type).to.eq('application/json')
    })
    it('Response should return 409 - conflict with existing record in database.', async()=>{
        const data = {
            firstName: "Lukas",
            lastName: "LUkas",
            birthdate: "2012-07-23T07:35:58.902Z",
            weight: 138,
            height: 485,
            identificationNumber: "001024hvvnmp",
            gender: "FEMALE",
            diagnoseID: 14732
        }
        const response = await supertest(app)
            .post(url)
            .send(data)
        console.log(response.error)
        expect(response.status).to.eq(409)
        expect(response.type).to.eq('application/json')
    })
    it('Response should return 400 - maximal number of chars exceeded for firstName.', async()=>{
        const data = {
            firstName: "Lukasffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            lastName: "LUkas",
            birthdate: "2012-07-23T07:35:58.902Z",
            weight: 138,
            height: 485,
            identificationNumber: "111111115588",
            gender: "FEMALE",
            diagnoseID: 14732
        }
        const response = await supertest(app)
            .post(url)
            .send(data)
        console.log(response.error)
        expect(response.status).to.eq(400)
        expect(response.type).to.eq('application/json')
    })
})