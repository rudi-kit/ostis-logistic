var List = React.createClass({
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
      return <img src={object.image} className="img-thumbnail"></img>
  },

  render: function() {
    return (
      <div className="list-group" ref="list" style={{overflowY: "auto", maxHeight: "300px"}}>
        {
          this.props.objects.map(function(object, index) {
            return (
              <a key={index} href="#" className="list-group-item" onClick={() => this.props.onArticleClick(object)}>
                <h4 className="list-group-item-heading">{object.title}</h4>
                <div className="row">
                  <div className="col-sm-5">
                    {this.getPreview(object)}
                  </div>
                  <div className="col-sm-7">
                    <p className="list-group-item-text">{this.getDescription(object)}</p>
                  </div>
                </div>
              </a>
            );
          }, this
        )}
      </div>
    );
  }
});
