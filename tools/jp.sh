#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd)
CACHE=${SCRIPT_DIR}/.cache
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
SELECT ?areaCode ?label ?issued ?parent ?next WHERE {
  ?s ic:表記 ?label ; ic:識別値 ?areaCode ; dcterms:issued ?issued.
  optional {?s dcterms:isPartOf/ic:識別値 ?parent.}
  optional {?s sacs:succeedingMunicipality/ic:識別値 ?next.}
} order by ?issued
EOS

fi

if [ ! -e $HOKKAIDO ]; then
  curl http://www.pref.hokkaido.lg.jp/gyosei/shicho/ -o $HOKKAIDO
fi

node ${SCRIPT_DIR}/jp.js $SAC $HOKKAIDO
