var Timeline = React.createClass({displayName: "Timeline",
  propTypes: {
    year: React.PropTypes.number,
    onTimeChange: React.PropTypes.func
  },

  initSlider: function() {
    this.slider = $(this.refs.slider)
    .slider({
      formatter: function(value) {
        return 'Год: ' + value;
      }
    })
  },

  initSliderCallback: function() {
    var self = this;
    this.slider.on('slideStop', function(value) {
      self.props.onTimeChange({year: value})
    });
  },

  componentDidMount: function() {
    this.initSlider();
    this.initSliderCallback();
  },

  render: function() {
    return (
      React.createElement("div", {className: "form-group row", style: {margin: "10px"}}, 
        React.createElement("div", {className: "text-left col-xs-2"}, "1067"), 
        React.createElement("div", {className: "text-center col-xs-8"}, 
          React.createElement("input", {ref: "slider", type: "text", "data-slider-min": "1067", "data-slider-max": "2016", "data-slider-step": "1", "data-slider-value": "1887"})
        ), 
        React.createElement("div", {className: "text-right col-xs-2"}, "2016")
      )
    );
  }
});
