const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(path.resolve(__dirname, "./keys/private.key"), { encoding: "utf8" });
const publicKey = fs.readFileSync(path.resolve(__dirname, "./keys/public.key"), { encoding: "utf8" });

const signOptions = {
  issuer: "Htin",
  subject: "subject@test.com",
  audience: "http://htin.io",
  expiresIn: "24h", // 24 * 60 * 60 * 1000, aka 24 hours
  algorithm: "RS256",
}

module.exports = {
  signOptions,
  privateKey,
  publicKey,
};
