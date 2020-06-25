(function () {
  'use strict';

  function defaultClusterMarkerFactory(layers, areaCode) {

    var length = layers.length;
    var points = layers.map(function (layer) { return layer.getLatLng ? layer.getLatLng() : layer.getBounds().getCenter(); });
    var center = points.reduce(function (a, c) { return L.latLng(a.lat + c.lat / length, a.lng + c.lng / length); }, L.latLng(0, 0));
    var bounds = L.latLngBounds(points);

    var clazz = ["area-code-cluster"];
    if (length < 10) { clazz.push("area-code-cluster-small"); }
    else if (length < 100) { clazz.push("area-code-cluster-medium"); }
    else { clazz.push("area-code-cluster-large"); }

    var marker = L.marker(center, {
      icon: L.divIcon({
        html: ("<span>" + length + "</span>"),
        className: clazz.join(" "),
        iconSize: L.point(40, 40)
      })
    });

    if (areaCode.length > 0) {
      marker.bindTooltip(areaCode);
    }

    if (bounds.isValid()) {
      marker._rectangle = L.rectangle(bounds);
      marker.on("mouseover", function() {
        this._map.addLayer(this._rectangle);
      });
      marker.on("mouseout remove", function() {
        this._map.removeLayer(this._rectangle);
      });
    }

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

    return marker;

  }

  function defaultAreaCodeModifier(zoom, areaCode) {
    if (zoom <= 1) { return ""; }
    if (zoom <= 6) { return areaCode; }
    return null;
  }

  L.AreaCodeCluster = L.Layer.extend({
    options: {
      clusterMarkerFactory: defaultClusterMarkerFactory,
      areaCodeModifier: defaultAreaCodeModifier
    },
    initialize: function(layers, options) {
      var this$1 = this;

      L.Util.setOptions(this, options);
      this._source = {};
      this._layers = [];
      layers.forEach(function (layer) {
        this$1.addLayer(layer);
      });
    },
    addLayer: function(layer) {
      var areaCode = layer.options.areaCode;
      if (areaCode && (layer.getLatLng || layer.getBounds)) {
        var target = this._source[areaCode] || (this._source[areaCode] = []);
        if (target.indexOf(layer) === -1) {
          target.push(layer);
          if (this._map) { this._onZoomEnd(); }
        }
      }
      return this;
    },
    removeLayer: function(layer) {
      var count = 0;
      Object.values(this._source).forEach(function (target) {
        var index = target.indexOf(layer);
        if (index !== -1) {
          target.splice(index, 1);
          count++;
        }
      });
      if (this._map && count > 0) { this._onZoomEnd(); }
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
      this._layers.forEach(function (layer) {
        if (map.hasLayer(layer)) { map.removeLayer(layer); }
      });
      this._layers = [];
    },
    _onMoveEnd: function() {
      if (!this._map) { return; }
      var map = this._map;
      var bounds = map.getBounds();
      this._layers.forEach(function (layer) {
        var flag = layer.getLatLng ? bounds.contains(layer.getLatLng()) : bounds.intersects(layer.getBounds());
        if (flag) {
          if (!map.hasLayer(layer)) { map.addLayer(layer); }
        } else {
          if (map.hasLayer(layer)) { map.removeLayer(layer); }
        }
      });
    },
    _onZoomEnd: function() {
      var this$1 = this;


      if (!this._map) { return; }

      var map = this._map;
      var zoom = this._map.getZoom();

      var prev = this._layers;
      var next = [];
      var cluster = {};

      Object.keys(this._source).forEach(function (areaCode) {
        var layers = this$1._source[areaCode];
        var modified = this$1.options.areaCodeModifier(zoom, areaCode);
        if (modified === null || modified === false || modified === undefined) {
          Array.prototype.push.apply(next, layers);
        } else {
          var target = cluster[modified] || (cluster[modified] = []);
          Array.prototype.push.apply(target, layers);
        }
      });

      prev.forEach(function (layer) {
        if (map.hasLayer(layer) && next.indexOf(layer) === -1)
          { map.removeLayer(layer); }
      });

      Object.keys(cluster).forEach(function (areaCode) {
        var layers = cluster[areaCode];
        var clusterMarker = this$1.options.clusterMarkerFactory(layers, areaCode);
        next.push(clusterMarker);
      });

      this._layers = next;
      this._onMoveEnd();
    }
  });

  L.areaCodeCluster = function(markers, options) {
    return new L.AreaCodeCluster(markers, options);
  };

}());
