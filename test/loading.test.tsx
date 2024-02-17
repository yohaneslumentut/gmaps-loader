import { act, renderHook } from '@testing-library/react';
import { useScriptLoader, ScriptLoader } from '../src';

describe('hook loading script test', () => {
  it('update loading ref current value', async () => {
    let loader: ScriptLoader;

    const { result } = renderHook(() =>
      useScriptLoader({
        apiKey: '1234567',
        libraries: ['places'],
        initMap: async () => {},
      })
    );

    loader = result.current;

    expect(loader.isLoading.current).toBe(false);

    act(() => {
      loader.loadScript?.('id', 'ID');
    });

    expect(loader.isLoading.current).toBe(true);

    const scriptSrcUrls = [
      'https://maps.googleapis.com/maps-api-v3/api/js/55/11/intl/id_ALL/common.js',
      'https://maps.googleapis.com/maps-api-v3/api/js/55/11/intl/id_ALL/util.js',
      'https://maps.googleapis.com/maps-api-v3/api/js/55/11/intl/id_ALL/map.js',
    ];

    await act(async () => {
      scriptSrcUrls.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        document.head.append(script);
      });
    });

    expect(loader.isLoading.current).toBe(false);
  });
});
