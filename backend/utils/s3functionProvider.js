const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/aws");

const uploadTos3Bucket = async (file, fileName) => {
  try {
    const params = {
      Bucket: process.env.s3BUCKETNAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      AWS_REGION: process.env.s3BucketRegion,
    };

    const uploadCommand = new PutObjectCommand(params);
    await s3.send(uploadCommand);
    return `https://${params.Bucket}.s3.${process.env.s3BucketRegion}.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.log(`Error in uploading images to s3 bucket error: ${error}`);
    return new Error(`Error in uploading images to s3 bucket error: ${error}`);
  }
};

const deleteFromS3bucket = async (imageUrl) => {
  try {
    const urlParts = imageUrl.split("/");
    const key = urlParts[urlParts.length - 1];

    const params = {
      Bucket: process.env.s3BUCKETNAME,
      Key: key,
    };

    const deleteCommand = new DeleteObjectCommand(params);
    await s3.send(deleteCommand);
  } catch (error) {
    return new Error(`Error in deleting object from s3 bucket error: ${error}`);
  }
};

module.exports = {
  uploadTos3Bucket,
  deleteFromS3bucket,
};
