////////////////////////////////////////////
////// JS pour les styles des données //////
////////////////////////////////////////////


//// Style pour la couche zonage ////
const styleRules_zonage = [
  { label: 'Uc, Uh', condition: f => ['Uc', 'Uh'].includes(f.get('libelle')), fill: '#f7f7f7', stroke: '#000000', strokeWidth: 1.5 },
  { label: 'Ue', condition: f => f.get('libelle') === 'Ue', fill: '#c8dbf178', stroke: '#bbdbef', strokeWidth: 0.5 },
  { label: 'Us*', condition: f => f.get('libelle')?.startsWith('Us'), fill: '#e0dedfe7', stroke: '#232323ff', strokeWidth: 0.5 },
  { label: 'Ui*', condition: f => f.get('libelle')?.startsWith('Ui'), fill: '#ffffff', stroke: '#ea5a0d', strokeWidth: 2, lineDash: [4,6] },
  { label: 'Um*', condition: f => f.get('libelle')?.startsWith('Um'), fill: '#f4ddff', stroke: '#c816f4', strokeWidth: 2, lineDash: [4,6] },
  { label: 'Ut, Ut-p', condition: f => ['Ut','Ut-p'].includes(f.get('libelle')), fill: '#ff7903a3', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Ur', condition: f => f.get('libelle') === 'Ur', fill: '#f276f978', stroke: '#e478f2', strokeWidth: 0.5 },
  { label: 'Ug', condition: f => f.get('libelle') === 'Ug', fill: '#ffffff', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'AU sauf 2AU', condition: f => f.get('typezone') === 'AU' && f.get('libelle') !== '2AU', fill: '#f1585af8', stroke: '#000000', strokeWidth: 0.5 },
  { label: '2AU', condition: f => f.get('typezone') === 'AU' && f.get('libelle') === '2AU', fill: '#f06568d3', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Ac', condition: f => f.get('libelle') === 'Ac', fill: '#fcca5eff', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Aa-*', condition: f => f.get('libelle')?.startsWith('Aa-'), fill: '#ffe1d9', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Ar', condition: f => f.get('libelle') === 'Ar', fill: '#ffedab9c', stroke: '#ff8d29', strokeWidth: 2, lineDash: [4,6] },
  { label: 'A sauf Ac, Ar, Aa-*', condition: f => f.get('typezone') === 'A' && !['Ac','Ar'].includes(f.get('libelle')) && !(f.get('libelle')?.startsWith('Aa-')), fill: '#fff6c1ff', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'N', condition: f => f.get('libelle') === 'N', fill: '#96e082a7', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nh*', condition: f => f.get('libelle')?.startsWith('Nh'), fill: '#bffb7f', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nc', condition: f => f.get('libelle') === 'Nc', fill: '#90fbcbb1', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nj', condition: f => f.get('libelle') === 'Nj', fill: '#84ea999c', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nl*', condition: f => f.get('libelle')?.startsWith('Nl'), fill: '#75eaa7', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Nt', condition: f => f.get('libelle') === 'Nt', fill: '#adffb89c', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'Np', condition: f => f.get('libelle') === 'Np', fill: '#38b92192', stroke: '#000000', strokeWidth: 0.5 },
];



// === Fonction de style ===
// Fonction pour convertir un zoom en résolution
const resolutionForZoom = (zoom) => {
  const baseResolution = 156543.03392804097; // EPSG:3857, taille tuile = 256px
  return baseResolution / Math.pow(2, zoom);
};

const styleFunction_zonage = (feature, resolution) => {
  let rule = styleRules_zonage.find(r => r.condition(feature));
  if (!rule) {
    rule = { fill: 'rgba(0,0,255,0.5)', stroke: '#000000', strokeWidth: 0.5 };
  }
  // paramètre de zoom minimal pour les labels
  var minZoomLabels = 15;
  var minResolutionLabels = resolutionForZoom(minZoomLabels);

  // Style polygone (toujours affiché)
  const style = new ol.style.Style({
    fill: new ol.style.Fill({ color: rule.fill }),
    stroke: new ol.style.Stroke({
      color: rule.stroke,
      width: rule.strokeWidth,
      lineDash: rule.lineDash
    })
  });

  // On ajoute le texte SEULEMENT si on est assez zoomé
  if (resolution < minResolutionLabels) {
    style.setText(new ol.style.Text({
      font: '13px Calibri,bold',
      text: feature.get("libelle") || '',
      fill: new ol.style.Fill({ color: '#000000' }),
      stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 }), // halo
      overflow: true,
      placement: 'point',
      textAlign: 'center'
    }));
  }
  return style;
};

const styleRules_type_zone = [
  { label: 'U', condition: f => f.get('typezone') === 'U', fill: '#ffffff', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'AU', condition: f => f.get('typezone') === 'AU', fill: '#f1585af8', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'A', condition: f => f.get('typezone') === 'A', fill: '#fff6c1ff', stroke: '#000000', strokeWidth: 0.5 },
  { label: 'N', condition: f => f.get('typezone') === 'N', fill: '#38b92192', stroke: '#000000', strokeWidth: 0.5 },
];


// === Fonction de style ===
const styleFunction_type_zone = (feature) => {
  let rule = styleRules_type_zone.find(r => r.condition(feature));
  if (!rule) {
    rule = { fill: 'rgba(0,0,255,0.5)', stroke: '#000000', strokeWidth: 0.5 };
  }
  return new ol.style.Style({
    fill: new ol.style.Fill({ color: rule.fill }),
    stroke: new ol.style.Stroke({
      color: rule.stroke,
      width: rule.strokeWidth,
      lineDash: rule.lineDash
    })
  });
};


//// Style pour la couche des prescriptions surfaciques ////    
// === Table des règles ===
const styleRules_prescri_surf = [
  {
    label: 'Espaces boisés classés',
    condition: f => f.get('libelle') === 'Espaces boisés classés',
    style: () => [
      new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#004d1f', width: 1 }),
        fill: new ol.style.FillPattern({
          pattern: 'cross',
          size: 0.8,
          color: '#004d1fff',
          background: 'rgba(255,255,255,0)',
          scale: 1.5,
          spacing: 7
        })
      }),
      new ol.style.Style({
        fill: new ol.style.FillPattern({
          pattern: 'circle',
          size: 7,
          color: '#004d1fff',
          background: 'rgba(255,255,255,0)',
          scale: 1,
          spacing: 10,
          offset: 1
        })
      })
    ]
  },
  {
    label: 'ER -%',
    condition: f => f.get('libelle')?.startsWith('ER -'),
    stroke: '#d33283',
    strokeWidth: 0.5,
    fillPattern: {
      pattern: 'cross',
      color: '#d33283',
      background: '#ffffff',
      size: 0.3,
      scale: 2,
      spacing: 2,
      angle: 1
    }
  },
  {
    label: 'ERMS -%',
    condition: f => f.get('libelle')?.startsWith('ERMS -'),
    stroke: '#487ebc',
    strokeWidth: 0.5,
    fillPattern: {
      pattern: 'cross',
      color: '#487ebc',
      background: '#ffffff',
      size: 0.3,
      scale: 2,
      spacing: 2,
      angle: 1
    }
  },
  {
    label: 'Zone non aedificandi',
    condition: f => f.get('libelle')?.startsWith('Zone non aedificandi'),
    stroke: '#2d93e7ff',
    strokeWidth: 0.5,
    fill: { color: '#5aa7e74c' }
  },
    {
    label: 'Bâtiment pouvant changer de destination',
    condition: f => f.get('libelle')?.startsWith('bati_chang_desti'),
    stroke: '#a909da',
    fill: { color: '#a909da' }
  },
  {
    label: 'STECAL',
    condition: f => f.get('libelle')?.startsWith('STECAL'),
    stroke: '#e41417',
    strokeWidth: 1.3
  },
  {
    label: 'UTN',
    condition: f => f.get('libelle')?.startsWith('UTN'),
    stroke: '#e4910d',
    strokeWidth: 1.3
  },
  {
    label: 'OAP',
    condition: f => f.get('libelle') === 'OAP',
    stroke: '#376bef',
    strokeWidth: 2
  },
  {
    label: 'OAP-PAPAG / PAPAG',
    condition: f => ['OAP-PAPAG', 'PAPAG'].includes(f.get('libelle')),
    stroke: '#376bef',
    strokeWidth: 2,
    lineDash: [4,6]
  },
  {
    label: 'Terres d’intérêt viticoles',
    condition: f => f.get('libelle') === 'Terres d intérêt viticoles',
    stroke: '#881059',
    strokeWidth: 0.5,
    fillPattern: {
      pattern: 'hatch',
      color: '#881059',
      background: '#ffffff01',
      size: 0.3,
      spacing: 5,
      angle: 45,
      scale: 2
    }
  },
  {
    label: 'Patrimoine végétal et paysagé',
    condition: f => f.get('libelle') === 'Patrimoine végétal et paysagé',
    stroke: '#004b00',
    strokeWidth: 0.5,
    fillPattern: { pattern: 'flooded', color: '#004b00' }
  },
  {
    label: 'zones humides',
    condition: f => f.get('libelle') === 'zones humides',
    stroke: '#4a88f3ff',
    strokeWidth: 0.5,
    fillPattern: { pattern: 'circle', color: '#4a88f3ff', size: 4 }
  },
  {
    label: 'Pelouse sèche',
    condition: f => f.get('libelle') === 'Pelouse sèche',
    stroke: '#d0bb00ff',
    strokeWidth: 0.5,
    fillPattern: { pattern: 'vine', color: '#d0bb00', size: 4 }
  },
  {
    label: 'Protection plan d’eau - 300m',
    condition: f => f.get('libelle') === 'Protection plan d eau - 300m',
    stroke: '#137db7ff',
    strokeWidth: 0.5,
    lineDash: [4, 6],
    fillPattern: {
      pattern: 'dot',
      color: '#137db7ff',
      size: 1.5,
      spacing: 3
    }
  },
  {
    label: 'Bois et bosquet',
    condition: f => f.get('libelle') === 'Bois et bosquet',
    stroke: '#030503ff',
    strokeWidth: 0.5,
    fillPattern: { pattern: 'circle', color: '#114611c4', size: 4 }
  }
];


