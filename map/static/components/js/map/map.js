/* --- src/keynodes.js --- */
var MapKeynodes = {
  
}

MapKeynodes.IDENTIFIERS = [
  'nrel_main_idtf',
  'lang_ru',
  'rrel_key_sc_element',
  'sc_illustration',
  'sc_definition',
  'nrel_sc_text_translation',
  'rrel_example',
  'nrel_osm_query',
  'ui_menu_file_for_finding_persons'
];

MapKeynodes.init = function() {
  var deferred = $.Deferred();
  var self = this;
  SCWeb.core.Server.resolveScAddr(MapKeynodes.IDENTIFIERS, function (keynodes) {
    self.keynodes = keynodes;
    deferred.resolve();
  });
  return deferred;
};


MapKeynodes.get = function(identifier) {
  return this.keynodes[identifier];
};

/* --- src/store.js --- */
MapStore = {
  get: function() {
    this.store = this.store || this.create();
    return this.store;
  },

  create: function() {
    return fluxify.createStore({
      id: "MapStore",
      initialState: {
        objects: {},
        chosen: null,
        contour: null,
        loaded: true
      },
      actionCallbacks: {
        importObject: function(updater, coordinates) {
          var objects = Object.assign({}, this.objects);
          MapUtils.importer(coordinates).import();
        },
        changeObject: function(updater, object) {
          var objects = Object.assign({}, this.objects);
          objects[object.id] = Object.assign({}, objects[object.id], object);
          updater.set({objects: objects});
        },
        clean: function(updater) {
          updater.set({objects: {}, chosen: null});
        },
        chooseObject: function(updater, object) {
          updater.set({chosen: object})
        },
        resetChosen: function(updater) {
          updater.set({chosen: null})
        },
        changeContour: function(updater, contour) {
          updater.set({contour: contour})
        },
        setLoadState: function(updater, loaded) {
          updater.set({loaded: loaded})
        }
      }
    });
  }
}

/* --- src/article.js --- */
var Article = React.createClass({displayName: "Article",
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
      React.createElement("div", {className: "panel panel-default"}, 
        React.createElement("div", {className: "panel-body", style: {overflowY: "auto", maxHeight: "300px"}}, 
          React.createElement("h4", {onClick: this.appendArgument, style: {cursor: "pointer"}}, 
            this.props.object.title
          ), 
          React.createElement("img", {src: this.props.object.image, className: "img-thumbnail"}), 
          React.createElement("p", {className: "list-group-item-text"}, this.props.object.description)
        ), 
        React.createElement("div", {className: "panel-footer"}, 
          React.createElement("ul", {className: "nav nav-pills"}, 
            React.createElement("li", {className: "active"}, React.createElement("a", {href: "#", onClick: this.doDefaultCommand}, "Перейти к статье")), 
            React.createElement("li", null, React.createElement("a", {href: "#", onClick: this.props.onListClick}, "Назад"))
          )
        )
      )
    );
  }
});


/* --- src/list.js --- */
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


/* --- src/map.js --- */
var Map = React.createClass({displayName: "Map",
  propTypes: {
    objects: React.PropTypes.array,
    chosen: React.PropTypes.object,
    onMarkerClick: React.PropTypes.func,
    onMapClick: React.PropTypes.func
  },

  initCursorListener: function() {
    document.body.addEventListener('keydown', (event) => {
      if (event.ctrlKey)
        this.refs.map.style.cursor = "crosshair";
    });
    document.body.addEventListener('keyup', () => {
      this.refs.map.style.cursor = "";
    });
  },

  createMap: function() {
    this.map = new L.Map('map', {zoomControl: false});
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 17});
    this.map.addLayer(osm);
  },

  bindMapClickAction: function() {
    this.map.on('click', (event) => {
      if (event.originalEvent.ctrlKey)
        this.props.onMapClick(event.latlng)
    });
  },

  fixZoomControls: function() {
    new L.control.zoom({position: 'bottomright'}).addTo(this.map);
  },

  clearMap: function() {
    if (this.markers)
      this.map.removeLayer(this.markers);
  },

  addMarkersToMap: function() {
    var markers = [];
    var onMarkerClick = this.props.onMarkerClick;
    this.props.objects.map(function(object) {
      if (!MapUtils.empty(object.geojson)) {
        var marker = L.geoJSON(object.geojson).on('click', () => onMarkerClick(object));
        markers.push(marker);
      }
    });
    if (markers.length > 0) {
      this.markers = L.featureGroup(markers); 
      this.markers.addTo(this.map);
      this.map.fitBounds(this.markers.getBounds());
    }
  },

  setInitialView: function() {
    this.map.setView([53, 27], 1);
  },

  setCenter: function() {
    if (this.props.chosen && !MapUtils.empty(this.props.chosen.geojson))
      this.map.fitBounds(L.geoJSON(this.props.chosen.geojson).getBounds());
  },

  componentDidMount: function() {
    this.createMap();
    this.bindMapClickAction();
    this.setInitialView();
    this.fixZoomControls();
    this.initCursorListener();
  },

  componentDidUpdate: function() {
    this.clearMap();
    this.addMarkersToMap();
    this.setCenter();
  },

  render: function() {
    return (
      React.createElement("div", {id: "map", ref: "map", style: {position: "absolute", top: "0px", left: "0px", width: "100%", height: "100%"}})
    );
  }
});


