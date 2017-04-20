var Map = React.createClass({displayName: "Map",
  propTypes: {
    objects: React.PropTypes.array,
    chosen: React.PropTypes.object,
    onMarkerClick: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      map: null,
      markers: []
    }
  },

  createMap: function() {
    this.state.map = new L.Map('map', {zoomControl: false});
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20});
    this.state.map.addLayer(osm);
  },

  fixZoomControls: function() {
    new L.control.zoom({position: 'bottomright'})
      .addTo(this.state.map);
  },

  clearMap: function() {
    //TODO clear array
    var map = this.state.map;
    this.state.markers.map(function(marker) {
      map.removeMarker(marker);
    })
  },

  addMarkersToMap: function() {
    var state = this.state;
    var onMarkerClick = this.props.onMarkerClick;
    this.props.objects.map(function(object) {
      var marker = new L.Marker([object.lat, object.lng])
        .addTo(state.map)
        .on('click', () => onMarkerClick(object));
      state.map.setView(new L.LatLng(object.lat, object.lng), 18);
      state.markers.push(marker);
    })
  },

  componentDidMount: function() {
    this.createMap();
    this.addMarkersToMap();
    this.fixZoomControls();
  },

  setCenter: function() {
    if (this.props.chosen) 
      this.state.map.setView(new L.LatLng(this.props.chosen.lat, this.props.chosen.lng), 18);
  },

  render: function() {
    this.setCenter();
    return (
      React.createElement("div", {id: "map", style: {position: "absolute", top: "0px", left: "0px", width: "90%", height: "90%"}})
    );
  }
});
