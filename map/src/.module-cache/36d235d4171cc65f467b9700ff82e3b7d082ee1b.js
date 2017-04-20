Map.Article = React.createClass({displayName: "Article",
  propTypes: {
    object: React.PropTypes.object,
    onListClick: React.PropTypes.func
  },

  render: function() {
    return (
      React.createElement("div", {className: "panel panel-default"}, 
        React.createElement("div", {className: "panel-body", style: {overflowY: "auto", maxHeight: "400px"}}, 
          React.createElement("h4", null, this.props.object.title), 
          React.createElement("img", {src: this.props.object.image, className: "img-thumbnail"}), 
          React.createElement("p", {className: "list-group-item-text"}, this.props.object.description)
        ), 
        React.createElement("div", {className: "panel-footer"}, 
          React.createElement("ul", {className: "nav nav-pills"}, 
            React.createElement("li", {className: "active"}, React.createElement("a", {href: "#"}, "Перейти к статье")), 
            React.createElement("li", null, React.createElement("a", {href: "#", onClick: this.props.onListClick}, "Назад"))
          )
        )
      )
    );
  }
});
