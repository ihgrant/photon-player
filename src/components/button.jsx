const React = require('react');

const Button = React.createClass({
	propTypes: {
		text: React.PropTypes.string.isRequired,
		disabled: React.PropTypes.bool,
		onClick: React.PropTypes.func
	},
	getDefaultProps: function() {
		return {
			disabled: false
		};
	},
	render: function() {
		return (
			<button onClick={this.props.onClick}
				disabled={this.props.disabled}>
				{this.props.text}
			</button>
		);
	}

});

module.exports = Button;
