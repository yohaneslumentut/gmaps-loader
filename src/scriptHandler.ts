import { GMAPS_API_SRC_URL, GMAPS_SCRIPT_SELECTOR } from './constants';

export type Libraries = Array<
  'drawing' | 'geometry' | 'places' | 'visualization'
>;

export interface ScriptSrcParams {
  apiKey: string;
  region: string;
  language: string;
  libraries: Libraries;
}

interface Google {
  maps?: typeof google.maps;
}

function getAllGmapsScript() {
  return document?.querySelectorAll(GMAPS_SCRIPT_SELECTOR);
}

function removeExistingGmapsAPIScript(callback: () => void) {
  const scripts = getAllGmapsScript();
  if (scripts.length > 0) {
    scripts.forEach(script => script.remove());
    callback();
  }
}

function deleteGmapsInstance(google: Google) {
  if (google) {
    delete google.maps;
  }
}

function createGmapsScriptElement({
  apiKey,
  region,
  language,
  libraries,
}: ScriptSrcParams) {
  deleteGmapsInstance((window.google as unknown) as Google);

  const script = document.createElement('script');

  script.async = true;

  const urlSearchParams = new URLSearchParams({
    key: apiKey,
    w: 'weekly',
    region,
    language,
    libraries: libraries.sort().join(','),
    loading: 'async',
    callback: 'initMap',
  });

  Object.assign(script, {
    id: 'googlemaps',
    type: 'text/javascript',
    defer: true,
    async: true,
    src: `${GMAPS_API_SRC_URL}?${urlSearchParams.toString()}`,
  });

  document.head.appendChild(script);
}

export default {
  getAllGmapsScript,
  removeExistingGmapsAPIScript,
  deleteGmapsInstance,
  createGmapsScriptElement,
};
