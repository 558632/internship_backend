import {DataTypes, Model, Sequelize} from 'sequelize'
import {PatientModel} from "./patients";
import {SubstanceModel} from "./substances"
import {Models} from './../index'

export class UserModel extends Model {
    identificationNumber: number
    // FK
    user_role_fk: number
}

export default (sequelize: Sequelize, modelName: string) =>{
    UserModel.init({
        identificationNumber: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: false
        },
        // FK
        user_role_fk: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{
        paranoid: false,
        timestamps: false,
        sequelize,
        modelName,
        tableName: 'users'
    });
    return UserModel
}