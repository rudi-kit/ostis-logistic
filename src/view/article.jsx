var Article = React.createClass({
  propTypes: {
    object: React.PropTypes.object,
    onListClick: React.PropTypes.func
  },

  doDefaultCommand: function() {
    SCWeb.core.Main.doDefaultCommand([this.props.object.id]);
  },

  appendArgument: function() {
    SCWeb.core.Arguments.appendArgument(this.props.object.id);
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-body" style={{overflowY: "auto", maxHeight: "300px"}}>
          <h4 onClick={this.appendArgument} style={{cursor: "pointer"}}>
            {this.props.object.title}
          </h4>
          <img src={this.props.object.image} className="img-thumbnail"></img>
          <p className="list-group-item-text">{this.props.object.description}</p>
        </div>
        <div className="panel-footer">
          <ul className="nav nav-pills">
            <li className="active"><a href="#" onClick={this.doDefaultCommand}>Перейти к статье</a></li>
            <li><a href="#" onClick={this.props.onListClick}>Назад</a></li>
          </ul>
        </div>
      </div>
    );
  }
});
