OSTIS_FOLDER=$1||".."

npm i && webpack &&

cp ./openstreetmap_view.scs $OSTIS_FOLDER/kb/openstreetmap_view.scs
cp -R ./map $OSTIS_FOLDER/sc-web/components
cp -R ./common $OSTIS_FOLDER/sc-web/client/static
cd $OSTIS_FOLDER/sc-web/client/templates

cat <<EOT >> ./common.html
<link rel="stylesheet" type="text/css" href="/static/common/leaflet/css/leaflet.css" />
EOT

cat <<EOT >> ./components.html
<script type="text/javascript" charset="utf-8" src="/static/components/js/map/map.js"></script>
<link rel="stylesheet" type="text/css" href="/static/components/css/map.css" />
EOT
