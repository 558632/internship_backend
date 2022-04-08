import supertest from 'supertest'
import {expect} from 'chai'
import app from './../.././../../../src/app'
import {GENDER} from './../../../../../src/utils/enums'
import {responseSchema} from '../../../../../src/api/v1/patients/get.patients'

const url = '/api/v1/patients'

describe(`[GET] ${url}`, () =>{
    it('Response should return list of patients.', async () => {
        const response = await supertest(app)
            .get(url)
            .set('Content-Type', 'application/json')
            .query({
                gender: GENDER.MALE,
                order: "lastName:asc",
                limit: 25,
                page:1
            })
        console.log(response)
        expect(response.status).to.eq(200)
        expect(response.type).to.eq('application/json')
        const validationResult = responseSchema.validate(response.body)
        expect(validationResult.error).to.eq(undefined)
    })

    it('Response should return list of patients.', async () => {
        const response = await supertest(app)
            .get(url)
            .set('Content-Type', 'application/json')
            .query({
                random: 'random'
            })
        console.log(response)
        expect(response.status).to.eq(400)
        expect(response.type).to.eq('application/json')
    })
})