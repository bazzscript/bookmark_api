export default () => ({
  PORT: Number(process.env.PORT) || 3000,
  jwtSecretToken: process.env.JWT_SECRET_TOKEN,
});
