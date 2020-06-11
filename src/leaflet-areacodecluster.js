export default L.AreaCodeCluster = L.FeatureGroup.extend({
  options: {
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true,
    iconCreateFunction: null
  },
  initialize: function(resolver, markers, options) {
    L.Util.setOptions(this, options);

    if (!this.options.iconCreateFunction) {
      this.options.iconCreateFunction = this._defaultIconCreateFunction;
    }

    this._resolver = resolver;
    this._areacodeCluster = {};
    this._markers = [];
    if (markers)
      markers.forEach(marker => {
        this.addMarker(marker);
      });
    L.FeatureGroup.prototype.initialize.call(this, []);
  },
  addMarker: function(marker) {
    let areacode = marker.options.areacode;
    if (this._resolver.isValid(areacode)) {
      if (this._areacodeCluster[areacode] === undefined) this._areacodeCluster[areacode] = [];
      if (this._areacodeCluster[areacode].indexOf(marker) === -1) this._areacodeCluster[areacode].push(marker);
    } else {
      console.error("invalid areacode", areacode);
    }
  },
  onAdd: function(map) {
    this.refresh();
  },
  getEvents: function() {
    return {
      moveend: this.update,
      zoomend: this.refresh,
      viewreset: this.refresh,
      zoomlevelschange: this.refresh
    };
  },
  update: function() {
    if (!this._map) return;
    if (this.options.removeOutsideVisibleBounds) {
      const bounds = this._map.getBounds();
      this._markers.forEach(marker => {
        if (bounds.contains(marker.getLatLng())) {
          if (!this.hasLayer(marker)) this.addLayer(marker);
        } else {
          if (this.hasLayer(marker)) this.removeLayer(marker);
        }
      });
    } else {
      this._markers.forEach(marker => {
        if (!this.hasLayer(marker)) this.addLayer(marker);
      });
    }
  },

  refresh: function() {

    if (!this._map) return;

    const zoom = this._map.getZoom();

    this.clearLayers();
    this._markers = [];

    const cluster = {};
    Object.keys(this._areacodeCluster).forEach(areacode => {
      const markers = this._areacodeCluster[areacode];
      const resolved = this._resolver.resolve(zoom, areacode);
      if (!resolved || resolved.length === 0) {
        Array.prototype.push.apply(this._markers, markers);
      } else {
        if (cluster[resolved] === undefined) cluster[resolved] = [];
        Array.prototype.push.apply(cluster[resolved], markers);
      }
    });

    Object.values(cluster).forEach(markers => {
      const marker = this._createMarker(markers);
      this._markers.push(marker);
    });

    this.update();
  },

  _defaultIconCreateFunction: function(cluster) {
    const childCount = cluster.getChildCount();
    let c = ' marker-cluster-';
    if (childCount < 10) {
      c += 'small';
    } else if (childCount < 100) {
      c += 'medium';
    } else {
      c += 'large';
    }

    return L.divIcon({
      html: '<div><span>' + childCount + '</span></div>',
      className: 'marker-cluster' + c,
      iconSize: new L.Point(40, 40)
    });
  },

  _createMarker: function(markers) {

    const length = markers.length;
    const points = markers.map(marker => marker.getLatLng());
    const center = points.reduce((a, c) => L.latLng(a.lat + c.lat / length, a.lng + c.lng / length), L.latLng(0, 0));
    const bounds = L.latLngBounds(points);

    const marker = L.marker(center, {
      icon: this.options.iconCreateFunction({
        getChildCount: function() {
          return markers.length;
        },
        getAllChildMarkers: function() {
          return markers;
        }
      })
    });

    if (this.options.showCoverageOnHover) {
      if (bounds.isValid()) {
        marker._rectangle = L.rectangle(bounds);
        marker.on("mouseover", function() {
          this._map.addLayer(this._rectangle);
        });
        marker.on("mouseout remove", function() {
          this._map.removeLayer(this._rectangle);
        });
      }
    }

    if (this.options.zoomToBoundsOnClick) {
      if (bounds.isValid()) {
        marker.on("click", function() {
          const targetZoom = this._map._getBoundsCenterZoom(bounds).zoom;
          const currentZoom = this._map.getZoom();
          if (targetZoom <= currentZoom) {
            this._map.setView(this.getLatLng(), currentZoom + 1);
          } else {
            this._map.fitBounds(bounds);
          }
        });
      } else {
        marker.on("click", function() {
          this._map.setView(this.getLatLng(), this._map.getZoom() + 1);
        });
      }
    }
    return marker;
  }

});
