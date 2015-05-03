const React = require('react');
const Datagrid = require('react-datagrid');

const Playlist = React.createClass({
	propTypes: {
		files: React.PropTypes.array,
		selectedFile: React.PropTypes.string,
		onSelectFile: React.PropTypes.func
	},
	render: function() {
		const columns = [
			{name: 'track', title: '#', render: (v) => { return v.no }, width: 30},
			{name: 'artist'},
			{name: 'album'},
			{name: 'title'}
		];

		return (
			<Datagrid idProperty='path'
				dataSource={this.props.files}
				columns={columns}
				selected={this.props.selectedFile}
				onSelectionChange={this.props.onSelectFile}
				emptyText={'No music loaded.'} />
		);
	}

});

module.exports = Playlist;
