Map.Map = React.createClass({displayName: "Map",
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
    this.state.map = new google.maps.Map(this.refs.map, {
      zoom: 18,
      center: {lat: 53.90373, lng: 27.55768},
    });
  },

  clearMap: function() {
    //TODO clear array
    this.state.markers.map(function(marker) {
      marker.setMap(null);
    })
  },

  addMarkersToMap: function() {
    var state = this.state;
    var onMarkerClick = this.props.onMarkerClick;
    this.props.objects.map(function(object) {
      var marker = new google.maps.Marker({
        position: {lat: object.lat, lng: object.lng},
        map: state.map,
        title: object.title
      });
      state.map.setCenter({lat: object.lat, lng: object.lng});
      marker.addListener('click', function() {
        onMarkerClick(object);
      });
      state.markers.push(marker);
    })
  },

  componentDidMount: function() {
    this.createMap();
    this.addMarkersToMap();
  },

  setCenter: function() {
    if (this.props.chosen) {
      this.state.map.setCenter({lat: this.props.chosen.lat, lng: this.props.chosen.lng});
      this.state.map.setZoom(18);
    }
  },

  render: function() {
    this.setCenter();
    return (
      React.createElement("div", {ref: "map", style: {position: "absolute", top: "0px", left: "0px", width: "100%", height: "100%"}})
    );
  }
});
