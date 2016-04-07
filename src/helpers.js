const filterText = text => text.toString().replace(/\D/g, '');

const isAllZeros = number => number === '0' || number[0] === '0' && /^(.)\1+$/.test(number);

const handlePadding = text => {
  let number = text.toString();
  let padding = '';

  if (isAllZeros(number)) return '000';

  number = number.toString().replace(/^0+/, '');

  if (number.length === 1) padding = '00';
  if (number.length === 2) padding = '0';

  return padding + number;
};

const insertDecimal = text => {
  if (text === '') return text;

  const beforeDecimalIndex = text.length - 2;
  const beforeDecimal = text.substr(0, beforeDecimalIndex);
  const afterDecimal = text.substr(beforeDecimalIndex, text.length);

  return `${beforeDecimal}.${afterDecimal}`;
};

const insertCommas = text => text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

module.exports = {
  isAllowedKey(event) {
    const key = event.keyCode;
    const cmndOrCtrl = event.ctrlKey === true || event.metaKey === true;

        // Allow: backspace, delete, tab, escape, enter, .
    if ([46, 8, 9, 27, 13, 110].indexOf(key) !== -1 ||
        // Allow: command + A, control + A
        (key === 65 && cmndOrCtrl) ||
        // Allow: home, end, left, right, down, up
        (key >= 35 && key <= 40) ||
        // Allow: paste (command + V, control + V)
        (key === 86 && cmndOrCtrl)) {
      return true;
    }

    // Ensure that any other key is a number
    if ((event.shiftKey || (key < 48 || key > 57)) &&
        (key < 96 || key > 105)) {
      return false;
    }

    return true;
  },

  removeSelectedText(input) {
    const text = input.value;

    if (isAllZeros(filterText(text))) return '';

    let newText = text;
    let selectionStart = input.selectionStart;

    const selectionEnd = input.selectionEnd;
    const isHighlighted = selectionStart !== selectionEnd;

    if (!isHighlighted) --selectionStart;

    newText = text.slice(0, selectionStart) + text.slice(selectionEnd);

    return newText;
  },

  insertNewText(input, newText) {
    const text = input.value;
    const cursorStart = input.selectionStart;
    const cursorEnd = input.selectionEnd;

    return text.slice(0, cursorStart) + newText + text.slice(cursorEnd);
  },

  formatAsNumber(text) {
    let number = filterText(text);

    number = handlePadding(number);
    number = insertDecimal(number);
    number = insertCommas(number);

    return number.length > 1 ? number : '';
  },

  convertToNumber(text) {
    const number = text.toString().replace(/\$|,/g, '');

    return number !== '' ? Number(number) : NaN;
  },
};
