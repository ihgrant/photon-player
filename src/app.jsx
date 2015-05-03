const React = require('react');
const remote = require('remote');
const finder = require('./finder.js');
const Button = require('./components/button.js');
const Playlist = require('./components/playlist.js');
const audio = new Audio();

const App = React.createClass({
	addFolder: function () {
		const dialog = remote.require('dialog');
		const dir = dialog.showOpenDialog({
			properties: ['openDirectory']
		});
		const currentFiles = this.state.files;

		if (dir) {
			finder.getFiles(dir[0], (err, files) => {
				this.setState({
					files: currentFiles.concat(files)
				});
			});
		}
	},
	openFolder: function () {
		const dialog = remote.require('dialog');
		const dir = dialog.showOpenDialog({
			properties: ['openDirectory']
		});

		if (dir) {
			finder.getFiles(dir[0], (err, files) => {
				if (files.length) {
					this.setState({
						files: files,
						currentTrackData: this.state.currentTrackData !== '' ? files[0] : this.state.currentTrackData
					});
				}
			});
		}
	},
	chooseTrack: function (path, data) {
		const currentlyPlaying = this.state.playing;

		audio.src = path;
		this.setState({
			currentTrackData: data,
			playing: false,
			currentTime: 0
		}, () => {
			document.title = data.artist+' - '+data.title;
			if (currentlyPlaying) {
				this.playTrack();
			}
		});
	},
	playTrack: function () {
		this.setState({playing: true});
		audio.play();
	},
	pauseTrack: function () {
		this.setState({playing: false});
		audio.pause();
	},
	previousTrack: function () {
		const files = this.state.files;
		let newData = {};

		files.forEach((file, i) => {
			if (file.path === this.state.currentTrackData.path && i !== 0) {
				newData = files[i-1];
				return false;
			}
		});
		this.chooseTrack(newData.path, newData);
	},
	nextTrack: function () {
		const files = this.state.files;
		let newData = {};

		files.forEach((file, i) => {
			if (file.path === this.state.currentTrackData.path && i !== files.length - 1) {
				newData = files[i+1];
				return false;
			}
		});
		this.chooseTrack(newData.path, newData);
	},
	updateTime: function () { this.setState({currentTime: audio.currentTime}) },
	updateDuration: function () { this.setState({duration: audio.duration}) },
	componentDidMount: function() {
		audio.addEventListener('timeupdate', this.updateTime);
		audio.addEventListener('durationchange', this.updateDuration);
		audio.addEventListener('ended', this.nextTrack);
	},
	getInitialState: function() {
		return {
			files: [],
			playing: false,
			selectedTrack: '',
			currentTrackData: {},
			currentTime: 0,
			duration: 0
		};
	},
	render: function() {
		const playButton = <Button text='play'
			disabled={this.state.currentTrack === ''}
			onClick={this.playTrack} />;
		const pauseButton = <Button text='pause'
			disabled={this.state.currentTrack === ''}
			onClick={this.pauseTrack} />;
		const nextButton = <Button text='next'
			disabled={this.state.currentTrack === ''}
			onClick={this.nextTrack} />;
		const prevButton = <Button text='prev'
			disabled={this.state.currentTrack === ''}
			onClick={this.previousTrack} />;
		const openFolderButton = <Button text='open folder...'
			onClick={this.openFolder} />;
		const addFolderButton = <Button text='add folder...'
			onClick={this.addFolder} />
		const imageData = (this.state.currentTrackData.picture && this.state.currentTrackData.picture.length ?
			this.state.currentTrackData.picture[0].data.toString('base64') :
			'');

		return (
			<div style={{height: '100vh'}}>
				<div>
					<div style={{float: 'left'}}>
						{prevButton}
						{this.state.playing ? pauseButton : playButton}
						{nextButton}
					</div>
					<div style={{float: 'right'}}>
						{openFolderButton}
						{addFolderButton}
					</div>
					<progress max={this.state.duration} value={this.state.currentTime} style={{width: '100%'}} />
				</div>
				<div style={{height: '10vh'}}>
					<image style={{maxHeight: '10vh'}}
						src={imageData.length ? 'data:image/png;base64,'+imageData : ''} />
				</div>
				<div style={{}}>
					<Playlist files={this.state.files}
						selectedFile={this.state.currentTrackData.path}
						onSelectFile={this.chooseTrack} />
				</div>
				<p>{'io.js '+process.version+' and Electron '+process.versions['electron']}</p>
			</div>
		);
	}

});

module.exports = App;
