// hyaloid v1.2.0
// A very simple, zero-dependency, text editor html component.
// by Joshua T Kalis <kalisjoshua@gmail.com>
var hyaloid = (function () {
  'use strict';

  function debounce(fn, delay) {
    let pending;

    function postponed(...args) {
      if (pending) {
        clearTimeout(pending);
      }

      pending = setTimeout(fn.bind(this, ...args), delay || 60);
    }

    return postponed;
  }

  // `Array.apply(0, new Array(diff))` creates a non-sparse array
  const range = (from, to, inclusive) => Array
    .apply(0, new Array(+!!inclusive + (to ? (to - from) : from)))
    .map((_, i) => i + (to ? from : 1));

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

  function hyaloidEditor(selector) {
    const element = document.querySelector(selector);
    const events = {};
    const validEvents = ['edit'];

    const api = {
      get content() {
        return element.editor.value;
      },

      get errors() {
        return element.lineError;
      },

      get hasErrors() {
        return !!Object.keys(element.lineError).length;
      },

      get lineCount() {
        return element.lineCount;
      },

      on(event, fn) {
        /* istanbul ignore else */
        if (!event || typeof event !== 'string') {
          throw new Error(`Event names must be Strings: "${typeof event}" provided.`);
        } else if (!validEvents.includes(event)) {
          throw new Error(`Event names must be one of [${validEvents}]: "${event}" provided.`);
        } else if (!fn || typeof fn !== 'function') {
          throw new Error(`Event handlers must be Functions: "${typeof fn}" provided.`);
        }

        events[event] = (events[event] || []).concat(fn);

        return api;
      },

      reset() {
        api.setError();

        return api;
      },

      setContent(content) {
        element.editor.value = content || '';

        return api.trigger('edit');
      },

      setError(line, title) {
        if (!line) {
          element.lineError = {};
        } else if (!title) {
          delete element.lineError[line];
        } else {
          element.lineError[line] = title;
        }

        return api;
      },

      trigger(event) {
        /* istanbul ignore else */
        if (!validEvents.includes(event)) {
          throw new Error(`Attempting to trigger an invalid event "${event}"`);
        } else if (!events[event]) {
          // eslint-disable-next-line no-console
          console.warn(`No event handler registered for "${event}"`);
        }

        ([...events[event]]).forEach((f) => f(api));

        return api;
      },
    };

    function insert() {
      const ins = document.createElement('ins');

      ins.setAttribute('class', 'lineNumber');
      ins.innerHTML = '&nbsp;';

      element.lineNumbers.append(ins);
    }

    /* istanbul ignore else */
    if (!element.dataset.initialized) {
      const initialContent = element.innerHTML
        .trim()
        .split('\n')
        .map((line) => line.replace(/^\s+/, ''))
        .join('\n');

      element.editor = document.createElement('textarea');
      element.editor.setAttribute('autocapitalize', 'off');
      element.editor.setAttribute('autocomplete', 'off');
      element.editor.setAttribute('autocorrect', 'off');
      element.editor.setAttribute('spellcheck', 'false');
      element.editor.setAttribute('name', 'hyaloidEditor');
      /* istanbul ignore next */
      element.editor.addEventListener('keyup', debounce(() => api.trigger('edit')));
      /* istanbul ignore next */
      element.editor.addEventListener('scroll', debounce((event) => {
        element.lineNumbers.style.top = `-${event.target.scrollTop}px`;
      }, 10));

      element.lineError = {};

      element.lineNumbers = document.createElement('pre');
      element.lineNumbers.classList.add('lineNumbers');

      element.innerText = '';
      element.appendChild(element.lineNumbers);
      element.appendChild(element.editor);

      api.on('edit', () => {
        const linesOfContent = element.editor.value
          .replace(/\n|<br\s*\/?>/g, '\n')
          .split(/\n/g)
          .length;

        element.lineCount = Math.max(1, linesOfContent);
      });

      api.setContent(initialContent);

      lineNumbersUpdate(element, insert);

      element.dataset.initialized = true;
    }

    return api;
  }

  return hyaloidEditor;

}());
