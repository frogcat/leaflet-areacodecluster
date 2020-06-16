(function () {
  'use strict';

  function defaultClusterMarkerFactory(markers, areaCode) {

    var length = markers.length;
    var points = markers.map(function (marker) { return marker.getLatLng(); });
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

  L.AreaCodeCluster = L.FeatureGroup.extend({
    options: {
      clusterMarkerFactory: defaultClusterMarkerFactory,
      areaCodeModifier: defaultAreaCodeModifier
    },
    initialize: function(markers, options) {
      var this$1 = this;

      L.Util.setOptions(this, options);
      this._sourceCluster = {};
      this._markersForCurrentZoom = [];
      if (markers)
        { markers.forEach(function (marker) {
          this$1.addMarker(marker);
        }); }
      L.FeatureGroup.prototype.initialize.call(this, []);
    },
    addMarker: function(marker) {
      var areaCode = marker.options.areaCode;
      var target = this._sourceCluster[areaCode] || (this._sourceCluster[areaCode] = []);
      if (target.indexOf(marker) === -1) { target.push(marker); }
    },
    removeMarker: function(marker) {
      var this$1 = this;

      Object.keys(this._sourceCluster).forEach(function (areaCode) {
        this$1._sourceCluster[areaCode] = this$1._sourceCluster[areaCode].filter(function (x) { return x !== marker; });
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
      var this$1 = this;

      if (!this._map) { return; }
      var bounds = this._map.getBounds();
      this._markersForCurrentZoom.forEach(function (marker) {
        if (bounds.contains(marker.getLatLng())) {
          if (!this$1.hasLayer(marker)) { this$1.addLayer(marker); }
        } else {
          if (this$1.hasLayer(marker)) { this$1.removeLayer(marker); }
        }
      });
    },
    _onZoomEnd: function() {
      var this$1 = this;


      if (!this._map) { return; }

      var zoom = this._map.getZoom();

      this.clearLayers();
      this._markersForCurrentZoom = [];

      var modifiedCluster = {};
      Object.keys(this._sourceCluster).forEach(function (areaCode) {
        var markers = this$1._sourceCluster[areaCode];
        var key = this$1.options.areaCodeModifier(zoom, areaCode);
        if (key === null || key === false || key === undefined) {
          Array.prototype.push.apply(this$1._markersForCurrentZoom, markers);
        } else {
          var target = modifiedCluster[key] || (modifiedCluster[key] = []);
          Array.prototype.push.apply(target, markers);
        }
      });

      Object.keys(modifiedCluster).forEach(function (areaCode) {
        var markers = modifiedCluster[areaCode];
        this$1._markersForCurrentZoom.push(this$1.options.clusterMarkerFactory(markers, areaCode));
      });

      this._onMoveEnd();
    }
  });

  L.areaCodeCluster = function(markers, options) {
    return new L.AreaCodeCluster(markers, options);
  };

}());
