var List = React.createClass({displayName: "List",
  propTypes: {
    objects: React.PropTypes.array,
    onArticleClick: React.PropTypes.func,
  },

  getDescription: function(object) {
    if (object.description)
      return object.description.slice(0, 100) + "...";
  },

  getPreview: function(object) {
    if (object.image)
      return React.createElement("img", {src: object.image, className: "img-thumbnail"})
  },

  render: function() {
    return (
      React.createElement("div", {className: "list-group", ref: "list", style: {overflowY: "auto", maxHeight: "300px"}}, 
        
          this.props.objects.map(function(object, index) {
            return (
              React.createElement("a", {key: index, href: "#", className: "list-group-item", onClick: () => this.props.onArticleClick(object)}, 
                React.createElement("h4", {className: "list-group-item-heading"}, object.title), 
                React.createElement("div", {className: "row"}, 
                  React.createElement("div", {className: "col-sm-5"}, 
                    this.getPreview(object)
                  ), 
                  React.createElement("div", {className: "col-sm-7"}, 
                    React.createElement("p", {className: "list-group-item-text"}, this.getDescription(object))
                  )
                )
              )
            );
          }, this
        )
      )
    );
  }
});
