import { act, renderHook } from '@testing-library/react';

import { useToggle } from '../useToggle';

describe('useToggle', () => {
  it('starts with the given value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('flips via onToggle', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.onToggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.onToggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('forces via onOpen / onClose', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.onOpen());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.onClose());
    expect(result.current.isOpen).toBe(false);
  });
});