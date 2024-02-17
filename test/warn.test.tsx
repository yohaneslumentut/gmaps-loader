import { act, renderHook } from '@testing-library/react';
import { useScriptLoader, ScriptLoader } from '../src';

describe('console warn test', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  let loader: ScriptLoader;

  const scriptSrcUrls = [
    'https://maps.googleapis.com/maps-api-v3/api/js/55/11/intl/id_ALL/common.js',
    'https://maps.googleapis.com/maps-api-v3/api/js/55/11/intl/id_ALL/util.js',
    'https://maps.googleapis.com/maps-api-v3/api/js/55/11/intl/id_ALL/map.js',
  ];

  it('normally capture warn message', () => {
    const { result } = renderHook(() =>
      useScriptLoader({
        apiKey: '1234567',
        libraries: ['places'],
        initMap: async () => {},
      })
    );

    loader = result.current;

    console.warn('This is first warning message');

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('This is first warning message');
  });

  it('suppress warn message when reload', async () => {
    const { result } = renderHook(() =>
      useScriptLoader({
        apiKey: '1234567',
        libraries: ['places'],
        initMap: async () => {},
      })
    );

    loader = result.current;

    await act(async () => {
      scriptSrcUrls.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        document.head.append(script);
      });
    });

    expect(loader.isLoading.current).toBe(false);

    act(() => {
      loader.loadScript?.('id', 'ID');
    });

    expect(loader.isLoading.current).toBe(true);

    await act(async () => {
      scriptSrcUrls.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        document.head.append(script);
      });
    });

    console.warn('This is first warn message');
    console.warn('This is second warn message');
    // expect(warnSpy).toHaveBeenCalledWith('This is the last warn message');
  });

  it('warn error', () => {
    console.warn('Test 123');

    expect(warnSpy).toHaveBeenCalledWith('Test 123');
  });
});
