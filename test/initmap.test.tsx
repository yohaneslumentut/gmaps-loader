import { act, renderHook } from '@testing-library/react';
import { useScriptLoader, ScriptLoader } from '../src';

describe('hook initMap checking', () => {
  it('contain initMap at window and at script url', () => {
    let loader: ScriptLoader;
    const initMap = jest.fn();

    const { result } = renderHook(() =>
      useScriptLoader({
        apiKey: '1234567',
        libraries: ['places'],
        initMap,
      })
    );

    loader = result.current;

    act(() => {
      loader.loadScript?.('id', 'ID');
    });

    expect(window.initMap).toBeDefined();

    const script = document.getElementsByTagName('script');

    expect(script[0].src).toContain('&loading=async&callback=initMap');

    window.initMap();

    expect(initMap).toHaveBeenCalledTimes(1);
  });
});
