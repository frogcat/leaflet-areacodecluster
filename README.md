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

## Creation

Factory                                                   | Description
--------------------------------------------------------- | -----------------------------------
`L.areaCodeCluster(<Layer[]> layers?, <Object> options?)` | Create a areaCodeCluster, optionally given an initial set of layers and an options object. Layers must have `areaCode` option.


## Options

Option               | Type     | Default  | Description
-------------------- | -------- | -------- | -----------------
`areaCodeModifier`     | Function | [default-areacode-modifier](https://github.com/frogcat/leaflet-areacodecluster/blob/master/src/default-areacode-modifier.js) | A Function that will be called when zoom level changes. Function takes two arguments, `zoom` and `areaCode`. When this function returns `false` or `null`, markers with given `areaCode` will be added to map directly. When this function returns `string`, markers are clustered with returned string.
`clusterMarkerFactory` | Function | [default-cluster-marker-factory](https://github.com/frogcat/leaflet-areacodecluster/blob/master/src/default-cluster-marker-factory.js) | A Function to create cluster marker. Function takes two arguments, `layers` and `modifiedAreaCode`. Typically, it returns instance of L.Marker with customized icon and interaction.


## Methods

Method                       | Returns  | Description
---------------------------- | -------- | ---------------------------
`addLayer(<Layer> layer)`    | this     | Adds the given layer to the group
`removeLayer(<Layer> layer)` | this     | Rmove the given layer from the group

## Examples

### areaCodeModifier

```js
L.areaCodeCluster(layers, {
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

### clusterMarkerFactory

```js
L.areaCodeCluster(layers, {
  clusterMarkerFactory : function(layers,modifiedAreaCode){
    const bounds = L.latLngBounds(layers.map(m=>m.getLatLng()));
    const marker = L.marker(bounds.getCenter(),{
      icon: L.divIcon({
        html: "<span>"+layers.length+"</span>",
      }
    });
    return marker;
  }
}).addTo(map);
```
