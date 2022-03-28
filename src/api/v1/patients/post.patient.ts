import {Request, Response} from 'express'

export const workflow = (req: Request, res: Response) => {

    //zistenie max id pacienta, nový bude mať id +1
    //id pacienta do premennej budeme vracať
    //pridanie do databázy pacienta nového

    res.json({
        "messages": [
            {
                "message": "Zadaného údaje nového pacienta prešli kontrolou.",
                "type": "SUCCESS"
            },
            {
                "message": "Pacient bol úspešne pridaný do databázy.",
                "type": "SUCCESS"
            }
        ],
        "patient": {
            "id": 82426777
        }
    })
}