// Fonction de style prescri_surf
const styleFunction_prescri_surf = (feature, resolution) => {
  let rule = styleRules_prescri_surf.find(r => r.condition(feature));

  // paramètre de zoom minimal pour les labels
  const minZoomLabels = 18;
  const minResolutionLabels = resolutionForZoom(minZoomLabels);

  // Cas particulier où rule.style est défini (ex: "Espaces boisés classés")
  if (rule?.style) return rule.style();

  if (!rule) {
    // Style par défaut
    rule = {
      stroke: '#000000ff',
      strokeWidth: 0.5,
      fillPattern: {
        pattern: 'hatch',
        color: 'rgba(119, 216, 81, 0.5)',
        background: '#ffffff01',
        size: 1,
        scale: 1,
        spacing: 10,
        angle: 0
      }
    };
  }

  // Création du style de base
  const style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: rule.stroke,
      width: rule.strokeWidth,
      lineDash: rule.lineDash
    }),
    fill: rule.fill
      ? new ol.style.Fill(rule.fill)
      : rule.fillPattern
      ? new ol.style.FillPattern(rule.fillPattern)
      : undefined
  });

  // Ajout du texte SEULEMENT si on est assez zoomé
  if (resolution < minResolutionLabels) {
    style.setText(new ol.style.Text({
      font: '12px Calibri,bold',
      text: feature.get("num_avril") || '',   // <- champ NUMERO ici
      fill: new ol.style.Fill({ color: '#d33283'}),
      stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 }), // halo blanc
      overflow: true,
      placement: 'point',
      textAlign: 'center'
    }));
  }

  return style;
};

