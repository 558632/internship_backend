export enum GENDER{
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export enum SUBSTANCE_TIME_UNIT {
    SECOND='SECOND',
    MINUTE='MINUTE',
    HOUR='HOUR',
    DAY='DAY'
}
export enum RECORS_LIMIT {
    _25=25,
    _50=50,
    _100=100
}
export const RECORS_LIMITS = Object.values(RECORS_LIMIT)
export const GENDERS = Object.values(GENDER)
export const SUBSTANCE_TIME_UNITS = Object.values(SUBSTANCE_TIME_UNIT)