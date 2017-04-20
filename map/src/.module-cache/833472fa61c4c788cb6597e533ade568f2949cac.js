Map.List = React.createClass({displayName: "List",
  propTypes: {
    objects: React.PropTypes.array,
    onArticleClick: React.PropTypes.func,
  },

  initReadmore: function() {
    $(this.refs.list)
    .find('.list-group-item-text')
    .readmore({
      collapsedHeight: 60,
      moreLink: '<a href="#">Читать все</a>',
      lessLink: '<a href="#">Скрыть</a>'
    });
  },

  componentDidMount: function() {
    this.initReadmore();
  },

  render: function() {
    return (
      React.createElement("div", {className: "list-group", ref: "list", style: {overflowY: "auto", maxHeight: "450px"}}, 
        
          this.props.objects.map(function(object, index) {
            return (
              React.createElement("a", {key: index, href: "#", className: "list-group-item", onClick: this.props.onArticleClick.bind(null, object)}, 
                React.createElement("h4", {className: "list-group-item-heading"}, object.title), 
                React.createElement("div", {className: "row"}, 
                  React.createElement("div", {className: "col-sm-5"}, 
                    React.createElement("img", {src: object.image, className: "img-thumbnail"})
                  ), 
                  React.createElement("div", {className: "col-sm-7"}, 
                    React.createElement("p", {className: "list-group-item-text"}, object.description)
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
