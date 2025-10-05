// Création d'une couche vector tile
    const vectorTileLayer = new ol.layer.VectorTile({
      source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        url: 'https://data.geopf.fr/tms/1.0.0/PCI/{z}/{x}/{y}.pbf'
      })
    });
    // Appliquer le style Mapbox JSON
    olms.applyStyle(vectorTileLayer, 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/pci_style.json');




/////////////////////////////////////
// Ajour de données VECTEUR  (PLUI)//
/////////////////////////////////////
var layer_typezone = new ol.layer.Vector
({
	title: 'Type zone',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/type_zone.geojson',
		format: new ol.format.GeoJSON()
	}),
	style: styleFunction_type_zone,
	maxZoom : 13
})


var layer_zonage = new ol.layer.Vector
({
	title: 'Zonage',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/zonage.geojson',
		format: new ol.format.GeoJSON()
	}),
	style: styleFunction_zonage,
	minZoom : 13

})


var layer_prescri_surf = new ol.layer.Vector
({
	title: 'Prescriptions surfaciques',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/prescri_surf.geojson',
		format: new ol.format.GeoJSON()
	}),
  style: styleFunction_prescri_surf,
  visible: true,
  minZoom : 15
})
   
var layer_prescri_lin = new ol.layer.Vector
({
	title: 'Prescriptions linéaires',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/prescri_lin.geojson',
		format: new ol.format.GeoJSON()
	}),
  style: styleFunction_lines,
  visible: true,
  minZoom : 15
})
   
var layer_prescri_pt = new ol.layer.Vector
({
	title: 'Prescriptions ponctuelles',
	source:  new ol.source.Vector({
		url: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/prescri_pt.geojson',
		format: new ol.format.GeoJSON()
	}),
  style: styleFunction_points,
  visible: true,
  minZoom : 15
})


///////////////////////////////
// Mise en place des groupes //
///////////////////////////////

const group_layerplui= new ol.layer.Group({
		title: "Plan Local d''Urbanisme",
		fold: 'open',
		layers:[
			layer_typezone,
			layer_zonage,
			layer_prescri_surf,
			layer_prescri_lin,
			layer_prescri_pt,
		],
	})

const group_tuilleign=new ol.layer.Group({
		title: 'Habillage',
		fold: 'open',
		layers:[
			vectorTileLayer,
		],
	})

var data_group = [group_layerplui, group_tuilleign]
