import { act, renderHook } from '@testing-library/react';
import { useScriptLoader, ScriptLoader } from '../src';

describe('hook initialize', () => {
  let loader: ScriptLoader;

  beforeAll(() => {
    const { result } = renderHook(() =>
      useScriptLoader({
        apiKey: '1234567',
        libraries: ['places'],
        initMap: async () => {},
      })
    );
    loader = result.current;
  });

  it('load script without crash', () => {
    act(() => {
      loader.loadScript?.('id', 'ID');
    });
  });

  it('load correct google maps script', () => {
    act(() => {
      loader.loadScript?.('id', 'ID');
    });

    const script = document.getElementsByTagName('script');

    expect(script[0].src).toBe(
      'https://maps.googleapis.com/maps/api/js?key=1234567&w=weekly&region=ID&language=id&libraries=places&loading=async&callback=initMap'
    );
  });
});
