// Fenêtre de présentation
window.addEventListener('load', () => {
  Swal.fire({
    title: 'Bienvenue sur la carte',
    iconColor : '#f39200',
    text: "Dans le cadre de l'enquête publique, cette carte interactive présente le projet de Plan Local d'Urbanisme intercommunal (arrêté le 28/08/2025). Cette version n'est pas définitive, un travail complémentaire sera engagé à la suite de l'enquête publique et des retours des personnes publiques associées (PPA).",
    icon: 'info',
    confirmButtonText: 'Commencer',
    
    customClass: {
      confirmButton: 'bouton_debut',
    }
  });
});

let zonagesData = null; 
const urlZonages  = "https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/info_zonage.json";

const urlGeojson = "https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/prc_zon_pt2.geojson";


const communesUrl = "https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/contours_com.geojson"; // <-- ton fichier
const communesSource = new ol.source.Vector();
const sectionUrl = "https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/DATA/contours_section.geojson"; // <-- ton fichier
const sectionSource = new ol.source.Vector();


// Promise que l'on réutilisera dans le listener
const communesLoad = fetch(communesUrl)
  .then(resp => {
    if (!resp.ok) throw new Error("Échec du chargement des communes");
    return resp.json();
  })
  .then(geojson => {
    const format = new ol.format.GeoJSON();
    const features = format.readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: view.getProjection()
    });
    communesSource.addFeatures(features);
  })
  .catch(err => {
    console.error("Erreur chargement communes:", err);
  });

  
// Promise que l'on réutilisera dans le listener
const sectionLoad = fetch(sectionUrl)
  .then(resp => {
    if (!resp.ok) throw new Error("Échec du chargement des sections");
    return resp.json();
  })
  .then(geojson => {
    const format = new ol.format.GeoJSON();
    const features = format.readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: view.getProjection()
    });
    sectionSource.addFeatures(features);
  })
  .catch(err => {
    console.error("Erreur chargement sections:", err);
  });

const selectCommune = document.getElementById("selectCommune");
const selectSection = document.getElementById("selectSection");
const selectNumero  = document.getElementById("selectNumero");
const infoBox = document.getElementById("info");

let geojsonData = null; // contiendra le jeu de données


// placemark
var placemark = new ol.Overlay.Placemark ({
  color: '#c00',
  backgroundColor : 'transparent',
  contentColor: '#000',
  autoPan: { 
    animation : {
      duration: 250 
    }
  }
});

// -------------------------------
// Initialisation de la carte AVANT tout
const view = new ol.View({
  center: ol.proj.fromLonLat([3.174880,45.686700]), // Paris par défaut
  zoom: 12
});


////////////////////////////////
// Mise en place des controls //
////////////////////////////////
var cont_zoom = new ol.control.Zoom({
	zoomInTipLabel: 'Zoomer',
	zoomOutTipLabel: 'Dézoomer',
})

var cont_echelle = new ol.control.ScaleLine({})


var cont_control_couche = new ol.control.LayerSwitcher({
  startActive: false,
  collapsed : true,
	groupSelectStyle:'group',
});


///////////////////////////
// Affichage de la carte //
///////////////////////////
var map = new ol.Map({
	target: 'map',
	layers: data_group,
  overlays: [placemark],
	controls:[
		cont_zoom,
		cont_echelle,
		cont_control_couche,
  ],
	view: view
});



var legend = new ol.legend.Legend({ 
  title: 'Légende',
  margin: 5,
  maxWidth: 300
});
var legendCtrl = new ol.control.Legend({
  legend: legend,
  collapsed: true,
  className: 'ol-legend custom-legend'
});
map.addControl(legendCtrl);



// New legend associated with a layer
var zonageLegend = new ol.legend.Legend({layer: layer_zonage });

zonageLegend.addItem(new ol.legend.Image({
  title: 'Zonage',
  src: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/IMAGES/zonage.png',
  width: 600 
}));

var presci_surfLegend = new ol.legend.Legend({layer: layer_prescri_surf });

presci_surfLegend.addItem(new ol.legend.Image({
  title: 'Prescriptions surfaciques',
  src: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/IMAGES/Prescri_surf.png',
  width: 600
}));

var presci_linLegend = new ol.legend.Legend({layer: layer_prescri_lin });

presci_linLegend.addItem(new ol.legend.Image({
  title: 'Prescriptions linéaires',
  src: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/IMAGES/Prescri_lin.png',
  width: 600
}));

var presci_ptLegend = new ol.legend.Legend({layer: layer_prescri_pt });

presci_ptLegend.addItem(new ol.legend.Image({
  title: 'Prescriptions ponctuelles',
  src: 'https://raw.githubusercontent.com/mondarverne/web_map_plui_arr1/main/IMAGES/Prescri_ponct.png',
  width: 600 
}));


legend.addItem(presci_ptLegend);
legend.addItem(presci_linLegend);
legend.addItem(presci_surfLegend);
legend.addItem(zonageLegend);



function getUniqueValues(data, field, filter = {}) {
  if (!data || !data.features) return [];
  const values = new Set();
  data.features.forEach(f => {
    const p = f.properties || {};
    let keep = true;
    for (const [k, v] of Object.entries(filter)) {
      if (p[k] !== v) { keep = false; break; }
    }
    if (keep && p[field] !== undefined && p[field] !== null) values.add(p[field]);
  });
  return Array.from(values).sort((a,b) => {
    if (typeof a === "string" && typeof b === "string") return a.localeCompare(b,"fr");
    return (a > b) ? 1 : -1;
  });
}

// helper générique pour remplir un <select>
function populateSelect(selectEl, values, placeholder = "-- Sélectionner --") {
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    selectEl.appendChild(opt);
  });
  selectEl.disabled = values.length === 0;
}

