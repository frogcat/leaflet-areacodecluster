import buble from '@rollup/plugin-buble';
import json from '@rollup/plugin-json';
import {
  terser
} from 'rollup-plugin-terser';

export default [{
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
}, {
  input: 'src/leaflet-areacodecluster-japan.js',
  output: [{
    file: 'dist/leaflet-areacodecluster-japan.js',
    format: 'iife'
  }, {
    file: 'dist/leaflet-areacodecluster-japan.min.js',
    format: 'iife',
    plugins: [terser()]
  }],
  plugins: [
    json(),
    buble()
  ]
}];
