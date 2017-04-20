var MapInterface = React.createClass({displayName: "MapInterface",
  propTypes: {
    objects: React.PropTypes.array
  },

  getInitialState: function() {
    return {chosen: null};
  },

  onListClick: function() {
    this.setState({chosen: null})
  },

  onClick: function(object) {
    this.setState({chosen: object})
  },

  onTimeChange: function(time) {
    console.log(time)
  },

  createViewer: function() {
    if (this.state.chosen)
      return React.createElement(Article, {object: this.state.chosen, onListClick: this.onListClick})
    else
      return React.createElement(List, {objects: this.props.objects, onArticleClick: this.onClick})
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Map, {objects: this.props.objects, chosen: this.state.chosen, onMarkerClick: this.onClick}), 
        React.createElement("div", {className: "row", style: {margin: "10px"}}, 
          React.createElement("div", {className: "col-sm-4 well"}, 
            React.createElement("div", {className: "form-group"}, 
              React.createElement(QuestionLine, null)
            ), 
            React.createElement(Timeline, {onTimeChange: this.onTimeChange}), 
            this.createViewer()
          )
        )
      )
    );
  }
});