//// Style pour la couche des prescriptions lineaires ////    
// === Table des règles pour les lignes ===
const styleRules_lines = [
  {
    condition: f => f.get('libelle') === 'Haie',
    customStyle: () => [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#2b9a18', // vert forêt
          width: 1.5
        })
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#2b9a18',
          width: 3.5,
          lineDash: [1, 16] // "points" espacés
        })
      })
    ]
  },
  {
    label: 'Linéaire commercial',
    condition: f => f.get('libelle') === 'Linéaire commercial protégé',
    stroke: '#ff7f3f',
    strokeWidth: 3
  }
];


// === Fonction de style ===
const styleFunction_lines = (feature) => {
  const rule = styleRules_lines.find(r => r.condition(feature));
  if (rule) {
    if (rule.customStyle) {
      return rule.customStyle(feature);
    }

    // Sinon on applique un style standard
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: rule.stroke,
        width: rule.strokeWidth,
        lineDash: rule.lineDash || undefined
      })
    });
  }

  // Style par défaut
  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'gray',
      width: 1
    })
  });
};


//// Style pour la couche des prescriptions ponctuelles ////    
// === Table des règles ===
const styleRules_points = [
  {
    label: 'Arbre remarquable',
    condition: f => f.get('libelle') === 'Patrimoine végétal',
    style: () => new ol.style.Style({
      image: new ol.style.RegularShape({
        points: 3, // triangle
        radius: 6,
        fill: new ol.style.Fill({ color: '#00c400' }),
        stroke: new ol.style.Stroke({ color: '#000', width: 0.5 }),
        rotation: 45
      })
    })
  },
  {
    label: 'Bâtiment récent',
    condition: f => f.get('libelle') === 'Bâtiment récent',
    style: () => new ol.style.Style({
      image: new ol.style.RegularShape({
        points: 5,  // étoile
        radius: 6, // rayon externe
        radius2: 2.5, // rayon interne → sinon pentagone
        fill: new ol.style.Fill({ color: '#cc0bf3' }),
        stroke: new ol.style.Stroke({ color: '#000', width: 0.5 })
      })
    })
  },
  {
    label: 'Petit patrimoine local (L 151 19)',
    condition: f => !['Bâtiment récent', 'Patrimoine végétale'].includes(f.get('libelle')),
    style: () => new ol.style.Style({
      image: new ol.style.RegularShape({
        points: 4, // carré
        radius: 5,
        angle: 0,
        fill: new ol.style.Fill({ color: '#ff6505' }),
        stroke: new ol.style.Stroke({ color: '#000', width: 0.5 })
      })
    })
  }
];

// === Fonction de style ===
const styleFunction_points = (feature) => {
  const rule = styleRules_points.find(r => r.condition(feature));
  if (rule) return rule.style();

  // Style par défaut si aucune règle trouvée
  return new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({ color: 'gray' }),
      stroke: new ol.style.Stroke({ color: '#000', width: 1 })
    })
  });
};
