import './leaflet-areacodecluster.js';
import jp from './leaflet-areacodecluster-jp.js';
import world from './leaflet-areacodecluster-world.js';

L.areaCodeCluster = function(resolver, markers, options) {
  return new L.AreaCodeCluster(resolver, markers, options);
};

L.areaCodeCluster.world = function(markers, options) {
  return new L.AreaCodeCluster(world, markers, options);
};

L.areaCodeCluster.jp = function(markers, options) {
  return new L.AreaCodeCluster(jp, markers, options);
};
