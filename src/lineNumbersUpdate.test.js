import lineNumbersUpdate from './lineNumbersUpdate';

jest.useFakeTimers();

let lineNumbers = [];
let mockEditor;

function mockLineNumberFactory() {
  const obj = Object.create({
    remove() {
      lineNumbers = lineNumbers.slice(1);
    },
    removeAttribute(key) {
      delete obj[key];
    },
    setAttribute(key, value) {
      obj[key] = value;
    },
  });

  obj.setAttribute('dataset', {});

  return obj;
}

const mockInsert = () => lineNumbers.push(mockLineNumberFactory());

function setContent(element, content) {
  /* eslint no-param-reassign:0 */
  // see comment in the source code being tested
  element.editor.value = content;
  element.lineCount = Math.max(1, content.split(/\n/).length);
  /* eslint no-param-reassign:1 */
}

describe('lineNumbersUpdate', () => {
  beforeEach(() => {
    lineNumbers = [];

    mockEditor = {
      editor: {
        style: {},
        value: '',
      },
      lineError: {},
      lineNumbers: {
        get offsetWidth() {
          return Math.max(1, lineNumbers.length) * 12; // totally made up
        },
        querySelectorAll() {
          return lineNumbers;
        },
      },
    };
  });

  it('should be a function', () => {
    expect(typeof lineNumbersUpdate).toBe('function');
  });

  it('should insert one lineNumber with no content', () => {
    setContent(mockEditor, '');

    lineNumbersUpdate(mockEditor, mockInsert);

    expect(mockEditor.editor.value).toBe('');
    expect(mockEditor.lineNumbers.querySelectorAll()).toMatchSnapshot('numbers');
    expect(mockEditor.editor.style).toMatchSnapshot('style');
  });

  it('should insert multiple lineNumbers with content', () => {
    const content = 'just\nsome\ncontent\nwith\nnewlines';

    setContent(mockEditor, content);

    lineNumbersUpdate(mockEditor, mockInsert);

    expect(mockEditor.editor.value).toBe(content);
    expect(mockEditor.lineNumbers.querySelectorAll()).toMatchSnapshot('numbers');
    expect(mockEditor.editor.style).toMatchSnapshot('style');
  });

  it('should show line errors', () => {
    const content = 'just\nsome\ncontent\nwith\nnewlines';

    setContent(mockEditor, content);
    mockEditor.lineError = {
      1: 'invalid for some reason',
      2: 'invalid because no numbers',
      3: 'invalid title',
      4: 'invalid line',
      5: 'invalid just because',
    };

    lineNumbersUpdate(mockEditor, mockInsert);

    expect(mockEditor.editor.value).toBe(content);
    expect(mockEditor.lineNumbers.querySelectorAll()).toMatchSnapshot('numbers');
    expect(mockEditor.editor.style).toMatchSnapshot('style');
  });

  it('should keep line errors after edit', () => {
    const content = 'just\nsome\ncontent\nwith\nnewlines';
    const appended = '\nsome\nnew\ncontent';

    setContent(mockEditor, content);
    mockEditor.lineError = {
      1: 'invalid for some reason',
      3: 'invalid title',
    };

    lineNumbersUpdate(mockEditor, mockInsert);

    mockEditor.editor.value += appended;

    expect(mockEditor.editor.value).toBe(content + appended);
    expect(mockEditor.lineNumbers.querySelectorAll()).toMatchSnapshot('numbers');
    expect(mockEditor.editor.style).toMatchSnapshot('style');
  });
});
