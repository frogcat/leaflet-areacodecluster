import './leaflet-areacodecluster.js';

import areaCodeDefinition from '../data/japan.json';

(function(L) {
  L.areaCodeCluster.japan = function(markers, options) {
    return new L.AreaCodeCluster(areaCodeDefinition, markers, options);
  };
})(window.L);
