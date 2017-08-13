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
  generateShortestPath: function(startPoint, arrayOfWaypoints) {
    var finalPath = [startPoint];
  
    while (arrayOfWaypoints.length > 0) {
      var minDistance = Number.MAX_VALUE;
      var indexOfNearestElement = 0;

      arrayOfWaypoints.forEach(function(waypoint, index) {
        var distance = startPoint.distanceTo(waypoint);

        if (minDistance > distance) {
          minDistance = distance;
          indexOfNearestElement = index;
        }
      });

      var nextPoint = arrayOfWaypoints[indexOfNearestElement];
      finalPath.push(nextPoint);
      arrayOfWaypoints.splice(indexOfNearestElement, 1);
      startPoint = nextPoint;
    };

    return finalPath;
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
  extractor: function(arc, contour) {
    var contour = MapStore.get().contour;
    return {
      extract: function() {
        window.sctpClient.get_arc(arc)
        .done((nodes) => {
          this.checkTerrainObject(nodes[1])
          .done(() => {
            this.extractIdentifier(nodes[1]);
            this.extractDescription(nodes[1], contour);
            this.extractImage(nodes[1], contour);
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
      extractImage: function(object, contour) {
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
        ).done(function(images) {
          checkWhetherImageBelongsToContour(images);
        });

        let setImage = function (images) {
          let image = "api/link/content/?addr=" + images.get(0, "image");
            fluxify.doAction('changeObject', {id: object, image: image});
        };

        let checkWhetherImageBelongsToContour = function (images, index = 0) {
          window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F, [
                  contour,
                  sc_type_arc_pos_const_perm,
                  images.get(index, "image")
              ], {"image": 2}
            )
          )
          .done((imageFromContour) => {
            setImage(imageFromContour);
          })
          .fail(() => {
            if (images && images.results && index < images.results.length) {
              checkWhetherImageBelongsToContour(images, ++index);
            } else {
              setImage(images);
            }
          });
        };
      },
      extractDescription: function(object, contour) {
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
        ).done(function(descriptions) {
          checkWhetherDescriptionBelongsToContour(descriptions);
        });

        let setDescription = function (descriptions) {
          window.sctpClient.get_link_content(descriptions.get(0, "description"))
                .done(function (description) {
                    fluxify.doAction('changeObject', {id: object, description: description});
                });
        };

        let checkWhetherDescriptionBelongsToContour = function (descriptions, index = 0) {
          window.sctpClient.iterate_constr(
          SctpConstrIter(SctpIteratorType.SCTP_ITERATOR_3F_A_F, [
                  contour,
                  sc_type_arc_pos_const_perm,
                  descriptions.get(index, "description")
              ], {"description": 2}
            )
          )
          .done((descriptionsFromContour) => {
            setDescription(descriptionsFromContour);
          })
          .fail(() => {
            if (descriptions && descriptions.results && index < descriptions.results.length) {
              checkWhetherDescriptionBelongsToContour(descriptions, ++index);
            } else {
              setDescription(descriptions);
            }
          });
        };
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