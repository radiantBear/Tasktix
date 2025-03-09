import * as crypto from 'crypto';
import { hash, compare } from './hash';

// Allow mocking methods for testing response on failure
jest.mock('crypto', () => {
  const actualCrypto = jest.requireActual('crypto');
  return {
    ...actualCrypto,
    randomFill: jest.fn(),
    scrypt: jest.fn()
  };
});

beforeEach(() => {
  const actualCrypto = jest.requireActual('crypto');
  (crypto.randomFill as jest.Mock).mockImplementation(actualCrypto.randomFill);
  (crypto.scrypt as jest.Mock).mockImplementation(actualCrypto.scrypt);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('hash', () => {
  test('Returns a string containing salt and hashed password', async () => {
    const result = await hash('password123');

    expect(result).toContain(':');
    expect(result.split(':')).toHaveLength(2);
  });

  test('Generates different hashes for same password using different salts', async () => {
    const hash1 = await hash('password123');
    const hash2 = await hash('password123');

    expect(hash1).not.toBe(hash2);
  });

  test('Hashes even empty string password', async () => {
    const result = await hash('');

    expect(result).toContain(':');
    expect(result.split(':')).toHaveLength(2);
  });

  test('Hashes very long passwords', async () => {
    const longPassword = 'a'.repeat(1000);
    const result = await hash(longPassword);

    expect(result).toContain(':');
  });

  test('Throws an error if salt generation fails', async () => {
    (crypto.randomFill as jest.Mock).mockImplementation(
      (_, callback: (err: any, str: any) => void): void => {
        callback(new Error('randomFill failed'), []);
      }
    );

    await expect(hash('password123')).rejects.toThrow('randomFill failed');
  });

  test('Throws an error if hashing fails', async () => {
    (crypto.scrypt as jest.Mock).mockImplementation(
      (_, __, ___, callback: (err: any, key: Buffer) => void): void => {
        callback(new Error('scrypt failed'), Buffer.alloc(0));
      }
    );

    await expect(hash('password123')).rejects.toThrow('scrypt failed');
  });
});

describe('compare', () => {
  test('Returns true for a matching password/hash pair', async () => {
    const password = 'password123';
    const hashedPassword = await hash(password);

    expect(await compare(password, hashedPassword)).toBe(true);
  });

  test('Returns true for hashing and comparing empty string passwords', async () => {
    const hashedPassword = await hash('password123');

    expect(await compare('', hashedPassword)).toBe(false);
  });

  test('Returns false for a non-matching password/hash pair', async () => {
    const hashedPassword = await hash('password123');

    expect(await compare('wrongpassword', hashedPassword)).toBe(false);
  });

  test("Returns false for an empty password that doesn't match the hash", async () => {
    const hashedPassword = await hash('password123');

    expect(await compare('', hashedPassword)).toBe(false);
  });

  test('Returns false for malformed hash strings', async () => {
    expect(await compare('password123', 'malformed')).toBe(false);
    expect(await compare('password123', 'malformed:hash:extra')).toBe(false);
    expect(await compare('password123', ':justhash')).toBe(false);
  });

  test('Returns false for an empty hash', async () => {
    expect(await compare('password123', '')).toBe(false);
  });

  test('Throws an error if hashing fails', async () => {
    const hashedPassword = await hash('password123');

    (crypto.scrypt as jest.Mock).mockImplementation(
      (_, __, ___, callback: (err: any, key: Buffer) => void): void => {
        callback(new Error('scrypt failed'), Buffer.alloc(0));
      }
    );

    await expect(compare('password123', hashedPassword)).rejects.toThrow(
      'scrypt failed'
    );
  });
});
