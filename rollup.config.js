import buble from '@rollup/plugin-buble';
import {
  terser
} from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
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
};
