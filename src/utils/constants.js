// src/utils/authorityHelpers.js

export const authoritiesMap = {
  electricite: [
    'SOMELEC',
    "Ministère du Pétrole, des Mines et de l'Énergie",
    "ARE (Autorité de Régulation)"
  ],
  eau: [
    'SNDE', 
    "Ministère de l'Hydraulique et de l'Assainissement"
  ],
  assainissement: [
    'SNDE', 
    'Communes (Teyarett, Ksar, Tevragh-Zeina...)',
    'Ministère de l\'Environnement'
  ],
  telecom: [
    'Mauritel',
    'Chinguitel',
    'Mattel',
    'ARE (Autorité de Régulation)'
  ],
  sante: [
    'Ministère de la Santé', 
    'CHN (Centre Hospitalier National)',
    'CNAM'
  ],
  education: [
    "Ministère de l'Éducation Nationale",
    "Ministère de l'Enseignement Supérieur",
    'Université de Nouakchott'
  ],
  transport: [
    "Ministère de l'Équipement et des Transports",
    'Nouakchott Transport',
    'Direction Générale de la Sécurité Routière'
  ],
  etat_civil: [
    "Ministère de l'Intérieur", 
    'Mairie de votre commune',
    'ANRP (Agence Nationale du Registre des Populations)'
  ],
  commerce: [
    'Ministère du Commerce', 
    'Chambre de Commerce',
    'Direction de la Concurrence'
  ],
  banques: [
    'Banque Centrale de Mauritanie (BCM)',
    "Association Professionnelle des Banques"
  ],
  urbanisme: [
    "Ministère de l'Habitat, de l'Urbanisme et de l'Aménagement du Territoire",
    "Agence de Développement Urbain"
  ],
  securite: [
    'Police Nationale',
    'Gendarmerie Nationale',
    "Ministère de l'Intérieur"
  ],
  emploi: [
    'ANAPEJ', 
    'Ministère de la Fonction Publique et du Travail'
  ],
  securite_sociale: [
    "CNAM (Caisse Nationale d'Assurance Maladie)",
    'CNSS (Caisse Nationale de Sécurité Sociale)'
  ],
  environnement: [
    "Ministère de l'Environnement et du Développement Durable",
    "Direction de l'Environnement et de l'Aménagement Côtier"
  ],
  agriculture: [
    "Ministère de l'Agriculture",
    'CSA (Commissariat à la Sécurité Alimentaire)'
  ],
  elevage: [
    "Ministère de l'Élevage", 
    "Société Nationale d'Élevage (SONADER)"
  ],
  peche: [
    "Ministère des Pêches et de l'Économie Maritime",
    "Mauritania Pêche"
  ],
  postes: [
    'Mauripost',
    'Autorité de Régulation'
  ],
  administration: [
    'Ministère de la Fonction Publique',
    'Tribunal administratif'
  ],
  autre: ['Administration générale']
};

/**
 * Récupère la liste des autorités compétentes pour une catégorie donnée.
 * @param {string} categoryKey - La clé de la catégorie (ex: 'electricite')
 * @returns {string[]} Un tableau de noms d'autorités
 */
export const getAuthorities = (categoryKey) => {
  return authoritiesMap[categoryKey] || authoritiesMap['autre'];
};