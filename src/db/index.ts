import {Sequelize} from 'sequelize'
import * as database from './../../config/database'
import defineSubstance from './models/substances'
import defineDiagnose from './models/diagnoses'
import definePatient from './models/patients'
import {forEach} from "lodash";

const env = process.env.NODE_ENV
const { url, options } = (database as any)[env]

const sequalize = new Sequelize(url, options)

sequalize
    .authenticate()
    .then(() => console.log("Database connection has been established succesfully."))
    .catch((err) => console.log(`Unable to connect to database ${err.messages}`))

const modelsBuilder = (instance: Sequelize) => ({
    Substance: defineSubstance(instance, 'substance'),
    Diagnose: defineDiagnose(instance,'diagnose'),
    Patient: definePatient(instance, 'patient')
})
const buildModels = () =>{
    const models = modelsBuilder(sequalize)
    forEach(models, (model: any)=>{
        if(model.associate){
            model.associate(models)
        }
    })
    return models
}
const models = buildModels()
type Models = typeof models
export type {Models}
export {models}
export default sequalize