import { test } from '../src/utils';

describe('test', () => {
  it('should test', () => {
    const result = test(2);
    expect(result).toBe(4);
  });
});