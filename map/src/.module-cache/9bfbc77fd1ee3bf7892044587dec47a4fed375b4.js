Map.Component = {
    ext_lang: 'openstreetmap_view',
    formats: ['format_openstreetmap'],
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
    this.initCallback();
    this.createReactComponent();
    this.sandbox.updateContent();
};

MapViewer.prototype.initCallback = function() {
    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
}

MapViewer.prototype.createReactComponent = function() {
    var mapInterface = React.createElement(MapInterface, {objects: this.getObjects(), questions: this.getQuestions()});
    ReactDOM.render(mapInterface, document.getElementById(this.sandbox.container));
}

MapViewer.prototype.eventStructUpdate = function(added, contour, arc) {
    var deferred = new jQuery.Deferred();
    //TODO receive json from KB
    deferred.resolve();
    return deferred.promise();
};

MapViewer.prototype.getObjects = function() {
    return [
      {
        "title": "Здание мужского базилианского монастыря",
        "image": "http://farm3.static.flickr.com/2153/2842876054_ea95f1ab31_o.jpg",
        "description": "Корпус мужского базилианского монастыря начал строиться в 1617 году и принадлежал ордену униатов. В 1795 году униатские монастыри были закрыты, а в здании разместилась Минская мужская гимназия и Присутственные места.",
        "lat": 53.903, 
        "lng": 27.557
      }, 
      {
        "title": "Здание женского базилианского монастыря",
        "image": "http://minsk-old-new.com/Image/exkursia/x-051-Muzic-School-1.jpg",
        "description": "Строительство здания началось в 1641 году по фундации трокской кастелянши Зузаны Гансевской. Во время его строительства были использованы подвалы и стены тех жилых зданий, которые находились на этом месте ранее. В здании располагался монастырь Святого духа базилианок.",
        "lat": 53.90373, 
        "lng": 27.55768
      },
      {
        "title": "Здание Минского железнодорожного вокзала",
        "image": "http://history.rw.by/uploads/stations/1300x550_tt/minsk_sh.jpg",
        "description": "Минск-Пассажирский — пассажирский железнодорожный терминал, расположенный в столице Белоруссии Минске. Главный железнодорожный вокзал города.",
        "lat": 53.890572, 
        "lng": 27.550837
      },
      {
        "title": "Дом Монюшко",
        "image": "http://problr.by/assets/components/phpthumbof/cache/43900cd9a6686a1a1c1bd735627ed5bd.5404702a2b75d3bc16912ae5f4655747.jpg",
        "description": "Здание было построено в 1797 году. В 20-х годах XIXвека дом принадлежал Климкевичу, а в начале XXвека – М. Френкелю. Первоначально здание было двухэтажным. Третий этаж был пристроен в начале XXвека.",
        "lat": 53.903776, 
        "lng": 27.558306
      }
    ]
};

MapViewer.prototype.getQuestions = function() {
    return [
      "Как выглядел объект в 2016 году?",
      "Какая организация здесь располагается?",
      "Какие здания находятся в радиусе 1000м?",
      "Как сюда пройти?"
    ]
};


SCWeb.core.ComponentManager.appendComponentInitialize(Map.Component);
