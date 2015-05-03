'use strict';

var React = require('react');

var Button = React.createClass({
	displayName: 'Button',

	propTypes: {
		text: React.PropTypes.string.isRequired,
		disabled: React.PropTypes.bool,
		onClick: React.PropTypes.func
	},
	getDefaultProps: function getDefaultProps() {
		return {
			disabled: false
		};
	},
	render: function render() {
		return React.createElement(
			'button',
			{ onClick: this.props.onClick,
				disabled: this.props.disabled },
			this.props.text
		);
	}

});

module.exports = Button;