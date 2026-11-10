import { describe, expect, it } from 'vitest';
import { topicForTitle } from './topics';

describe('topicForTitle', () => {
  it('matches whole words only', () => {
    expect(topicForTitle('She said the rain would embrace a billion fans').id).toBe(
      'general'
    );
  });

  it('sorts common headlines', () => {
    expect(topicForTitle('Senate passes a new tax bill').id).toBe('politics');
    expect(topicForTitle('World Cup draw announced').id).toBe('sports');
    expect(topicForTitle('New AI model released').id).toBe('science');
    expect(topicForTitle('UK inflation falls').id).toBe('world');
  });
});
