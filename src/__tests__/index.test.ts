import http from 'http';

describe('index test', () => {
  it('should exist', () => {
    expect(typeof http).toBe('object');
  });
  it('http snapshot', () => {
    expect(http).toMatchSnapshot();
  });
});
