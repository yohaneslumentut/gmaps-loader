# React Google Maps Script Loader

![Build](https://github.com/yohaneslumentut/gmaps-script-loader/workflows/Test/badge.svg)
[![codecov](https://codecov.io/gh/yohaneslumentut/gmaps-script-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/yohaneslumentut/gmaps-script-loader)
[![npm](https://img.shields.io/npm/v/gmaps-script-loader)](https://www.npmjs.com/package/gmaps-script-loader)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

## Description

A simple **react** hook for loading google maps API script on browser. The `loadScript` method let you easily change the `language` and `region` on the fly.

## Install

Available via npm as the package [gmaps-script-loader](https://www.npmjs.com/package/gmaps-script-loader) and can be installed by using **npm**

```bash
npm i gmaps-script-loader
```

or using **yarn**:

```bash
yarn add gmaps-script-loader
```

## TypeScript

TypeScript users need to install the following types package.

```sh
npm i -D @types/google.maps
```

## API Reference

**useScriptLoader** is a react-hook that accepts **UseScriptLoader** property and returns a **ScriptLoader** object:

```ts
const useScriptLoader = (props: UseScriptLoader): ScriptLoader
```

```ts
type Libraries = Array<
  'drawing' | 'geometry' | 'localContext' | 'places' | 'visualization'
>;

interface UseScriptLoader {
  apiKey: string;
  libraries: Libraries;
  initMap: () => Promise<void>;
}

interface ScriptLoader {
  loadScript: (language: string, region: string) => void;
}
```

## Usage

The `useScriptLoader` hook can be used as follow:

```ts
const { loadScript } = useScriptLoader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
  libraries: ['places'],
  initMap,
});
```

## Example

This is an example of how to combine `useScriptLoader` with a language selector:

```ts
// App.tsx

import { useEffect, useRef, useState } from 'react';
import { useScriptLoader } from 'gmaps-script-loader';
import Language from './Language';
import './styles.css';

export default function App() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const initMap = useCallback(async () => {
    const { Map } = google.maps;
    const currentCenter = mapRef.current?.getCenter();

    mapRef.current = new Map(mapElementRef.current as HTMLElement, {
      center: {
        lat: currentCenter?.lat() ?? -34.397,
        lng: currentCenter?.lng() ?? 150.644,
      },
      zoom: mapRef.current?.getZoom() ?? 8,
    });
  }, []);

  const [language, setLanguage] = useState<string>('bahasa');

  const mapLoader = useScriptLoader({
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    libraries: ['places'],
    initMap,
  });

  useEffect(() => {
    mapLoader.loadScript('id', 'ID');
  }, [mapLoader]);

  return (
    <>
      <Language
        loader={mapLoader}
        language={language}
        setLanguage={setLanguage}
      />
      <div ref={mapElementRef} style={{ width: '100vw', height: '100vh' }} />
    </>
  );
}
```

and the language selector component that implementing `loadScript` method:

```ts
// Language.tsx

import { Dispatch, SetStateAction, useEffect } from 'react';

type Lang = { language: string; region: string };

interface Languages {
  [key: string]: Lang;
}

const languages: Languages = {
  bahasa: {
    language: 'id',
    region: 'ID',
  },
  english: {
    language: 'en',
    region: 'GB',
  },
  chinese: {
    language: 'zh',
    region: 'CN',
  },
};

const options = ['bahasa', 'english', 'chinese'];

export default function Language({
  loader,
  language,
  setLanguage,
}: {
  loader: ScriptLoader;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}) {
  useEffect(() => {
    if (language) {
      const selected = languages[language];
      loader.loadScript(selected.language, selected.region);
    }
  }, [loader, language]);

  return (
    <div style={{ position: 'absolute', right: 70, top: 10, zIndex: 50 }}>
      <select value={language} onChange={e => setLanguage(e.target.value)}>
        {options.map(opt => (
          <option value={opt} key={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## Contribute

We are welcome to any contribution, which has a clear goal and description. You can contribute by creating a feature/fix branch on your own fork and making pull requests towards develop branch of the original repo.
