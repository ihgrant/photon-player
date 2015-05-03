'use strict';

var React = require('react');

var AudioPlayer = React.createClass({
	displayName: 'AudioPlayer',

	propTypes: {
		source: React.PropTypes.string.isRequired,
		showControls: React.PropTypes.bool
	},
	getDefaultProps: function getDefaultProps() {
		return {
			showControls: true
		};
	},
	render: function render() {
		return React.createElement(
			'audio',
			{ src: this.props.source, controls: this.props.showControls },
			React.createElement(
				'p',
				null,
				'audio is not supported in this browser!'
			)
		);
	}

});

module.exports = AudioPlayer;