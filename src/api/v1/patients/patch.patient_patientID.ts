import {Request, Response} from 'express'

export const workflow = (req: Request, res: Response) => {
    // prečítame záznam z databázy kde je id pacienta z parametra
    // ak nevráti pacienta, pacient neexistuje
    // v opačnom prípade existuje a aktualizuje sa

    res.json({
        "messages": [
            {
                "message": "Pacient bol zistený v databáze.",
                "type": "SUCCESS"
            },
            {
                "message": "Údaje pacienta boli aktualizované",
                "type": "SUCCESS"
            }
        ]
    })
}