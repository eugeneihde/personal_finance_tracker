import  { Sequelize } from 'sequelize-typescript'
import * as dotenv from 'dotenv'
import { dbConfig } from '../config/db.config'
import User from './models/User'
import Transaction from './models/Transaction'

dotenv.config()

const env = process.env.NODE_ENV || 'development'
const sequelizeConfig = dbConfig[env]

const sequelize = new Sequelize({
  database: sequelizeConfig.database,
  username: sequelizeConfig.username,
  password: sequelizeConfig.password,
  host: sequelizeConfig.host,
  port: sequelizeConfig.port,
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  models: [User, Transaction],
})

// creates table relations
User.hasMany(Transaction, { foreignKey: 'user_id' })
Transaction.belongsTo(User, { foreignKey: 'user_id' })

const testConnection = async (): Promise<boolean> => {  
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    return true
  } catch (error) {
    console.error(`Unable to connect to the database: ${error}`)
    return false
  }
}

export { sequelize, testConnection }