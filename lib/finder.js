'use strict';

var fs = require('fs');
var find = require('findit');
var mm = require('musicmetadata');
var async = require('async');

var getFiles = function getFiles(dir, callback) {
	var finder = find(dir, null);
	var files = [];
	var cover = '';

	finder.on('file', function (file, stat) {
		files.push(file);
	});
	finder.on('end', function () {
		files = files.filter(function (file) {
			return isMusic(file);
		});
		async.map(files, getFileInfo, function (err, result) {
			callback(null, result);
		});
	});
	finder.on('error', function (err) {
		callback(err, files);
	});
};

var getFileInfo = function getFileInfo(file, callback) {
	var stream = fs.createReadStream(file);
	var parser = mm(stream, function (err, metadata) {
		metadata.path = file;
		callback(err, metadata);
	});
};

var isMusic = function isMusic(filename) {
	var a = filename.split('.');
	var ext = a[a.length - 1];
	var valid = ['mp3', 'wav'];
	return valid.indexOf(ext) !== -1;
};

var isCoverImage = function isCoverImage(filename) {
	var a = filename.split('.');
	var ext = a[a.length - 1];
	var valid = ['jpg', 'png'];
	return valid.indexOf(ext) !== -1;
};

module.exports = {
	getFiles: getFiles,
	getFileInfo: getFileInfo,
	isMusic: isMusic,
	isCoverImage: isCoverImage
};