import dayjs from "dayjs"
import {PERSON_TYPE} from "./enums";

const ADULT_PERSON_TYPE_MIN_AGE = 18
const ADULT_PERSON_TYPE_MIN_WEIGHT = 68
let CALCULATION_PARAM:any= []
CALCULATION_PARAM[PERSON_TYPE.ADULT] = {
    paramA: 2,
    paramB: 30,
    maxLimit: 220
}
CALCULATION_PARAM[PERSON_TYPE.CHILD]={
    paramA: 1.6,
    paramB: 20,
    maxLimit: 150
}

export const calculateAgeFromBirthdate = (birthdate: string): number =>{
    const differenceInYears = dayjs().diff(dayjs(birthdate), 'years')
    if(dayjs(birthdate).isAfter(dayjs(), 'date')){
        throw new Error ('birthdate must not be in future')
    }
    return Number(differenceInYears.toFixed(0))
}
export const isAdult = (age: number, weight: number) => age >= ADULT_PERSON_TYPE_MIN_AGE || weight >= ADULT_PERSON_TYPE_MIN_WEIGHT

export const getPersonType = (age:number, weight:number): PERSON_TYPE => (isAdult(age, weight) ? PERSON_TYPE.ADULT : PERSON_TYPE.CHILD)

export const calculateSubstanceAmount = (personType: PERSON_TYPE, weight: number): number | null =>{
    const {paramA, paramB, maxLimit} = CALCULATION_PARAM[personType]
    let amount = null
    if(weight>0){
        amount = (paramA*weight)+paramB
        amount = Math.min(amount, maxLimit)
        amount = Number(`${Math.round(amount * 100)}`)/100
    }
    return amount
}