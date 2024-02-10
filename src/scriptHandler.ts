import { ScriptSrcParams } from './type';
import { GMAPS_API_SRC_URL, GMAPS_SCRIPT_SELECTOR } from './constants';

interface Google {
  maps?: typeof google.maps;
}

function getAllGmapsScript() {
  return document?.querySelectorAll(GMAPS_SCRIPT_SELECTOR);
}

function removeAllGmapsAPIScript() {
  document
    .querySelectorAll(GMAPS_SCRIPT_SELECTOR)
    .forEach(script => script.remove());
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
  onLoad,
}: ScriptSrcParams) {
  deleteGmapsInstance(window.google);

  const script = document.createElement('script');

  const urlSearchParams = new URLSearchParams({
    key: apiKey,
    w: 'weekly',
    region,
    language,
    libraries: libraries.sort().join(','),
  });

  Object.assign(script, {
    id: 'googlemaps',
    type: 'text/javascript',
    defer: true,
    async: true,
    src: `${GMAPS_API_SRC_URL}?${urlSearchParams.toString()}`,
    onload: onLoad,
  });

  document.head.appendChild(script);
}

export default {
  getAllGmapsScript,
  removeAllGmapsAPIScript,
  deleteGmapsInstance,
  createGmapsScriptElement,
};