// variante : remplir le select commune avec value=code et text=nom_com
function populateSelectCommune(communesArr) {
  selectCommune.innerHTML = `<option value="">-- Sélectionner --</option>`;
  communesArr.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.code;    // on garde le code en valeur
    opt.textContent = c.name; // affichage = nom_com
    selectCommune.appendChild(opt);
  });
  selectCommune.disabled = communesArr.length === 0;
}

async function init() {
  try {
  const [respGeo, respZon] = await Promise.all([
    fetch(urlGeojson),
    fetch(urlZonages)
  ]);
  if (!respGeo.ok) throw new Error(`HTTP ${respGeo.status}`);
  if (!respZon.ok) throw new Error(`HTTP ${respZon.status}`);

  geojsonData = await respGeo.json();

  const zonagesGeoJSON = await respZon.json();
  zonagesData = zonagesGeoJSON.features.map(f => f.properties);

  const communesMap = new Map();
  geojsonData.features.forEach(f => {
    const p = f.properties || {};
    if (p.commune && p.nom_com && !communesMap.has(p.commune)) {
      communesMap.set(p.commune, p.nom_com);
    }
  });

  const communes = Array.from(communesMap.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a,b) => a.name.localeCompare(b.name, "fr"));

  populateSelectCommune(communes);

  } catch (err) {
    console.error("Erreur chargement GeoJSON :", err);
    infoBox.textContent = "Erreur lors du chargement des données.";
  }
}


selectCommune.addEventListener("change", () => {
  const codeCommune = selectCommune.value; // ici value = code
  if (codeCommune) {
    const sections = getUniqueValues(geojsonData, "section", { commune: codeCommune });
    populateSelect(selectSection, sections);
  
    communesLoad.then(() => {
      const feat = communesSource.getFeatures().find(f =>
        String(f.get("id")) === String(codeCommune)
      );

      if (feat) {
        const extent = feat.getGeometry().getExtent();
        view.fit(extent, { padding: [30, 30, 30, 30], duration: 700  }); //maxZoom: 14
      } else {
        console.warn("Commune introuvable dans le GeoJSON :", codeCommune);
      }
    }).catch(err => {
      console.error("Erreur après chargement communes:", err);
    });

  } else {
    selectSection.innerHTML = '<option value="">-- Sélectionner --</option>';
    selectSection.disabled = true;
  }
  selectNumero.innerHTML = '<option value="">-- Sélectionner --</option>';
  selectNumero.disabled = true;
  infoBox.textContent = "Sélectionnez une parcelle pour afficher son zonage.";
});

selectSection.addEventListener("change", () => {
  const codeCommune = selectCommune.value;
  const section = selectSection.value;
  if (codeCommune && section) {
    const numeros = getUniqueValues(geojsonData, "numero", { commune: codeCommune, section });
    populateSelect(selectNumero, numeros);
  
  
    sectionLoad.then(() => {
      const feat = sectionSource.getFeatures().find(f =>
        String(f.get("commune")) === String(codeCommune) &&
        String(f.get("code")) === String(section)
      );

      if (feat) {
        const extent = feat.getGeometry().getExtent();
        view.fit(extent, { padding: [5, 5, 5, 5], duration: 700  }); //maxZoom: 14
      } else {
        console.warn("Section introuvable dans le GeoJSON :", codeCommune, section);
      }
    }).catch(err => {
      console.error("Erreur après chargement:", err);
    });
  
  } else {
    selectNumero.innerHTML = '<option value="">-- Sélectionner --</option>';
    selectNumero.disabled = true;
  }
  infoBox.textContent = "Sélectionnez une parcelle pour afficher son zonage.";
});

selectNumero.addEventListener("change", () => {
  const codeCommune = selectCommune.value;
  const section = selectSection.value;
  const numero = selectNumero.value;
  
  if (codeCommune && section && numero) {
    const feat = geojsonData.features.find(f =>
      f.properties &&
      f.properties.commune === codeCommune &&
      f.properties.section === section &&
      (String(f.properties.numero) === String(numero))
    );
    if (feat) 
      {
      const p = feat.properties;

      const coords = feat.geometry.coordinates; // [lon, lat]
      const center = ol.proj.fromLonLat(coords);

      view.animate(
        { center: center, duration: 800 },
        { zoom: 20, duration: 800 },
      );
      
        placemark.show(center); 


      
      let libelle = feat.properties.libelle || "";
      const values = String(libelle).split(",").map(s => s.trim()).filter(Boolean);

      if (values.length === 0) {
        infoBox.textContent = "Aucun zonage défini pour cette parcelle.";
        return;
      }

      let html = "";
      if (values.length === 1) {
        html += `<p>Cette parcelle se trouve dans le zonage :</p>`;
      } else {
        html += `<p>Cette parcelle se trouve dans les zonages :</p>`;
      }

      html += ` <ul class="zonages-list">`;
      values.forEach(lib => {
        const z = zonagesData.find(item => item.libelle === lib);
        if (z) {
          html += `<li>- ${z.libelong}. 
      Pour consulter le règlement de ce zonage, 
      <a href="${z.lien_reglmt}" target="_blank">cliquer sur ce lien</a>.
    </li>`;
          } else {
            html += `<li>${lib} (aucune information complémentaire trouvée)</li>`;
          }
        });

          if (p.oap_url) {  
            html += `<p>Cette parcelle se trouve dans le périmètre d'une OAP sectorielle, 
              pour consulter le règlement, 
              <a href="${p.oap_url}" target="_blank">cliquer sur ce lien</a>.</p>`;
            }
            infoBox.innerHTML = html
          }
        }
});
init();