'use strict';

var React = require('react');
var Datagrid = require('react-datagrid');

var Playlist = React.createClass({
	displayName: 'Playlist',

	propTypes: {
		files: React.PropTypes.array,
		selectedFile: React.PropTypes.string,
		onSelectFile: React.PropTypes.func
	},
	render: function render() {
		var columns = [{ name: 'track', title: '#', render: function render(v) {
				return v.no;
			}, width: 30 }, { name: 'artist' }, { name: 'album' }, { name: 'title' }];

		return React.createElement(Datagrid, { idProperty: 'path',
			dataSource: this.props.files,
			columns: columns,
			selected: this.props.selectedFile,
			onSelectionChange: this.props.onSelectFile,
			emptyText: 'No music loaded.' });
	}

});

module.exports = Playlist;