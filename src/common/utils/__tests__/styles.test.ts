import { describe, expect, it } from 'vitest';

import { customSelectStyles } from '../ui/styles';

const controlState = {
  isFocused: false,
  isDisabled: false,
} as never;

describe('customSelectStyles', () => {
  it('returns an object with control and menu keys', () => {
    const styles = customSelectStyles(false);
    expect(styles).toHaveProperty('control');
    expect(styles).toHaveProperty('menu');
    expect(typeof styles.control).toBe('function');
    expect(typeof styles.menu).toBe('function');
  });

  describe('control()', () => {
    const baseProvided = { display: 'flex' } as never;

    it('includes provided styles', () => {
      const styles = customSelectStyles(false);
      const result = styles.control!(baseProvided, controlState);
      expect(result.display).toBe('flex');
    });

    it('sets 8px border radius to match form controls', () => {
      const styles = customSelectStyles(false);
      const result = styles.control!(baseProvided, controlState);
      expect(result.borderRadius).toBe('8px');
    });

    it('sets normal border when not error and not focused', () => {
      const styles = customSelectStyles(false);
      const result = styles.control!(baseProvided, controlState);
      expect(result.borderColor).toBe('#cfcfcf');
      expect(result.boxShadow).toBe('none');
    });

    it('sets focus border when not error and focused', () => {
      const styles = customSelectStyles(false);
      const result = styles.control!(baseProvided, {
        isFocused: true,
        isDisabled: false,
      } as never);
      expect(result.borderColor).toBe('#cfcfcf');
      expect(result.boxShadow).toContain('rgba(64, 81, 137');
    });

    it('sets error border when isError and not focused', () => {
      const styles = customSelectStyles(true);
      const result = styles.control!(baseProvided, controlState);
      expect(result.borderColor).toBe('#f06548');
      expect(result.boxShadow).toBe('none');
    });

    it('sets error focus border when isError and focused', () => {
      const styles = customSelectStyles(true);
      const result = styles.control!(baseProvided, {
        isFocused: true,
        isDisabled: false,
      } as never);
      expect(result.borderColor).toBe('#f06548');
      expect(result.boxShadow).toContain('rgba(240, 101, 72');
    });
  });

  describe('menu()', () => {
    it('sets zIndex and 8px border radius', () => {
      const styles = customSelectStyles(false);
      const result = styles.menu!(
        { position: 'absolute' } as never,
        {} as never,
      );
      expect(result.zIndex).toBe(9999);
      expect(result.borderRadius).toBe('8px');
      expect(result.position).toBe('absolute');
    });
  });
});
