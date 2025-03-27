import 'dotenv/config'

export const config = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory',
  },
  production: {
    dialect: 'sqlite',
    storage: './database.sqlite',
  },
}
