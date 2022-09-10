/** 데이터베이스 */
module.exports = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: '1234',
  DB: 'danim',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};