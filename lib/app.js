'use strict';

var React = require('react');
var remote = require('remote');
var finder = require('./finder.js');
var Button = require('./components/button.js');
var Playlist = require('./components/playlist.js');
var audio = new Audio();

var App = React.createClass({
	displayName: 'App',

	addFolder: function addFolder() {
		var _this = this;

		var dialog = remote.require('dialog');
		var dir = dialog.showOpenDialog({
			properties: ['openDirectory']
		});
		var currentFiles = this.state.files;

		if (dir) {
			finder.getFiles(dir[0], function (err, files) {
				_this.setState({
					files: currentFiles.concat(files)
				});
			});
		}
	},
	openFolder: function openFolder() {
		var _this2 = this;

		var dialog = remote.require('dialog');
		var dir = dialog.showOpenDialog({
			properties: ['openDirectory']
		});

		if (dir) {
			finder.getFiles(dir[0], function (err, files) {
				if (files.length) {
					_this2.setState({
						files: files,
						currentTrackData: _this2.state.currentTrackData !== '' ? files[0] : _this2.state.currentTrackData
					});
				}
			});
		}
	},
	chooseTrack: function chooseTrack(path, data) {
		var _this3 = this;

		var currentlyPlaying = this.state.playing;

		audio.src = path;
		this.setState({
			currentTrackData: data,
			playing: false,
			currentTime: 0
		}, function () {
			document.title = data.artist + ' - ' + data.title;
			if (currentlyPlaying) {
				_this3.playTrack();
			}
		});
	},
	playTrack: function playTrack() {
		this.setState({ playing: true });
		audio.play();
	},
	pauseTrack: function pauseTrack() {
		this.setState({ playing: false });
		audio.pause();
	},
	previousTrack: function previousTrack() {
		var _this4 = this;

		var files = this.state.files;
		var newData = {};

		files.forEach(function (file, i) {
			if (file.path === _this4.state.currentTrackData.path && i !== 0) {
				newData = files[i - 1];
				return false;
			}
		});
		this.chooseTrack(newData.path, newData);
	},
	nextTrack: function nextTrack() {
		var _this5 = this;

		var files = this.state.files;
		var newData = {};

		files.forEach(function (file, i) {
			if (file.path === _this5.state.currentTrackData.path && i !== files.length - 1) {
				newData = files[i + 1];
				return false;
			}
		});
		this.chooseTrack(newData.path, newData);
	},
	updateTime: function updateTime() {
		this.setState({ currentTime: audio.currentTime });
	},
	updateDuration: function updateDuration() {
		this.setState({ duration: audio.duration });
	},
	componentDidMount: function componentDidMount() {
		audio.addEventListener('timeupdate', this.updateTime);
		audio.addEventListener('durationchange', this.updateDuration);
		audio.addEventListener('ended', this.nextTrack);
	},
	getInitialState: function getInitialState() {
		return {
			files: [],
			playing: false,
			selectedTrack: '',
			currentTrackData: {},
			currentTime: 0,
			duration: 0
		};
	},
	render: function render() {
		var playButton = React.createElement(Button, { text: 'play',
			disabled: this.state.currentTrack === '',
			onClick: this.playTrack });
		var pauseButton = React.createElement(Button, { text: 'pause',
			disabled: this.state.currentTrack === '',
			onClick: this.pauseTrack });
		var nextButton = React.createElement(Button, { text: 'next',
			disabled: this.state.currentTrack === '',
			onClick: this.nextTrack });
		var prevButton = React.createElement(Button, { text: 'prev',
			disabled: this.state.currentTrack === '',
			onClick: this.previousTrack });
		var openFolderButton = React.createElement(Button, { text: 'open folder...',
			onClick: this.openFolder });
		var addFolderButton = React.createElement(Button, { text: 'add folder...',
			onClick: this.addFolder });
		var imageData = this.state.currentTrackData.picture && this.state.currentTrackData.picture.length ? this.state.currentTrackData.picture[0].data.toString('base64') : '';

		return React.createElement(
			'div',
			{ style: { height: '100vh' } },
			React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ style: { float: 'left' } },
					prevButton,
					this.state.playing ? pauseButton : playButton,
					nextButton
				),
				React.createElement(
					'div',
					{ style: { float: 'right' } },
					openFolderButton,
					addFolderButton
				),
				React.createElement('progress', { max: this.state.duration, value: this.state.currentTime, style: { width: '100%' } })
			),
			React.createElement(
				'div',
				{ style: { height: '10vh' } },
				React.createElement('image', { style: { maxHeight: '10vh' },
					src: imageData.length ? 'data:image/png;base64,' + imageData : '' })
			),
			React.createElement(
				'div',
				{ style: {} },
				React.createElement(Playlist, { files: this.state.files,
					selectedFile: this.state.currentTrackData.path,
					onSelectFile: this.chooseTrack })
			),
			React.createElement(
				'p',
				null,
				'io.js ' + process.version + ' and Electron ' + process.versions.electron
			)
		);
	}

});

module.exports = App;