export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: '' + process.env.JWT_SECRET,
});
