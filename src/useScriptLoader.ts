import { useCallback, useRef, useState } from 'react';
import scriptHandler from './scriptHandler';
import { UseScriptLoader, ScriptLoader } from './type';

export const useScriptLoader = (props: UseScriptLoader): ScriptLoader => {
  const isProcessing = useRef<boolean>(false);

  const [isMapReady, setIsMapReady] = useState(false);
  const [isReloadOk, setIsReloadOk] = useState(false);

  const observeScript = useCallback(() => {
    const observer = new MutationObserver(
      (mutationsList: MutationRecord[], observer: MutationObserver): void => {
        for (const mutation of mutationsList) {
          const scripts = scriptHandler.getAllGmapsScript();
          if (mutation.type === 'childList' && scripts?.length > 1) {
            setIsReloadOk(true);
            isProcessing.current = false;
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
    (language: string, region: string): boolean => {
      if (isProcessing.current) return false;

      setIsMapReady(false);
      setIsReloadOk(false);

      isProcessing.current = true;

      scriptHandler.removeAllGmapsAPIScript();

      scriptHandler.createGmapsScriptElement({
        ...props,
        region,
        language,
        onLoad: () => setIsMapReady(true),
      });

      observeScript();

      return true;
    },
    [props, observeScript]
  );

  return {
    loadScript,
    isMapReady,
    isReloadOk,
  };
};
