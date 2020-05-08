import hyaloidEditor from '.';

jest.useFakeTimers();

let testElement;

Object.defineProperty(document, 'querySelector', {
  value: () => testElement,
});

const content = `
However skilled and strong art thou, my foe,
However fierce is thy relentless hate,
Though firm thy hand, and strong thy aim, and straight
Thy poisoned arrow leaves the bended bow,
To pierce the target of my heart.
`.trim();

describe('hyaloidEditor', () => {
  beforeEach(() => {
    testElement = document.createElement('div');
  });

  it('should initialize the DOM elements', () => {
    hyaloidEditor('.hyaloid');

    expect(testElement.outerHTML).toMatchSnapshot('html');
  });

  it('should intialize with HTML content', () => {
    testElement.innerHTML = 'Hello world.';
    const editorWithContent = hyaloidEditor('.hyaloid');

    expect(editorWithContent.content).toBe('Hello world.');
  });

  describe('editor API', () => {
    it('should return an editor object', () => {
      const editorAPI = hyaloidEditor('.hyaloid');

      expect(Object.keys(editorAPI)).toMatchSnapshot();
    });

    it('should enable get/set content', () => {
      const editorAPI = hyaloidEditor('.hyaloid');
      let newContent;

      expect(editorAPI.content).toBe('');
      expect(testElement.outerHTML).toMatchSnapshot('no content');

      newContent = 'hello\nworld\nfoo';
      editorAPI.setContent(newContent);
      jest.runOnlyPendingTimers();
      expect(editorAPI.content).toBe(newContent);
      expect(testElement.outerHTML).toMatchSnapshot('three lines');

      newContent = `${editorAPI.content}\nadditional line`;
      editorAPI.setContent(newContent);
      jest.runOnlyPendingTimers();
      expect(editorAPI.content).toBe(newContent);
      expect(testElement.outerHTML).toMatchSnapshot('more lines');
    });

    it('should expose line count', () => {
      const editorAPI = hyaloidEditor('.hyaloid');

      editorAPI.setContent(content);
      expect(editorAPI.lineCount).toBe(content.split(/\n/).length);
    });

    it('should enable get/set errors', () => {
      const editorAPI = hyaloidEditor('.hyaloid');

      editorAPI.setContent(content);

      editorAPI.setError(1, 'Invalid line');
      editorAPI.setError(2, 'Invalid line');
      editorAPI.setError(3, 'Invalid line');
      editorAPI.setError(4, 'Invalid line');
      editorAPI.setError(5, 'Invalid line');

      expect(editorAPI.hasErrors).toBe(true);
      expect(editorAPI.errors).toMatchSnapshot('errors');
    });

    it('should enable errors reset', () => {
      const editorAPI = hyaloidEditor('.hyaloid');

      editorAPI.setError(1, 'Invalid line');
      editorAPI.setError(2, 'Invalid line');
      editorAPI.setError(3, 'Invalid line');
      editorAPI.setError(4, 'Invalid line');
      editorAPI.setError(5, 'Invalid line');

      editorAPI.setError(3); // <- reset one line
      editorAPI.setError(4); // <- reset one line

      expect(editorAPI.hasErrors).toBe(true);
      expect(editorAPI.errors).toMatchSnapshot('errors');

      editorAPI.setError(); // <- reset all

      expect(editorAPI.hasErrors).toBe(false);
      expect(editorAPI.errors).toEqual({});

      editorAPI.setError(1, 'Invalid line');
      editorAPI.setError(2, 'Invalid line');
      editorAPI.setError(3, 'Invalid line');

      expect(editorAPI.hasErrors).toBe(true);

      editorAPI.reset();

      expect(editorAPI.hasErrors).toBe(false);
    });

    it('should guard against invalid arguments passed to `.on()`', () => {
      const editorAPI = hyaloidEditor('.hyaloid');

      expect(() => {
        editorAPI.on();
      }).toThrow('Event names must be Strings: "undefined" provided.');

      expect(() => {
        editorAPI.on(() => {});
      }).toThrow('Event names must be Strings: "function" provided.');

      expect(() => {
        editorAPI.on(/edit/, () => {});
      }).toThrow('Event names must be Strings: "object" provided.');

      const invalid = 'invalid event name';

      expect(() => {
        editorAPI.on(invalid);
      }).toThrow(`Event names must be one of [edit]: "${invalid}" provided.`);

      expect(() => {
        editorAPI.on('edit', 'not a function');
      }).toThrow('Event handlers must be Functions: "string" provided.');
    });

    it('should guard against attempting to `.trigger()` invalid events', () => {
      const editorAPI = hyaloidEditor('.hyaloid');

      const invalid = 'non-event';

      expect(() => {
        editorAPI.trigger(invalid);
      }).toThrow(`Attempting to trigger an invalid event "${invalid}"`);
    });

    it('should schedule and trigger events', (done) => {
      const editorAPI = hyaloidEditor('.hyaloid');

      editorAPI.on('edit', () => {
        expect(true).toBe(true);
        done();
      });

      editorAPI.trigger('edit');
    });
  });
});
