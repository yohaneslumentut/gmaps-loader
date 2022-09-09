import { useCallback, useRef, useState } from 'react';

export type Libraries = Array<
  'drawing' | 'geometry' | 'localContext' | 'places' | 'visualization'
>;

export const queryParams = (
  key: string,
  region: string, // https://developers.google.com/maps/coverage
  language: string, // https://developers.google.com/maps/faq#languagesupport
  libraries: Libraries
): string => {
  const queryObject = {
    key,
    w: 'weekly',
    region,
    language,
    libraries: libraries.sort().join(','),
  };
  return new URLSearchParams(queryObject).toString();
};

export const removeAllGmapAPIScript = (): void => {
  document
    .querySelectorAll('script[src^="https://maps.googleapis.com"]')
    .forEach(script => script.remove());
};

export const getAllGmapAPIScriptLength = (): number =>
  document.querySelectorAll('script[src^="https://maps.googleapis.com"]')
    .length;

export interface ScriptLoader {
  loadScript: (language: string, region: string) => void;
  isMapReady: boolean;
  isReloadOk: boolean;
  // exposed for testing purposes
  checkAllGmapAPIScripts: (
    retry?: number,
    interval?: number,
    length?: number
  ) => void;
}

export interface UseScriptLoader {
  apiKey: string;
  libraries: Libraries;
}

interface Google {
  maps?: typeof google.maps;
}

export const useScriptLoader = ({
  apiKey,
  libraries,
}: UseScriptLoader): ScriptLoader => {
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [isReloadOk, setIsReloadOk] = useState<boolean>(false);
  const isProcessing = useRef<boolean>(false);

  const google = window.google;

  const checkAllGmapAPIScripts = useCallback(
    (retry = 0, interval = 1000, length = 0): void => {
      let retries = retry;
      let scriptsLength = length;
      const retryInterval = setInterval(() => {
        if (scriptsLength > 1 || retries === 7) {
          clearInterval(retryInterval);
          setIsReloadOk(scriptsLength > 1);
          setTimeout(() => (isProcessing.current = false), 60);
        }
        scriptsLength = getAllGmapAPIScriptLength();
        retries += 1;
      }, interval);
    },
    []
  );

  const deleteGmapsInstance = useCallback((google: Google): void => {
    delete google.maps;
  }, []);

  const loadScript = useCallback(
    (language: string, region: string): boolean => {
      if (isProcessing.current) return false;

      removeAllGmapAPIScript();

      setIsMapReady(false);
      setIsReloadOk(false);

      isProcessing.current = true;

      if (google !== undefined) {
        deleteGmapsInstance(google);
      }

      const script = document.createElement('script');

      Object.assign(script, {
        id: 'googlemaps',
        type: 'text/javascript',
        defer: true,
        async: true,
        src: `https://maps.googleapis.com/maps/api/js?${queryParams(
          apiKey,
          region,
          language,
          libraries
        )}`,
        onload: () => setIsMapReady(true),
      });

      document.head.appendChild(script);

      checkAllGmapAPIScripts();

      return true;
    },
    [apiKey, checkAllGmapAPIScripts, google, libraries, deleteGmapsInstance]
  );

  return {
    loadScript,
    isMapReady,
    isReloadOk,
    checkAllGmapAPIScripts,
  };
};
