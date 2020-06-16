export default function(markers, areaCode) {

  const length = markers.length;
  const points = markers.map(marker => marker.getLatLng());
  const center = points.reduce((a, c) => L.latLng(a.lat + c.lat / length, a.lng + c.lng / length), L.latLng(0, 0));
  const bounds = L.latLngBounds(points);

  const clazz = ["area-code-cluster"];
  if (length < 10) clazz.push("area-code-cluster-small");
  else if (length < 100) clazz.push("area-code-cluster-medium");
  else clazz.push("area-code-cluster-large");

  const marker = L.marker(center, {
    icon: L.divIcon({
      html: `<span>${length}</span>`,
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

  return marker;

};
