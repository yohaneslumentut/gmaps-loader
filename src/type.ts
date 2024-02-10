export type Libraries = Array<
  'drawing' | 'geometry' | 'localContext' | 'places' | 'visualization'
>;

export type ScriptSrcParams = {
  apiKey: string;
  region: string;
  language: string;
  libraries: Libraries;
  onLoad: () => void;
};

export interface ScriptLoader {
  loadScript: (language: string, region: string) => void;
  isMapReady: boolean;
  isReloadOk: boolean;
}

export interface UseScriptLoader {
  apiKey: string;
  libraries: Libraries;
}

export type LoaderState = {
  isMapReady: boolean;
  isReloadOk: boolean;
};
