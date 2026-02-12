type Rng = () => number;

const hashSeed = (seed: string) => {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number): Rng => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

export const createSeededRng = (seed: string): Rng => {
  return mulberry32(hashSeed(seed));
};

export const randomInt = (min: number, max: number, rng: Rng = Math.random) => {
  return Math.floor(rng() * (max - min + 1)) + min;
};

export const shuffle = <T>(input: T[], rng: Rng = Math.random) => {
  const array = [...input];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const pick = <T>(items: T[], rng: Rng = Math.random) => {
  return items[Math.floor(rng() * items.length)];
};

export const randomString = (length: number, rng: Rng = Math.random) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += alphabet[Math.floor(rng() * alphabet.length)];
  }
  return result;
};

export const randomHex = (bytes: number, rng: Rng = Math.random) => {
  let value = '';
  for (let i = 0; i < bytes; i += 1) {
    const byte = Math.floor(rng() * 256);
    value += byte.toString(16).padStart(2, '0');
  }
  return value;
};
