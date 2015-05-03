var React = require('react');

var AudioPlayer = React.createClass({
	propTypes: {
		source: React.PropTypes.string.isRequired,
		showControls: React.PropTypes.bool
	},
	getDefaultProps: function() {
		return {
			showControls: true
		};
	},
	render: function() {
		return (
			<audio src={this.props.source} controls={this.props.showControls}>
				<p>{'audio is not supported in this browser!'}</p>
			</audio>
		);
	}

});

module.exports = AudioPlayer;
