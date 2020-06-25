import defaultClusterMarkerFactory from './default-cluster-marker-factory.js';
import defaultAreaCodeModifier from './default-areacode-modifier.js';

export default L.AreaCodeCluster = L.Layer.extend({
  options: {
    clusterMarkerFactory: defaultClusterMarkerFactory,
    areaCodeModifier: defaultAreaCodeModifier
  },
  initialize: function(layers, options) {
    L.Util.setOptions(this, options);
    this._source = {};
    this._layers = [];
    layers.forEach(layer => {
      this.addLayer(layer);
    });
  },
  addLayer: function(layer) {
    const areaCode = layer.options.areaCode;
    if (areaCode && (layer.getLatLng || layer.getBounds)) {
      const target = this._source[areaCode] || (this._source[areaCode] = []);
      if (target.indexOf(layer) === -1) {
        target.push(layer);
        if (this._map) this._onZoomEnd();
      }
    }
    return this;
  },
  removeLayer: function(layer) {
    let count = 0;
    Object.values(this._source).forEach(target => {
      const index = target.indexOf(layer);
      if (index !== -1) {
        target.splice(index, 1);
        count++;
      }
    });
    if (this._map && count > 0) this._onZoomEnd();
    return this;
  },
  getEvents: function() {
    return {
      moveend: this._onMoveEnd,
      zoomend: this._onZoomEnd,
      viewreset: this._onZoomEnd,
      zoomlevelschange: this._onZoomEnd
    };
  },
  onAdd: function(map) {
    this._onZoomEnd();
  },
  onRemove: function(map) {
    this._layers.forEach(layer => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    this._layers = [];
  },
  _onMoveEnd: function() {
    if (!this._map) return;
    const map = this._map;
    const bounds = map.getBounds();
    this._layers.forEach(layer => {
      const flag = layer.getLatLng ? bounds.contains(layer.getLatLng()) : bounds.intersects(layer.getBounds());
      if (flag) {
        if (!map.hasLayer(layer)) map.addLayer(layer);
      } else {
        if (map.hasLayer(layer)) map.removeLayer(layer);
      }
    });
  },
  _onZoomEnd: function() {

    if (!this._map) return;

    const map = this._map;
    const zoom = this._map.getZoom();

    const prev = this._layers;
    const next = [];
    const cluster = {};

    Object.keys(this._source).forEach(areaCode => {
      const layers = this._source[areaCode];
      const modified = this.options.areaCodeModifier(zoom, areaCode);
      if (modified === null || modified === false || modified === undefined) {
        Array.prototype.push.apply(next, layers);
      } else {
        const target = cluster[modified] || (cluster[modified] = []);
        Array.prototype.push.apply(target, layers);
      }
    });

    prev.forEach(layer => {
      if (map.hasLayer(layer) && next.indexOf(layer) === -1)
        map.removeLayer(layer);
    });

    Object.keys(cluster).forEach(areaCode => {
      const layers = cluster[areaCode];
      const clusterMarker = this.options.clusterMarkerFactory(layers, areaCode);
      next.push(clusterMarker);
    });

    this._layers = next;
    this._onMoveEnd();
  }
});
