'use strict';

const AWS = require('aws-sdk');
const { promisify } = require('util');

const BUCKET_NAME = process.env['BUCKET_NAME'];

const s3 = new AWS.S3();

exports.startUpload = async (req) => {
	try {
		let params = {
			Bucket: BUCKET_NAME,
			Key: req.query.fileName,
			ContentType: req.query.fileType
		}
		let createUploadPromised = promisify(s3.createMultipartUpload.bind(s3))
		let uploadData = await createUploadPromised(params)

		return ({uploadId: uploadData.UploadId})
	} catch(err) {
		console.log(err)
	}
}

exports.getUploadUrl = async (req) => {
	try {
		let params = {
			Bucket: BUCKET_NAME,
			Key: req.query.fileName,
			PartNumber: req.query.partNumber,
			UploadId: req.query.uploadId
		}

    let uploadPartPromised = promisify(s3.getSignedUrl.bind(s3))
    let presignedUrl = await uploadPartPromised('uploadPart', params)

		return ({presignedUrl})
	} catch(err) {
		console.log(err)
	}
}

exports.completeUpload =  async (req) => {
	try {

		let params = {
			Bucket: BUCKET_NAME,
			Key: req.body.params.fileName,
			MultipartUpload: {
				Parts: req.body.params.parts
			},
			UploadId: req.body.params.uploadId
		}

	    let completeUploadPromised = promisify(s3.completeMultipartUpload.bind(s3))
	    let data = await completeUploadPromised(params)

    return ({data})
	} catch(err) {
		console.log(err)
	}
}

