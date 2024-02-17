import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import scriptHandler from './scriptHandler';
import { Libraries } from './scriptHandler';

declare global {
  interface Window {
    initMap: () => void;
  }
}

export interface ScriptLoader {
  loadScript: (language: string, region: string) => void;
  isLoading: MutableRefObject<boolean>;
}

export interface UseScriptLoader {
  apiKey: string;
  libraries: Libraries;
  initMap: () => Promise<void>;
}

const originalConsoleWarn = console.warn;

export const useScriptLoader = ({
  apiKey,
  initMap,
  libraries,
}: UseScriptLoader): ScriptLoader => {
  const isLoading = useRef<boolean>(false);

  useEffect(() => {
    window.initMap = initMap;
  }, [initMap]);

  const warnCount = useRef(0);

  const suppressedConsoleWarn = useCallback(() => {
    warnCount.current++;
    if (warnCount.current > 1) {
      console.warn = originalConsoleWarn;
      warnCount.current = 0;
    }
  }, []);

  const observeScript = useCallback(() => {
    const observer = new MutationObserver(
      (mutationsList: MutationRecord[], observer: MutationObserver): void => {
        for (const mutation of mutationsList) {
          const scripts = scriptHandler.getAllGmapsScript();
          if (mutation.type === 'childList' && scripts?.length > 1) {
            isLoading.current = false;
            observer.disconnect();
          }
        }
      }
    );
    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });
  }, []);

  const loadScript = useCallback(
    (language: string, region: string) => {
      if (isLoading.current) return;

      isLoading.current = true;

      scriptHandler.removeExistingGmapsAPIScript(() => {
        console.warn = suppressedConsoleWarn;
      });

      scriptHandler.createGmapsScriptElement({
        apiKey,
        region,
        language,
        libraries,
      });

      observeScript();
    },
    [apiKey, libraries, observeScript, suppressedConsoleWarn]
  );

  return {
    loadScript,
    isLoading,
  };
};
