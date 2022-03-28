import {Request, Response} from 'express'

export const workflow = (req: Request, res: Response) => {
    // prečítame záznam z databázy kde je id pacienta z parametra
    // ak nevráti pacienta, pacient neexistuje
    // v opačnom prípade existuje a vráti sa

    let exampleOne = {
        "firstName": "string",
        "lastName": "string",
        "birthdate": "2022-03-25T11:28:35.964Z",
        "weight": 0,
        "height": 0,
        "identificationNumber": "string",
        "gender": "MALE",
        "age": 0,
        "personType": "ADULT",
        "substanceAmount": 0,
        "diagnose": {
            "id": 0,
            "name": "string",
            "description": "string",
            "substance": {
                "id": 0,
                "name": "string",
                "timeUnit": "SECOND",
                "halfLife": 0
            }
        }
    }

    res.json({
        "patient": exampleOne
    })
}