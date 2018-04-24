#!/usr/bin/env bash

OSTIS_FOLDER=$1
OSTIS_FOLDER=${OSTIS_FOLDER:-$OSTIS_FOLDER_GLOBAL}
OSTIS_FOLDER=${OSTIS_FOLDER:-".."}
echo "ostis in folder: $OSTIS_FOLDER"

LIBRARY_NAME="map.js"
LIBRARY_FOLDER="logistic-map"

cp -rv ./kb/* $OSTIS_FOLDER/kb/

rm $OSTIS_FOLDER/sc-web/client/static/components/js/$LIBRARY_NAME
ln -v -s $(pwd)/node_modules/leaflet/dist $OSTIS_FOLDER/sc-web/client/static/common/leaflet

rm $OSTIS_FOLDER/sc-web/client/static/components/js/$LIBRARY_FOLDER
ln -v -s $(pwd)/resources $OSTIS_FOLDER/sc-web/client/static/components/js
mv -v $OSTIS_FOLDER/sc-web/client/static/components/js/resources $OSTIS_FOLDER/sc-web/client/static/components/js/$LIBRARY_FOLDER
ln -v -s $(pwd)/dist/$LIBRARY_NAME $OSTIS_FOLDER/sc-web/client/static/components/js/$LIBRARY_NAME

cat <<EOT >> $OSTIS_FOLDER/sc-web/client/templates/components.html
<script type="text/javascript" charset="utf-8" src="/static/components/js/$LIBRARY_NAME"></script>
<link rel="stylesheet" href="/static/common/leaflet/leaflet.css"/>
EOT

