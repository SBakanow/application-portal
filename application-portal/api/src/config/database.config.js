import 'dotenv/config'

export const config = {
  development: {
    dialect: 'sqlite',
    storage: './src/database.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory',
  },
  production: {
    dialect: 'sqlite',
    storage: './src/database.sqlite',
  },
}
