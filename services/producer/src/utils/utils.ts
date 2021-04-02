require("dotenv").config();
export const getEnv = (): typeof process.env => {
  return {
    PRODUCER_PORT: process.env.PRODUCER_PORT,
  };
};
