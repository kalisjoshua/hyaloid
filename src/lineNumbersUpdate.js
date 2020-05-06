import range from './range';

const getLineNumbers = (el) => el.lineNumbers.querySelectorAll('ins');

function lineNumbersUpdate(element, insert) {
  const lineNumberElements = getLineNumbers(element);

  /* istanbul ignore else */
  if (element.lineCount !== lineNumberElements.length) {
    /* istanbul ignore else */
    if (element.lineCount > lineNumberElements.length) {
      const diff = element.lineCount - lineNumberElements.length;

      range(diff).forEach(insert);
    } else if (element.lineCount < lineNumberElements.length) {
      const diff = lineNumberElements.length - element.lineCount;
      const numbers = Array.from(lineNumberElements);

      numbers
        .slice(numbers.length - diff)
        .forEach((el) => el.remove());
    }
  }

  /* eslint no-param-reassign:0 */
  // This block of code specifically needs to edit the DOM
  // and therefor break the rules of ESLint temporarily.
  Array.from(getLineNumbers(element))
    .forEach((line, index) => {
      if (element.lineError[index + 1]) {
        line.dataset.hasError = true;
        line.setAttribute('title', element.lineError[index + 1]);
      } else {
        line.dataset.hasError = null;
        line.removeAttribute('title');
      }
    });

  element.editor.style.marginLeft = `${element.lineNumbers.offsetWidth}px`;
  element.editor.style.width = `calc(100% - ${element.editor.style.marginLeft})`;
  /* eslint no-param-reassign:1 */

  setTimeout(() => lineNumbersUpdate(element, insert), 100);
}

export default lineNumbersUpdate;
