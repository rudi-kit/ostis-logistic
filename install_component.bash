#!/usr/bin/env bash
OSTIS_FOLDER=$1

node ./node_modules/webpack/bin/webpack.js &&

cp -rv ./kb/* $OSTIS_FOLDER/kb/
cp -rv ./map/static/ $OSTIS_FOLDER/sc-web/client/
cp -rv ./common $OSTIS_FOLDER/sc-web/client/static
cd $OSTIS_FOLDER/sc-web/client/templates

cat <<EOT >> ./common.html
<link rel="stylesheet" type="text/css" href="/static/common/leaflet/css/leaflet.css" />
EOT

cat <<EOT >> ./components.html
<script type="text/javascript" charset="utf-8" src="/static/components/js/map/map.js"></script>
<link rel="stylesheet" type="text/css" href="/static/components/css/map.css" />
EOT
