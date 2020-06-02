#!/usr/bin/env bash

CACHE=.cache
SAC=${CACHE}/japan.json
HOKKAIDO=${CACHE}/hokkaido.html

if [ ! -e $CACHE ]; then
  mkdir $CACHE
fi

if [ ! -e $SAC ]; then

curl -H 'Accept: application/sparql-results+json' \
  --data-urlencode 'query@-' \
  -o $SAC \
  http://data.e-stat.go.jp/lod/sparql/alldata/query << EOS
PREFIX sacs: <http://data.e-stat.go.jp/lod/terms/sacs#>
PREFIX ic: <http://imi.go.jp/ns/core/rdf#>
PREFIX dcterms: <http://purl.org/dc/terms/>
SELECT ?areaCode ?label ?parent WHERE {
  ?x sacs:latestCode ?s.
  ?s ic:表記 ?label ; ic:識別値 ?areaCode.
  optional {?s dcterms:isPartOf/ic:識別値 ?parent.}
}
EOS

fi

if [ ! -e $HOKKAIDO ]; then
  curl http://www.pref.hokkaido.lg.jp/gyosei/shicho/ -o $HOKKAIDO
fi

node japan.js $SAC $HOKKAIDO
