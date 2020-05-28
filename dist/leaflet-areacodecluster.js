(function () {
  'use strict';

  (function(L) {

    L.AreaCodeCluster = L.FeatureGroup.extend({
      options: {
        pad: 0
      },
      initialize: function(json, markers, options) {
        var this$1 = this;

        this._areaCodeMap = {};
        this._areaCodeList = [];
        var dig = function (f) {
          f.markers = [];
          f.points = [];
          this$1._areaCodeList.push(f);
          if (f.id) { this$1._areaCodeMap[f.id] = f; }
          if (f.children) {
            f.children.forEach(function (g) {
              g.parent = f;
              dig(g);
            });
          }
        };
        dig(json);

        L.Util.setOptions(this, options);
        this._markers = [];
        if (markers)
          { markers.forEach(function (marker) {
            this$1.addMarker(marker);
          }); }
        L.FeatureGroup.prototype.initialize.call(this, []);
      },
      addMarker: function(marker) {
        var areacode = marker.options.areacode;
        if (this._areaCodeMap[areacode])
          { this._areaCodeMap[areacode].markers.push(marker); }
        else { console.error((areacode + " not found"), marker); }
      },
      onAdd: function(map) {
        this._areaCodeList.forEach(function (g) {
          g.points = [];
        });
        this._areaCodeList.filter(function (g) { return g.markers.length > 0; }).forEach(function (g) {
          var points = g.markers.map(function (m) { return m.getLatLng(); });
          var focus = g;
          while (focus) {
            focus.points = focus.points.concat(points);
            focus = focus.parent;
          }
        });
        this._areaCodeList.forEach(function (g) {
          g.count = g.points.length;
          if (g.count > 0) {
            g.point = L.latLng(0, 0);
            g.points.forEach(function (p) {
              g.point.lat += p.lat / g.count;
              g.point.lng += p.lng / g.count;
            });
          }
        });
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
        var bounds = this._map.getBounds().pad(this.options.pad);
        this._markers.forEach(function (marker) {
          if (bounds.contains(marker.getLatLng())) {
            if (!this$1.hasLayer(marker)) { this$1.addLayer(marker); }
          } else {
            if (this$1.hasLayer(marker)) { this$1.removeLayer(marker); }
          }
        });
      },

      refresh: function() {

        if (!this._map) { return; }

        var zoom = this._map.getZoom();

        var markers = [];
        var dig = function (g) {
          if (g.maxZoom < zoom) {
            markers = markers.concat(g.markers);
            if (g.children) { g.children.forEach(dig); }
          } else {
            if (g.count === 0) { return; }

            var className = 'marker-cluster-';
            if (g.count < 10) {
              className += 'small';
            } else if (g.count < 100) {
              className += 'medium';
            } else {
              className += 'large';
            }
            var marker = L.marker(g.point, {
              icon: L.divIcon({
                html: '<div><span>' + g.count + '</span></div>',
                className: 'marker-cluster ' + className,
                iconSize: L.point(40, 40)
              })
            });

            if (g.count > 1) {
              marker.rectangle = L.rectangle(g.points);
              marker.on("mouseover", function() {
                this._map.addLayer(marker.rectangle);
              });
              marker.on("mouseout remove", function() {
                this._map.removeLayer(marker.rectangle);
              });
            }
            marker.on("click", function() {
              this._map.setView(marker.getLatLng(), g.maxZoom + 1);
            });

            var label = (g.id || "") + (g.label || "");
            if (label.length > 0) { marker.bindTooltip(label); }
            markers.push(marker);
          }
        };
        this._areaCodeList.filter(function (f) { return f.parent === undefined; }).forEach(dig);
        this.clearLayers();
        this._markers = markers;
        this.update();
      }
    });

    L.areaCodeCluster = function(json, markers, options) {
      return new L.AreaCodeCluster(json, markers, options);
    };
  })(window.L);

}());
