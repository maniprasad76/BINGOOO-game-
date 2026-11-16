import {
  CryptoRandomGenerator,
  MockRandomGenerator,
  generateSecureRewardCode
} from '../src/common/crypto-random';

describe('Prize Engine & Randomness Verification', () => {
  it('should generate secure reward codes in format BGO-XXXX-XXXX', () => {
    const code = generateSecureRewardCode();
    expect(code).toMatch(/^BGO-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
  });

  it('MockRandomGenerator should return deterministic sequence', () => {
    const mockGen = new MockRandomGenerator([150, 450, 9500]);
    expect(mockGen.next(10000)).toBe(150);
    expect(mockGen.next(10000)).toBe(450);
    expect(mockGen.next(10000)).toBe(9500);
  });

  it('CryptoRandomGenerator should generate unbiased distribution over large sample', () => {
    const gen = new CryptoRandomGenerator();
    const buckets = [0, 0, 0, 0]; // 4 prizes
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
      const pick = gen.next(10000); // 0 to 9999
      if (pick < 1000) buckets[0]++; // 10%
      else if (pick < 4000) buckets[1]++; // 30%
      else if (pick < 5000) buckets[2]++; // 10%
      else buckets[3]++; // 50%
    }

    // Expect statistical tolerance +/- 3% around theoretical percentages
    // 10% -> 1000 +/- 300 (700 to 1300)
    expect(buckets[0]).toBeGreaterThan(700);
    expect(buckets[0]).toBeLessThan(1300);

    // 30% -> 3000 +/- 300 (2700 to 3300)
    expect(buckets[1]).toBeGreaterThan(2600);
    expect(buckets[1]).toBeLessThan(3400);

    // 10% -> 1000 +/- 300 (700 to 1300)
    expect(buckets[2]).toBeGreaterThan(700);
    expect(buckets[2]).toBeLessThan(1300);

    // 50% -> 5000 +/- 300 (4600 to 5400)
    expect(buckets[3]).toBeGreaterThan(4500);
    expect(buckets[3]).toBeLessThan(5500);
  });
});
