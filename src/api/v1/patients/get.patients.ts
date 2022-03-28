import {Request, Response} from 'express'

export const workflow = (req: Request, res: Response) => {
    //res.send('This is my response')

    let patients: {}[] = [];

    // tu budeme pekne vytvárať nové objekty do premennej patients:object súbežne s tým, ako ich budeme čítať z databázy
    // SQL dotaz na databázu bude obsahovať v klauzule WHERE parameter req.query.gender a v ORDER BY parameter req.query.order
    // teraz zatiaľ pridávame iba príklad jedného jedinca

    let exampleOne = {
        "id": "Nezodpovedá funkcionalite - vyžaduje prácu s databázou",
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

    patients.push(exampleOne);

    res.json({
        "patients": patients,
        "pagination": {
            "limit": req.query.limit,
            "page": req.query.page,
            "totalPages": "počet vrátených záznamov databázou/počet záznamov na stranu",
            "totalCount": "počet vrátených záznamov databázou"
        }
    })
}