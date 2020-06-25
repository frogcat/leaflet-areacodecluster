import defaultClusterMarkerFactory from './default-cluster-marker-factory.js';
import defaultAreaCodeModifier from './default-areacode-modifier.js';

export default L.AreaCodeCluster = L.LayerGroup.extend({
  options: {
    clusterMarkerFactory: defaultClusterMarkerFactory,
    areaCodeModifier: defaultAreaCodeModifier
  },
  initialize: function(layers, options) {
    this._markers = {};
    this._markersForCurrentZoom = [];
    L.LayerGroup.prototype.initialize.call(this, layers, options);
  },
  addLayer: function(layer) {
    const areaCode = layer.options.areaCode;
    if (areaCode) {
      const target = this._markers[areaCode] || (this._markers[areaCode] = []);
      if (target.indexOf(layer) !== -1) return this;
      target.push(layer);
      if (this._map) this._onZoomEnd();
      return this;
    }
    return L.LayerGroup.prototype.addLayer.call(this, layer);
  },
  removeLayer: function(layer) {
    Object.values(this._markers).forEach(target => {
      const index = target.indexOf(layer);
      if (index !== -1) {
        target.splice(index, 1);
        this._onZoomEnd();
      }
    });
    return L.LayerGroup.prototype.removeLayer.call(this, layer);
  },
  clearLayers: function() {
    this._markers = {};
    this._markersForCurrentZoom = [];
    return L.LayerGroup.prototype.clearLayers.call(this);
  },
  onAdd: function(map) {
    L.LayerGroup.prototype.onAdd.call(this, map);
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
        if (!this.hasLayer(marker))
          L.LayerGroup.prototype.addLayer.call(this, marker);
      } else {
        if (this.hasLayer(marker))
          L.LayerGroup.prototype.removeLayer.call(this, marker);
      }
    });
  },
  _onZoomEnd: function() {

    if (!this._map) return;

    const zoom = this._map.getZoom();

    while (this._markersForCurrentZoom.length > 0) {
      L.LayerGroup.prototype.removeLayer.call(this, this._markersForCurrentZoom.pop());
    }

    const cluster = {};
    Object.keys(this._markers).forEach(areaCode => {
      const markers = this._markers[areaCode];
      const key = this.options.areaCodeModifier(zoom, areaCode);
      if (key === null || key === false || key === undefined) {
        Array.prototype.push.apply(this._markersForCurrentZoom, markers);
      } else {
        const target = cluster[key] || (cluster[key] = []);
        Array.prototype.push.apply(target, markers);
      }
    });

    Object.keys(cluster).forEach(areaCode => {
      const markers = cluster[areaCode];
      const clusterMarker = this.options.clusterMarkerFactory(markers, areaCode);
      this._markersForCurrentZoom.push(clusterMarker)
    });

    this._onMoveEnd();
  }
});
