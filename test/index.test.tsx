import { act, renderHook } from '@testing-library/react';
import { useScriptLoader, ScriptLoader } from '../src/index';

describe('hook initialize', () => {
  let loader: ScriptLoader;

  beforeAll(() => {
    const { result } = renderHook(() =>
      useScriptLoader({
        apiKey: '1234567',
        libraries: ['places'],
      })
    );
    loader = result.current;
  });

  it('load script without crash', () => {
    act(() => {
      loader.loadScript?.('id', 'ID');
    });
  });

  it('load script with default states', () => {
    act(() => {
      loader.loadScript?.('id', 'ID');
    });

    expect(loader.isMapReady).toBe(false);
    expect(loader.isReloadOk).toBe(false);
  });

  it('load correct google maps script', () => {
    act(() => {
      loader.loadScript?.('id', 'ID');
    });

    const script = document.getElementsByTagName('script');

    expect(script[0].src).toBe(
      'https://maps.googleapis.com/maps/api/js?key=1234567&w=weekly&region=ID&language=id&libraries=places'
    );
  });
});

describe('hook script onload action', () => {
  it('update isMapReady state', () => {
    let loader: ScriptLoader;

    const { result } = renderHook(() =>
      useScriptLoader({
        apiKey: '1234567',
        libraries: ['places'],
      })
    );

    loader = result.current;

    act(() => {
      loader.loadScript?.('id', 'ID');
    });

    expect(loader.isMapReady).toBe(false);

    const script = document.getElementsByTagName('script');

    const onLoad = script[0].onload as () => void;

    act(() => {
      if (onLoad !== null) {
        onLoad();
      }
    });

    expect(result.current.isMapReady).toBe(true);
  });
});

describe('hook reload validation action', () => {
  it('update isReloadOk state', async () => {
    let loader: ScriptLoader;

    const { result } = renderHook(() =>
      useScriptLoader({
        apiKey: '1234567',
        libraries: ['places'],
      })
    );

    loader = result.current;

    act(() => {
      loader.loadScript?.('id', 'ID');
    });

    expect(loader.isReloadOk).toBe(false);

    await act(async () => {
      loader.checkAllGmapAPIScripts(0, 1, 3);
      await new Promise(r => setTimeout(r, 70));
    });

    expect(result.current.isReloadOk).toBe(true);

    await act(async () => {
      loader.checkAllGmapAPIScripts(7, 1, 1);
      await new Promise(r => setTimeout(r, 70));
    });

    expect(loader.isReloadOk).toBe(false);
  });
});
