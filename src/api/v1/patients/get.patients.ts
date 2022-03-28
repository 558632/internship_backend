import {Request, Response} from 'express'

export const workflow = (req: Request, res: Response) => {
    //res.send('This is my response')
    res.json({
        patients: [{
            id: 1,
            name: "john john"
        }]
    })
}