import { act, renderHook } from '@testing-library/react';

import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage<string>('k', 'init'));
    expect(result.current[0]).toBe('init');
  });

  it('persists and re-reads from storage', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage<string>('k', 'init'),
    );

    act(() => {
      result.current[1]('next');
    });

    expect(result.current[0]).toBe('next');
    expect(window.localStorage.getItem('k')).toBe(JSON.stringify('next'));

    rerender();
    expect(result.current[0]).toBe('next');
  });

  it('removes storage entry when set to undefined', () => {
    const { result } = renderHook(() => useLocalStorage<string>('k', 'init'));
    act(() => result.current[1]('value'));
    expect(window.localStorage.getItem('k')).toBe(JSON.stringify('value'));

    act(() => result.current[1](undefined));
    expect(window.localStorage.getItem('k')).toBeNull();
  });
});