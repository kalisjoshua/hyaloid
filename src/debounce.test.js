import debounce from './debounce';

describe('lib debounce', () => {
  it('should be a function', () => {
    expect(typeof debounce).toBe('function');
  });

  it('should schedule a function to execute without executing it', () => {
    jest.useFakeTimers();

    const cb = jest.fn();
    const fn = debounce(cb);

    expect(cb.mock.calls.length).toBe(0);

    fn();
    jest.runAllTimers();

    expect(cb.mock.calls.length).toBe(1);
  });

  it('should execute the scheduled function only once', () => {
    jest.useFakeTimers();

    const cb = jest.fn();
    const fn = debounce(cb);

    expect(cb.mock.calls.length).toBe(0);

    fn();
    fn();
    fn();
    jest.runAllTimers();

    expect(cb.mock.calls.length).toBe(1);
  });
});
