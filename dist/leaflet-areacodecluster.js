(function () {
  'use strict';

  L.AreaCodeCluster = L.FeatureGroup.extend({
    options: {
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      iconCreateFunction: null
    },
    initialize: function(resolver, markers, options) {
      var this$1 = this;

      L.Util.setOptions(this, options);

      if (!this.options.iconCreateFunction) {
        this.options.iconCreateFunction = this._defaultIconCreateFunction;
      }

      this._resolver = resolver;
      this._areacodeCluster = {};
      this._markers = [];
      if (markers)
        { markers.forEach(function (marker) {
          this$1.addMarker(marker);
        }); }
      L.FeatureGroup.prototype.initialize.call(this, []);
    },
    addMarker: function(marker) {
      var areacode = marker.options.areacode;
      if (this._resolver.isValid(areacode)) {
        if (this._areacodeCluster[areacode] === undefined) { this._areacodeCluster[areacode] = []; }
        if (this._areacodeCluster[areacode].indexOf(marker) === -1) { this._areacodeCluster[areacode].push(marker); }
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
      var this$1 = this;

      if (!this._map) { return; }
      if (this.options.removeOutsideVisibleBounds) {
        var bounds = this._map.getBounds();
        this._markers.forEach(function (marker) {
          if (bounds.contains(marker.getLatLng())) {
            if (!this$1.hasLayer(marker)) { this$1.addLayer(marker); }
          } else {
            if (this$1.hasLayer(marker)) { this$1.removeLayer(marker); }
          }
        });
      } else {
        this._markers.forEach(function (marker) {
          if (!this$1.hasLayer(marker)) { this$1.addLayer(marker); }
        });
      }
    },

    refresh: function() {
      var this$1 = this;


      if (!this._map) { return; }

      var zoom = this._map.getZoom();

      this.clearLayers();
      this._markers = [];

      var cluster = {};
      Object.keys(this._areacodeCluster).forEach(function (areacode) {
        var markers = this$1._areacodeCluster[areacode];
        var resolved = this$1._resolver.resolve(zoom, areacode);
        if (!resolved || resolved.length === 0) {
          Array.prototype.push.apply(this$1._markers, markers);
        } else {
          if (cluster[resolved] === undefined) { cluster[resolved] = []; }
          Array.prototype.push.apply(cluster[resolved], markers);
        }
      });

      Object.values(cluster).forEach(function (markers) {
        var marker = this$1._createMarker(markers);
        this$1._markers.push(marker);
      });

      this.update();
    },

    _defaultIconCreateFunction: function(cluster) {
      var childCount = cluster.getChildCount();
      var c = ' marker-cluster-';
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

      var length = markers.length;
      var points = markers.map(function (marker) { return marker.getLatLng(); });
      var center = points.reduce(function (a, c) { return L.latLng(a.lat + c.lat / length, a.lng + c.lng / length); }, L.latLng(0, 0));
      var bounds = L.latLngBounds(points);

      var marker = L.marker(center, {
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
            var targetZoom = this._map._getBoundsCenterZoom(bounds).zoom;
            var currentZoom = this._map.getZoom();
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

  var jp = {
    isValid: function(areacode) {
      return !!areacode.match(/^[0-9]{5}$/);
    },
    resolve: function(zoom, areacode) {
      if (zoom <= 4) { return "00000"; }
      if (zoom <= 8) { return areacode.replace(/[0-9]{3}$/, "000"); }
      if (zoom <= 12) { return areacode; }
      return "";
    }
  };

  var world = {
    isValid: function(areacode) {
      return !!areacode.match(/^[A-Z]{2}$/);
    },
    resolve: function(zoom, areacode) {
      if (zoom <= 1) { return "00"; }
      if (zoom <= 6) { return areacode; }
      return "";
    }
  };

  L.areaCodeCluster = function(resolver, markers, options) {
    return new L.AreaCodeCluster(resolver, markers, options);
  };

  L.areaCodeCluster.world = function(markers, options) {
    return new L.AreaCodeCluster(world, markers, options);
  };

  L.areaCodeCluster.jp = function(markers, options) {
    return new L.AreaCodeCluster(jp, markers, options);
  };

}());
