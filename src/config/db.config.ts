interface DBConfig {
  [key: string]: {
    username: string
    password: string
    database: string
    host: string
    port: number
    dialect: string
  }
}

export const dbConfig: DBConfig = {
  development: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'finance_tracker',
    host: process.env.MYSQL_HOST || 'mysql',
    port: Number(process.env.MYSQL_PORT) || 3306,
    dialect: 'mysql',
  },
  test: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'finance_tracker_test',
    host: process.env.MYSQL_HOST || 'mysql',
    port: Number(process.env.MYSQL_PORT) || 3306,
    dialect: 'mysql',
  },
  production: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'finance_tracker',
    host: process.env.MYSQL_HOST || 'mysql',
    port: Number(process.env.MYSQL_PORT) || 3306,
    dialect: 'mysql',
  },
}