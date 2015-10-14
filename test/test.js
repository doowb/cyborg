
import assert from 'assert';
import Cyborg from '../index';

describe('cyborg', () => {
  it('should create an instance', () => {
    const cyborg = new Cyborg()
    assert(cyborg instanceof Cyborg);
  });

  it('should create an instance without using `new`', () => {
    const cyborg = Cyborg()
    assert(cyborg instanceof Cyborg);
  });
});
