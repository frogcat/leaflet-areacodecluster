# L.AreaCodeCluster

A leaflet plugin for marker clustering based on area code.

![preview](https://user-images.githubusercontent.com/12029629/85110982-abef4780-b24e-11ea-8fbb-770e218ceb64.png)

# Demo

## [Airports](https://frogcat.github.io/leaflet-areacodecluster/example/airports.html)

Over 28,000 ariports are clustered by [ISO3166-1 alpha2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)

## [Post office in Japan](https://frogcat.github.io/leaflet-areacodecluster/example/post-office-in-japan.html)

Over 24,000 post office in Japan are clustered by [dantai code](https://www.wikidata.org/wiki/Property:P429).

# Usage

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Airports clustered by country</title>
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" />
  <!-- include leaflet-areacodecluster.default.css (optional)-->
  <link rel="stylesheet" href="https://frogcat.github.io/leaflet-areacodecluster/dist/leaflet-areacodecluster.default.css" />
  <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>
  <!-- include leaflet-areacodecluster(.min).js (required) -->
  <script src="https://frogcat.github.io/leaflet-areacodecluster/dist/leaflet-areacodecluster.min.js"></script>
</head>

<body>
  <div id="map" style="position:absolute;top:0;left:0;bottom:0;right:0;"></div>
  <script>
  // Init map
    const map = L.map("map", {
      zoom: 2,
      center: [0, 0],
      preferCanvas: true
    });

  // Add background layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

  // Get data
    fetch("airports.tsv").then(a => a.text()).then(tsv => {
      const markers = tsv.trim().split("\n").map(row => row.split("\t")).map(col => {
        const icao = col[0];
        const name = col[1];
        const city = col[2];
        const state = col[3];
        const country = col[4];
        const lat = col[5];
        const lon = col[6];

        // Init marker with areaCode option
        return L.circleMarker([lat, lon], {
          areaCode: country
        }).bindTooltip(`${icao}:${name}`);
      });

      // Init areaCodeCluster, then add to map
      L.areaCodeCluster(markers).addTo(map);
    });
  </script>
</body>

</html>
```

# Methods

`L.AreaCodeCluster` extends `L.FeatureGroup`, but there are no additional methods.
`addLayer`, `removeLayer` and `clearLayers` are supported and they should work for most uses.

# Options

## areaCodeModifier

```js
L.areaCodeCluster(markers,{
  areaCodeModifier : function(zoom,areaCode){
    if (zoom <= 4) return "";
    if (zoom <= 8) return areaCode.substring(0, 2);
    if (zoom <= 12) return areaCode.substring(0, 5);
    return null;
  }
}).addTo(map);

```

- zoom=0~4 : markers are clustered by modified areaCode (""), so there will be single cluster.
- zoom=5~8 : markers area clustered by modified areaCode (leading two digit),
- zoom=8~12 : markers area clustered by modified areaCode (leading five digit),
- zoom>12 : when modified areaCode is null, marker is not clustered.

to be added

## clusterMarkerFactory

```js
L.areaCodeCluster(markers,{
  clusterMarkerFactory : function(markers,modifiedAreaCode){
    const bounds = L.latLngBounds(markers.map(m=>m.getLatLng()));
    const marker = L.marker(bounds.getCenter(),{
      icon: L.divIcon({
        html: `<span>${markers.length}</span>`,
      }
    });
    return marker;
  }
}).addTo(map);

```

to be added
