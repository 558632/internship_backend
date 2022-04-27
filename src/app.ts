import express from 'express'
import router1 from './api/v1'
import passport from 'passport'
import {ExtractJwt, Strategy as JwtStrategy, VerifiedCallback} from "passport-jwt";
import { Request } from 'express';
import {USER_ROLE} from "./utils/enums";

passport.use('jwt-api', new JwtStrategy({
    audience: 'jwt-api',
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), ExtractJwt.fromUrlQueryParameter('token')]),
    passReqToCallback: true,
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: true
}, (req: Request, payload: { userID: number, identificationNumber: string, aud: string}, done: VerifiedCallback)=>{
    console.log(payload)
    let user
    if([1,2,3].indexOf(payload.userID)<0){
        throw new Error('Unauthorized')
    }
    if(payload.userID===1){
        user={
            id: payload.userID,
            identificationNumber: payload.identificationNumber,
            role: USER_ROLE.USER
        }
    }else if(payload.userID===2){
        user={
            id: payload.userID,
            identificationNumber: payload.identificationNumber,
            role: USER_ROLE.ADMIN
        }
    }else{
        user={
            id: payload.userID,
            identificationNumber: payload.identificationNumber,
            role: USER_ROLE.SUPER_ADMIN
        }
    }
    done(null, user)
}))

passport.serializeUser((user, done)=>done(null,user))

passport.deserializeUser((user, done)=>done(null,user))

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(passport.initialize())

//Register router
app.use('/api/v1', router1())

export default app