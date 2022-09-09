# React Google Maps Script Loader

![Build](https://github.com/yohaneslumentut/gmaps-script-loader/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/gmaps-script-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/gmaps-script-loader)
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

## Usage

The `useScriptLoader` hook can be used as follow:

```ts
const { loadScript, isMapReady, isReloadOk } = useScriptLoader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
  libraries: ['places'],
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
  const ref = useRef<HTMLDivElement | null>(null);

  const { loadScript, isMapReady, isReloadOk } = useScriptLoader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const [language, setLanguage] = useState<string>('bahasa');

  useEffect(() => {
    loadScript('id', 'ID');
  }, [loadScript]);

  useEffect(() => {
    if (ref.current && isMapReady) {
      console.log('map init');
      new google.maps.Map(ref.current, {
        zoom: 12,
        center: { lat: -6.21462, lng: 106.84513 },
      });
    }
  }, [isMapReady]);

  return (
    <>
      {isReloadOk && (
        <Language
          loadScript={loadScript}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      <div ref={ref} style={{ width: '100%', height: '100vh' }} />
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
  loadScript,
  language,
  setLanguage,
}: {
  loadScript: (language: string, region: string) => void;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
}) {
  useEffect(() => {
    if (language) {
      const selected = languages[language];
      loadScript(selected.language, selected.region);
    }
  }, [language, loadScript]);

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

## Demo

You can check the demo at [codesandbox.id](https://codesandbox.io/s/quirky-yalow-847k8r) and if the **API_KEY** has expired, you can fork the sandbox and replace **REACT_APP_GOOGLE_MAPS_API_KEY** at `.env` file with yours.

## Contribute

We are welcome to any contribution, which has a clear goal and description. You can contribute by creating a feature/fix branch on your own fork and making pull requests towards develop branch of the original repo.
