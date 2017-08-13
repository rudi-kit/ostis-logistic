MapComponent = {
  ext_lang: 'openstreetmap_view',
  formats: ['format_openstreetmap_view'],
  struct_support: true,
  factory: function(sandbox) {
    var viewer = new MapViewer(sandbox);
    viewer.init();
    return viewer;
  }
};

MapViewer = function(sandbox) {
  this.sandbox = sandbox;
};

MapViewer.prototype.init = function() {
  var self = this;
  MapKeynodes.init().done(function() {
    self.initCallback();
    self.createReactComponent();
    self.sandbox.updateContent();
  });
};

MapViewer.prototype.initCallback = function() {
  this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);
}

MapViewer.prototype.createReactComponent = function() {
  var store = this.createStore();
  var mapInterface = React.createElement(MapInterface, {store: store, questions: this.getQuestions()});
  ReactDOM.render(mapInterface, document.getElementById(this.sandbox.container));
}

MapViewer.prototype.createStore = function() {
  return MapStore.get();
};

MapViewer.prototype.eventStructUpdate = function(added, contour, arc) {
  fluxify.doAction('changeContour', contour);
  if (added) MapUtils.extractor(arc, contour).extract();
};

MapViewer.prototype.getQuestions = function() {
  return [
    "С какими персонами связано здание?",
  ]
};


SCWeb.core.ComponentManager.appendComponentInitialize(MapComponent);
