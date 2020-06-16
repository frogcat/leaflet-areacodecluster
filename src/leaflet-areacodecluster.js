import defaultClusterMarkerFactory from './default-cluster-marker-factory.js';
import defaultAreaCodeModifier from './default-areacode-modifier.js';

export default L.AreaCodeCluster = L.FeatureGroup.extend({
  options: {
    clusterMarkerFactory: defaultClusterMarkerFactory,
    areaCodeModifier: defaultAreaCodeModifier
  },
  initialize: function(markers, options) {
    L.Util.setOptions(this, options);
    this._sourceCluster = {};
    this._markersForCurrentZoom = [];
    if (markers)
      markers.forEach(marker => {
        this.addMarker(marker);
      });
    L.FeatureGroup.prototype.initialize.call(this, []);
  },
  addMarker: function(marker) {
    const areaCode = marker.options.areaCode;
    const target = this._sourceCluster[areaCode] || (this._sourceCluster[areaCode] = []);
    if (target.indexOf(marker) === -1) target.push(marker);
  },
  removeMarker: function(marker) {
    Object.keys(this._sourceCluster).forEach(areaCode => {
      this._sourceCluster[areaCode] = this._sourceCluster[areaCode].filter(x => x !== marker);
    });
  },
  onAdd: function(map) {
    this._onZoomEnd();
  },
  getEvents: function() {
    return {
      moveend: this._onMoveEnd,
      zoomend: this._onZoomEnd,
      viewreset: this._onZoomEnd,
      zoomlevelschange: this._onZoomEnd
    };
  },
  _onMoveEnd: function() {
    if (!this._map) return;
    const bounds = this._map.getBounds();
    this._markersForCurrentZoom.forEach(marker => {
      if (bounds.contains(marker.getLatLng())) {
        if (!this.hasLayer(marker)) this.addLayer(marker);
      } else {
        if (this.hasLayer(marker)) this.removeLayer(marker);
      }
    });
  },
  _onZoomEnd: function() {

    if (!this._map) return;

    const zoom = this._map.getZoom();

    this.clearLayers();
    this._markersForCurrentZoom = [];

    const modifiedCluster = {};
    Object.keys(this._sourceCluster).forEach(areaCode => {
      const markers = this._sourceCluster[areaCode];
      const key = this.options.areaCodeModifier(zoom, areaCode);
      if (key === null || key === false || key === undefined) {
        Array.prototype.push.apply(this._markersForCurrentZoom, markers);
      } else {
        const target = modifiedCluster[key] || (modifiedCluster[key] = []);
        Array.prototype.push.apply(target, markers);
      }
    });

    Object.keys(modifiedCluster).forEach(areaCode => {
      const markers = modifiedCluster[areaCode];
      this._markersForCurrentZoom.push(this.options.clusterMarkerFactory(markers, areaCode));
    });

    this._onMoveEnd();
  }
});
