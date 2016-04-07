const React = require('react');
const helpers = require('./helpers.js');

const AutoDecimal = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    className: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    initialValue: React.PropTypes.string,
    afterFormat: React.PropTypes.func,
    currency: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      currency: false,
    };
  },

  getInitialState() {
    const initialValue = this.props.initialValue || '';
    const formattedValue = helpers.formatAsNumber(initialValue);

    return {
      values: {
        unformatted: initialValue,
        formatted: formattedValue,
        number: helpers.convertToNumber(formattedValue),
      },
    };
  },

  onKeyDown(event) {
    const key = event.keyCode;
    const backspace = 8;

    if (!helpers.isAllowedKey(event)) {
      event.preventDefault();

      return false;
    }

    if (key === backspace) {
      event.preventDefault();

      const input = event.currentTarget;
      const newText = helpers.removeSelectedText(input);

      this.setValues(newText);

      return false;
    }

    return true;
  },

  onKeyPress(event) {
    const key = event.charCode;
    const enter = 13;

    if (key !== enter) {
      event.preventDefault();

      const character = key !== 0 ? String.fromCharCode(key) : '';
      const newText = helpers.insertNewText(event.currentTarget, character);

      this.setValues(newText);

      return false;
    }

    return true;
  },

  onPaste(event) {
    event.preventDefault();

    const pasteText = event.clipboardData.getData('Text');
    const input = event.currentTarget;
    const newText = helpers.insertNewText(input, pasteText);

    this.setValues(newText);
  },

  setValues(unformatted) {
    let formatted = helpers.formatAsNumber(unformatted);

    if (this.props.currency && formatted.length) formatted = `$${formatted}`;

    const number = helpers.convertToNumber(formatted);

    this.setState({
      values: {
        unformatted,
        formatted,
        number,
      },
    });

    const afterFormat = this.props.afterFormat;

    if (typeof(afterFormat) === 'function') afterFormat(this.state.values);
  },

  render() {
    const props = this.props;

    return (
      <input id={props.id}
        name={props.name}
        className={props.className}
        placeholder={props.placeholder}
        value={this.state.values.formatted}
        type="text"
        autoComplete="off"
        pattern="[0-9]*"
        inputMode="numeric"
        onKeyDown={this.onKeyDown}
        onKeyPress={this.onKeyPress}
        onPaste={this.onPaste} />
    );
  },
});

module.exports = AutoDecimal;
