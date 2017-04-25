var MapState = {};

var GeneratePath = React.createClass({displayName: "GeneratePath",
  componentDidMount: function() {
    this.setState({pathType: "pedestrian"});
  },

  generatePath: function() {
    $(MapState).trigger({
      type:"generatePath",
      pathType: this.state.pathType
    });
  },

  onPathTypeChange: function(context) {
    var pathType = context.target.value;
    this.setState({pathType: pathType});
  },

  render: function() {
    return (
      React.createElement("div", {className: "form-group row", style: {margin: "10px"}},
        React.createElement("a", {href: "#", style: {fontSize: "16px"}, onClick: this.generatePath}, "Проложить маршрут"), 
        React.createElement("div", {className: "form-group"},
          React.createElement("div", {style: {fontSize: "16px"}},
            React.createElement("label", {style: {cursor: "pointer", fontWeight: 400, margin: 0}}, 
              React.createElement("input", {type: "radio", name: "pathTypes", value: "pedestrian", style: {marginRight: "5px"}, onChange: this.onPathTypeChange, defaultChecked: true}),
              "Пешком"
            ),
          ),
          React.createElement("div", {style: {fontSize: "16px"}},
            React.createElement("label", {style: {cursor: "pointer", fontWeight: 400, margin: 0}}, 
              React.createElement("input", {type: "radio", name: "pathTypes", value: "auto", style: {marginRight: "5px"}, onChange: this.onPathTypeChange}),
              "На машине"
            ),
          ),
          React.createElement("div", {style: {fontSize: "16px"}},
            React.createElement("label", {style: {cursor: "pointer", fontWeight: 400, margin: 0}}, 
              React.createElement("input", {type: "radio", name: "pathTypes", value: "bicycle", style: {marginRight: "5px"}, onChange: this.onPathTypeChange}),
              "На велосипеде"
            )
          )
        )
      )
    );
  }
});
