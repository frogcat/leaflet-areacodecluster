import fs from 'fs';
import buble from '@rollup/plugin-buble';
import json from '@rollup/plugin-json';
import {
  terser
} from 'rollup-plugin-terser';

const config = [{
  input: 'src/leaflet-areacodecluster.js',
  output: [{
    file: 'dist/leaflet-areacodecluster.js',
    format: 'iife'
  }, {
    file: 'dist/leaflet-areacodecluster.min.js',
    format: 'iife',
    plugins: [terser()]
  }],
  plugins: [
    buble()
  ]
}];

fs.readdirSync('config').filter(x => x.match(/\.json$/)).forEach(x => {

  const name = x.replace(".json", "");
  const src = `src/leaflet-areacodecluster-${name}.js`;

  fs.writeFileSync(src, `import './leaflet-areacodecluster.js';

import areaCodeDefinition from '../config/${x}';

(function(L) {
  L.areaCodeCluster.${name} = function(markers, options) {
    return new L.AreaCodeCluster(areaCodeDefinition, markers, options);
  };
})(window.L);
`, "utf-8");

  config.push({
    input: src,
    output: [{
      file: `dist/leaflet-areacodecluster-${name}.js`,
      format: 'iife'
    }, {
      file: `dist/leaflet-areacodecluster-${name}.min.js`,
      format: 'iife',
      plugins: [terser()]
    }],
    plugins: [
      json(),
      buble()
    ]
  });
});

export default config;
