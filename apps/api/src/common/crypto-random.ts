import * as crypto from 'crypto';

export interface IRandomGenerator {
  /**
   * Returns a random integer in range [0, maxExclusive)
   */
  next(maxExclusive: number): number;
}

/**
 * Production implementation using Node.js crypto.randomInt (hardware-backed, unbiased CSPRNG)
 */
export class CryptoRandomGenerator implements IRandomGenerator {
  next(maxExclusive: number): number {
    if (maxExclusive <= 0) throw new Error('maxExclusive must be > 0');
    return crypto.randomInt(0, maxExclusive);
  }
}

/**
 * Deterministic generator for unit test verification
 */
export class MockRandomGenerator implements IRandomGenerator {
  private values: number[] = [];

  constructor(values: number[] = []) {
    this.values = values;
  }

  setNextValues(values: number[]) {
    this.values = values;
  }

  next(maxExclusive: number): number {
    if (this.values.length > 0) {
      const val = this.values.shift()!;
      return val % maxExclusive;
    }
    return 0;
  }
}

/**
 * Generates secure coupon codes like BGO-A8F2-9X7K
 */
export function generateSecureRewardCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing chars: 0, 1, I, O
  let part1 = '';
  let part2 = '';

  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 4; i++) {
    part1 += chars[bytes[i] % chars.length];
    part2 += chars[bytes[i + 4] % chars.length];
  }

  return `BGO-${part1}-${part2}`;
}
