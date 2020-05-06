import range from './range';

describe('range', () => {
  it('should be a function', () => {
    expect(typeof range).toBe('function');
  });

  it('should create a range (array of numbers) 1-10 exclusive', () => {
    const result = range(1, 10);

    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should create a range (array of numbers) 1-10 inclusive', () => {
    const result = range(1, 10, true);

    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should create a range (array of numbers) 10-20 exclusive', () => {
    const result = range(11, 20);

    expect(result).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it('should create a range (array of numbers) 1-5 exclusive', () => {
    const result = range(5);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});
