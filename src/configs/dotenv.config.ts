const dotenv = require("dotenv");
const result = dotenv.config({
  path: `.env.${process.env["NODE_ENV"]}`.trim(),
});
if (result.error) {
  throw result.error;
}

export default dotenv