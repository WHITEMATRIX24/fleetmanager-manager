const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv").config();

const s3 = new S3Client({
  region: process.env.s3BucketRegion,
  credentials: {
    accessKeyId: process.env.s3BUCKET_ACCESSID,
    secretAccessKey: process.env.s3BUCKET_SECRET_KEY,
  },
});

module.exports = s3;
