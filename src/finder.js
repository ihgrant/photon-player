const fs = require('fs');
const find = require('findit');
const mm = require('musicmetadata');
const async = require('async');

const getFiles = (dir, callback) => {
	const finder = find(dir, null);
	let files = [];
	let cover = '';

	finder.on('file', (file, stat) => {
		files.push(file);
	});
	finder.on('end', () => {
		files = files.filter((file) => {
			return isMusic(file);
		});
		async.map(files, getFileInfo, (err, result) => {
			callback(null, result);
		});
	});
	finder.on('error', (err) => {
		callback(err, files);
	});
};

const getFileInfo = (file, callback) => {
	const stream = fs.createReadStream(file);
	const parser = mm(stream, (err, metadata) => {
		metadata.path = file;
		callback(err, metadata);
	});
};

const isMusic = (filename) => {
	const a = filename.split('.');
	const ext = a[a.length-1];
	const valid = [
		'mp3',
		'wav'
	];
	return (valid.indexOf(ext) !== -1);
};

const isCoverImage = (filename) => {
	const a = filename.split('.');
	const ext = a[a.length-1];
	const valid = [
		'jpg',
		'png'
	];
	return (valid.indexOf(ext) !== -1);
};

module.exports = {
	getFiles: getFiles,
	getFileInfo: getFileInfo,
	isMusic: isMusic,
	isCoverImage: isCoverImage
};