/* --- src/map_interface.js --- */
var MapInterface = React.createClass({displayName: "MapInterface",
  propTypes: {
    questions: React.PropTypes.array,
    store: React.PropTypes.object
  },

  componentDidMount: function() {
    this.cleanModel();
    this.initChosenListener();
    this.initObjectsListener();
    this.initLoadedListener();
  },

  cleanModel: function() {
    fluxify.doAction('clean');
  },

  initChosenListener: function() {
    this.props.store.on('change:chosen', (chosen) => {
      this.setState({chosen: chosen});
    });
  },

  initObjectsListener: function() {
    this.props.store.on('change:objects', (objects) => {
      this.setState({objects: Object.values(objects)});
    });
  },

  initLoadedListener: function() {
    this.props.store.on('change:loaded', (loaded) => {
      this.setState({loaded: loaded});
    });
  },

  getInitialState: function() {
    return {
      objects: Object.values(this.props.store.objects),
      chosen: this.props.store.chosen,
      loaded: this.props.store.loaded
    };
  },

  onListClick: function() {
    fluxify.doAction('resetChosen');
  },

  onClick: function(object) {
    fluxify.doAction('chooseObject', object);
  },

  onMapClick: function(coordinates) {
    fluxify.doAction('importObject', coordinates);
  },

  //TODO remove hard-coded question
  onAgentParamsChange: function(params) {
    SCWeb.core.Main.doCommand(MapKeynodes.get('ui_menu_file_for_finding_persons'), [this.state.chosen.id]);
  },

  createViewer: function() {
    if (this.state.chosen)
      return React.createElement(Article, {object: this.state.chosen, onListClick: this.onListClick})
    else
      return React.createElement(List, {objects: this.state.objects, onArticleClick: this.onClick})
  },

  render: function() {
    return (
      React.createElement(Loader, {loaded: this.state.loaded}, 
        React.createElement(Map, {objects: this.state.objects, chosen: this.state.chosen, onMarkerClick: this.onClick, onMapClick: this.onMapClick}), 
        React.createElement("div", {className: "row", style: {margin: "10px"}}, 
          React.createElement("div", {className: "col-sm-5 well"}, 
            React.createElement("div", {className: "form-group"}, 
              React.createElement(QuestionLine, {onChange: this.onAgentParamsChange, questions: this.props.questions})
            ), 
            React.createElement(Timeline, {onTimeChange: this.onAgentParamsChange}), 
            this.createViewer()
          )
        )
      )
    );
  }
});


/* --- src/question_line.js --- */
var QuestionLine = React.createClass({displayName: "QuestionLine",
  propTypes: {
    questions: React.PropTypes.array,
    onChange: React.PropTypes.func
  },

  getInitialState: function() {
    return {question: ''}
  },

  matchStateToTerm: function(state, value) {
    return state.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  },

  sortStates: function(a, b, value) {
    return a.toLowerCase().indexOf(value.toLowerCase()) > b.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1;
  },

  onChange: function(value, notify) {
    if (notify)
      this.props.onChange({question: value});
    this.setState({question: value});
  },

  render: function() {
    return (
      React.createElement(ReactAutocomplete, {
        wrapperStyle: {display: 'block'}, 
        inputProps: {placeholder: "Задайте вопрос", className: "form-control"}, 
        menuStyle: {
          zIndex: "1000000",
          borderRadius: '3px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          background: '#ffffff',
          border: '1px solid #dddddd',
          color: '#555555',
          padding: '2px 0',
          position: 'fixed',
          overflow: 'auto',
          maxHeight: '50%'
        }, 
        items: this.props.questions, 
        value: this.state.question, 
        shouldItemRender: this.matchStateToTerm, 
        sortItems: this.sortStates, 
        onChange: (event, value) => this.onChange(value), 
        onSelect: value => this.onChange(value, true), 
        getItemValue: (item) => item, 
        renderItem: (item, isHighlighted) => (
          React.createElement("div", {className: "question"}, item)
        )}
      )
    );
  }
});


