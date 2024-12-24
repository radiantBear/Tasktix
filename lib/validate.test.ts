import { validateColor, validateEmail, validateListItemName, validateListName, validateListSectionName, validatePassword, validateUsername } from "./validate";
import { namedColors, semanticColors } from "./model/color";

describe('validateUsername', () => {
  test('Usernames with letters are valid', () => {
    const data = "abcABC";

    const result = validateUsername(data);
    
    expect(result).toBe(true);
  });

  test('Usernames with numbers are valid', () => {
    const data = "123987";

    const result = validateUsername(data);
    
    expect(result).toBe(true);
  });

  test('Usernames with underscores are valid', () => {
    const data = "___";

    const result = validateUsername(data);
    
    expect(result).toBe(true);
  });

  test('Usernames with letters, numbers, and underscores are valid', () => {
    const data = "abc_123";

    const result = validateUsername(data);
    
    expect(result).toBe(true);
  });

  test('Usernames with no more than 32 characters are valid', () => {
    const data = "abcdefghijklmnopqrstuvwxyz789012";

    const result = validateUsername(data);
    
    expect(result).toBe(true);
  });

  test('Empty usernames are invalid', () => {
    const data = "";

    const result = validateUsername(data);
    
    expect(result).toBe(false);
  });

  test('Usernames with special characters are invalid', () => {
    const data = "d@b0y!";

    const result = validateUsername(data);
    
    expect(result).toBe(false);
  });

  test('Usernames with more than 32 characters are invalid', () => {
    const data = "abcdefghijklmnopqrstuvwxyz7890123";

    const result = validateUsername(data);
    
    expect(result).toBe(false);
  });
});

describe('validateEmail', () => {
  test('Valid emails are accepted', () => {
    const data = "test+gmail-alias@subdomain.example.com";

    const result = validateEmail(data);
    
    expect(result).toBe(true);
  });

  // No further tests because validateEmail is currently implemented with a regex that 
  // matches the email address RFC
});

describe('validatePassword', () => {
  test('Accepts passwords with at least 10 characters made of letters, numbers, or special characters', () => {
    const numbers_data = "1234567890";
    const letters_data = "abcdefghij";
    const special_chars_data = "!@#$%^&*()";

    const numbers_result = validatePassword(numbers_data);
    const letters_result = validatePassword(letters_data);
    const special_chars_result = validatePassword(special_chars_data);

    expect(numbers_result.valid).toBe(true);
    expect(letters_result.valid).toBe(true);
    expect(special_chars_result.valid).toBe(true);
  });

  test('Marks passwords with less than 16 characters as "acceptable"', () => {
    const short_data = "1234567890";
    const long_data = "123456789012345";

    const short_result = validatePassword(short_data);
    const long_result = validatePassword(long_data);

    expect(short_result.strength).toBe('acceptable');
    expect(long_result.strength).toBe('acceptable');
    expect(short_result.color).toBe('warning');
    expect(short_result.color).toBe('warning');
  });

  test('Marks passwords with at least 16 characters as "strong"', () => {
    const data = "1234567890123456";

    const result = validatePassword(data);

    expect(result.strength).toBe('strong');
    expect(result.color).toBe('success');
  });

  test('Rejects passwords with less than 10 characters', () => {
    const data = "1z2a9b@!,";

    const result = validatePassword(data);

    expect(result.valid).toBe(false);
    expect(result.strength).toBe('weak');
    expect(result.color).toBe('danger');
  });

  test('Rejects passwords with more than 128 characters', () => {
    const data = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901"
      + "2345678901234567890123456789";
    
    const result = validatePassword(data);

    expect(result.valid).toBe(false);
    expect(result.color).toBe('danger');
  });
});

describe('validateListName', () => {
  test('Accepts list names with no more than 64 characters', () => {
    const data = "1234567890123456789012345678901234567890123456789012345678901234";

    const [isValid, fixed_result] = validateListName(data);

    expect(isValid).toBe(true);
    expect(fixed_result).toEqual(data);
  });

  test('Rejects list names with more than 64 characters and returns a valid result', () => {
    const data = "12345678901234567890123456789012345678901234567890123456789012345";

    const [isValid, fixed_result] = validateListName(data);

    expect(isValid).toBe(false);
    expect(fixed_result).toEqual("1234567890123456789012345678901234567890123456789012345678901234");
  });
});

describe('validateListSectionName', () => {
  test('Accepts names with no more than 64 characters', () => {
    const data = "1234567890123456789012345678901234567890123456789012345678901234";

    const [isValid, fixed_result] = validateListSectionName(data);

    expect(isValid).toBe(true);
    expect(fixed_result).toEqual(data);
  });

  test('Rejects names with more than 64 characters and returns a valid result', () => {
    const data = "12345678901234567890123456789012345678901234567890123456789012345";

    const [isValid, fixed_result] = validateListSectionName(data);

    expect(isValid).toBe(false);
    expect(fixed_result).toEqual("1234567890123456789012345678901234567890123456789012345678901234");
  });
});

describe('validateListItemName', () => {
  test('Accepts names with no more than 128 characters', () => {
    const data = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890" +
      "1234567890123456789012345678";

    const [isValid, fixed_result] = validateListItemName(data);

    expect(isValid).toBe(true);
    expect(fixed_result).toEqual(data);
  });

  test('Rejects names with more than 128 characters and returns a valid result', () => {
    const data = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890" +
      "12345678901234567890123456789";
    
    const [isValid, fixed_result] = validateListItemName(data);

    expect(isValid).toBe(false);
    expect(fixed_result).toEqual("1234567890123456789012345678901234567890123456789012345678901234567890" +
      "1234567890123456789012345678901234567890123456789012345678");
  });
});

describe('validateColor', () => {
  test('Accepts named colors', () => {
    for (const color of namedColors) {
      const result = validateColor(color);
      expect(result).toBe(true);
    }
  });

  test('Rejects semantic colors', () => {
    for (const color of semanticColors) {
      const result = validateColor(color);
      expect(result).toBe(false);
    }
  });

  test('Rejects unknown colors', () => {
    const data = 'Mint Green';

    const result = validateColor(data);

    expect(result).toBe(false);
  });
});