/* --- src/timeline.js --- */
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


/* --- src/utils.js --- */
var MapUtils = {
  SQUARE_SIDE: 0.0001,
  doOSMQuery: function(query, callback) {
    $.ajax({
      method: 'POST',
      url: "http://overpass-api.de/api/interpreter",
      data: {
        data: query
      },
      success: callback
    })
  },
  getOSMQueryForCoordinates: function(coordinates) {
    square = [
      coordinates.lat - MapUtils.SQUARE_SIDE, 
      coordinates.lng - MapUtils.SQUARE_SIDE, 
      coordinates.lat + MapUtils.SQUARE_SIDE, 
      coordinates.lng + MapUtils.SQUARE_SIDE
    ].join(",");
    return MapUtils.getOSMQuery(
      "node(" + square + ");" +
      "way(" + square + ");" +
      "relation(" + square + ");"
    );
  },
  getOSMQuery: function(query) {
    query = query.trim();
    if (/\[out:json\];/.test(query) || /out skel qt/.test(query)) return query;
    if (/^\([^)]+\);/.test(query)) return '[out:json];' + query + 'out body; >; out skel qt;';
    return '[out:json];(' + query + '); out body; >; out skel qt;';
  },
  empty: function(geojson) {
    return !geojson || !geojson.features || !geojson.features.length;
  },
  importer: function(coordinates) {
    var contour = MapStore.get().contour;
    return {
      import: function() {
        MapUtils.doOSMQuery(MapUtils.getOSMQueryForCoordinates(coordinates), (data) => {
          data.elements.map((element) => {
            if (element["tags"] && element["tags"]["name"])
              this.createNode(element);
          });
        });
      },
      createNode: function(element) {
        window.sctpClient.create_node(sc_type_const | sc_type_node)
        .done((node) => {
          element["ostisId"] = node;
          $.when(this.importIdentifier(element), this.importQuery(element))
          .done(() => {
            console.log("Created");
            this.addToContour(element);
          })
          .fail(() => {
            console.log("Failed to import");
          })
        });
      },
      showModal: function(element) {
        $.toast(element["tags"]["name"] + " добавлен на карту");
      },
      importIdentifier: function(element) {
        var deferred = $.Deferred();
        window.sctpClient.create_link()
        .done((link) => {
          window.sctpClient.set_link_content(link, element["tags"]["name"])
          .done(() => {
            window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, element["ostisId"], link)
            .done((arc) => {
              window.sctpClient.create_arc(sc_type_arc_pos_const_perm, MapKeynodes.get("nrel_main_idtf"), arc)
              .done(() => {
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, MapKeynodes.get("lang_ru"), link)
                .done(() => {
                  deferred.resolve();
                }).fail(deferred.reject)
              }).fail(deferred.reject)
            }).fail(deferred.reject)
          }).fail(deferred.reject)
        }).fail(deferred.reject);
        return deferred.promise();
      },
      importQuery: function(element) {
        var deferred = $.Deferred();
        window.sctpClient.create_link()
        .done((link) => {
          window.sctpClient.set_link_content(link, element["type"] + "(" + element["id"] + ");")
          .done(() => {
            window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, element["ostisId"], link)
            .done((arc) => {
              window.sctpClient.create_arc(sc_type_arc_pos_const_perm, MapKeynodes.get("nrel_osm_query"), arc)
              .done(() => {
                deferred.resolve();
              }).fail(deferred.reject)
            }).fail(deferred.reject)
          }).fail(deferred.reject)
        }).fail(deferred.reject);
        return deferred.promise();
      },
      addToContour: function(element) {
        console.log(contour);
        console.log(element["ostisId"]);
        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, contour, element["ostisId"])
        .done(() => {
          this.showModal(element);
        })
        .fail(() => {
          console.log("Can't add!");
        })
      }
    }
  },
  extractor: function(arc) {
    var contour = MapStore.get().contour;
    return {
      extract: function() {
        window.sctpClient.get_arc(arc)
        .done((nodes) => {
          this.checkTerrainObject(nodes[1])
          .done(() => {
            this.extractIdentifier(nodes[1]);
            this.extractDescription(nodes[1]);
            this.extractImage(nodes[1]);
            this.extractCoordinates(nodes[1]);
          })
        });
      },
      checkTerrainObject: function(object) {
        var deferred = $.Deferred();
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          object,
                          sc_type_arc_common | sc_type_const,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_osm_query")
                        ])
        ).done(function(results) {
          if (results.exist())
            deferred.resolve();
          else
            deferred.reject();
        })
        .fail(deferred.reject);
        return deferred.promise();
      },
      extractIdentifier: function(object) {
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          object,
                          sc_type_arc_common | sc_type_const,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_main_idtf")
                        ], {"identifier": 2}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                        [
                          MapKeynodes.get("lang_ru"),
                          sc_type_arc_pos_const_perm,
                          "identifier"
                        ])
        ).done(function(results) {            
          window.sctpClient.get_link_content(results.get(0, "identifier"))
          .done(function (title) {
            fluxify.doAction('changeObject', {id: object, title: title});   
          });
        });
      },
      extractImage: function(object) {
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,
                        [
                          sc_type_node,
                          sc_type_arc_pos_const_perm,
                          object,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("rrel_key_sc_element")
                        ], {"image_node": 0}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                        [
                          MapKeynodes.get("sc_illustration"),
                          sc_type_arc_pos_const_perm,
                          "image_node"
                        ]),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,
                        [
                          sc_type_node,
                          sc_type_arc_common | sc_type_const,
                          "image_node",
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_sc_text_translation")
                        ], {"translation_node": 0}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          "translation_node",
                          sc_type_arc_pos_const_perm,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("rrel_example")
                        ], {"image": 2})
        ).done(function(results) {            
          var image = "api/link/content/?addr=" + results.get(0, "image");
          fluxify.doAction('changeObject', {id: object, image: image});   
        });
      },
      extractDescription: function(object) {
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,
                        [
                          sc_type_node,
                          sc_type_arc_pos_const_perm,
                          object,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("rrel_key_sc_element")
                        ], {"description_node": 0}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                        [
                          MapKeynodes.get("sc_definition"),
                          sc_type_arc_pos_const_perm,
                          "description_node"
                        ]),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,
                        [
                          sc_type_node,
                          sc_type_arc_common | sc_type_const,
                          "description_node",
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_sc_text_translation")
                        ], {"translation_node": 0}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          "translation_node",
                          sc_type_arc_pos_const_perm,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("rrel_example")
                        ], {"description": 2}),
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F,
                        [
                          MapKeynodes.get("lang_ru"),
                          sc_type_arc_pos_const_perm,
                          "description"
                        ])
        ).done(function(results) {            
          window.sctpClient.get_link_content(results.get(0, "description"))
          .done(function (description) {
            fluxify.doAction('changeObject', {id: object, description: description});   
          });
        });
      },
      extractCoordinates: function(object) {
        var self = this;
        window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
                        [
                          object,
                          sc_type_arc_common | sc_type_const,
                          sc_type_link,
                          sc_type_arc_pos_const_perm,
                          MapKeynodes.get("nrel_osm_query")
                        ], {"query": 2})
        ).done(function(results) {
          window.sctpClient.get_link_content(results.get(0, "query"))
          .done((query) => {
            self.extractGeoJSON(object, query);   
          });
        });
      },
      extractGeoJSON: function(id, query) {
        MapUtils.doOSMQuery(MapUtils.getOSMQuery(query), function(data) {
          fluxify.doAction('changeObject', {id: id, geojson: osmtogeojson(data)});
        })
      },
    }
  }
}

/* --- src/map_component.js --- */
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
  if (added) MapUtils.extractor(arc).extract();
};

MapViewer.prototype.getQuestions = function() {
  return [
    "С какими персонами связано здание?",
  ]
};


SCWeb.core.ComponentManager.appendComponentInitialize(MapComponent);


