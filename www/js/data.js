//Format de la représentation texte de la liste des spots : 
//une ligne par champ, les lignes isolées sont les catégories, les lignes vides séparent les spots
//Les 3 premiers champs sont obligatoirement dans l'ordre : nom, description, adresse
var strBuild="3";
var strVersion="0.5."+strBuild;

var lstCat=[
            {"name": "Nouveau spot", "color":"#FF8000","image":"question.png","num":0,"id":28091,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Nouveau.png"},
            {"name": "Le Stück - Où s'en procurer", "color":"#a7d0ca","image":"stuck.png","num":50,"id":122863,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Stuck.png"},
            {"name": "Agriculture - producteur","color":"LawnGreen","image":"agriculture.png","num":1,"id": 120535,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Agriculture-producteur.png"},
            {"name": "Alimentation","color":"LawnGreen","image":"alimentation.png","num":2,"id": 120541,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Alimentation.png"},
            {"name": "Artisanat - métier d'art","color":"LightGoldenRodYellow","image":"art.png","num":3,"id": 120542,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Artisanat-métier-dart.png"},
            {"name": "Association","color":"Linen","image":"association.png","num":4,"id": 120543,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Association.png"},
            {"name": "Beauté - bien-être","color":"#fcc6d0","image":"beaute.png","num":5,"id": 120544,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Beauté-bien-être.png"},
            {"name": "Commerce de détail","color":"LawnGreen","image":"commerce.png","num":21,"id": 120560,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Commerce-de-détail.png"},
            {"name": "Culture","color":"LightGoldenRodYellow","image":"culture.png","num":6,"id": 120545,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Culture.png"},
            {"name": "Habillement","color":"Cyan","image":"habillement.png","num":8,"id": 120547,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Habillement.png"},
            {"name": "Habitat - bricolage - ameublement","color":"Yellow","image":"habitat.png","num":9,"id": 120548,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Habitat-bricolage-ameublement.png"},
            {"name": "Hébergement","color":"Yellow","image":"hebergement.png","num":10,"id": 120549,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Hébergement.png"},
            {"name": "Immobilier","color":"OldLace","image":"immobilier.png","num":11,"id": 120550,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Immobilier.png"},
            {"name": "Informatique - électronique","color":"OldLace","image":"informatique.png","num":12,"id": 120551,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Informatique-électronique-.png"},
            {"name": "Loisirs","color":"LightCyan","image":"loisir.png","num":13,"id": 120552,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Loisirs.png"},
            {"name": "Papeterie - reprographie","color":"Yellow","image":"papeterie.png","num":14,"id": 120553,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Papeterie-reprographie.png"},
            {"name": "Réparation - occasion","color":"DarkBlue","image":"occasion.png","num":15,"id": 120554,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Réparation-occasion.png"},
            {"name": "Restauration - bar","color":"DeepSkyBlue","image":"restaurant.png","num":16,"id": 120555,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Restauration-bar.png"},
            {"name": "Santé","color":"#fcc6d0","image":"sante.png","num":17,"id": 120556,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Santé.png"},
            {"name": "Services à la personne ou pour entreprise","color":"#fcc6d0","image":"service.png","num":18,"id": 120557,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Services-à-la-personne-ou-pour-entreprise.png"},
            {"name": "Transport","color":"LightGoldenRodYellow","image":"transport.png","num":19,"id": 120558,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Transport.png"},
            {"name": "Web - Multimédia - Communication","color":"OldLace","image":"web.png","num":20,"id": 120559,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Web-et-multimédia.png"},
            {"name": "Éducation","color":"LightGoldenRodYellow","image":"education.png","num":7,"id": 120546,"iconUrl": "http://www.lestuck.eu/wp-content/uploads/2015/09/Éducation.png"},

            {"name": "Style et textile","image":"gal/habillement.png","color": "Salmon"},
            {"name": "A table et au comptoir","image":"gal/tableComptoir.png", "color":"#1b289a"},
            {"name": "Au bonheur des papilles", "color": "#F26A5E","image":"gal/papille.png"},
            {"name": "De sérieux coups de pouce", "color": "#985077","image":"gal/proximite.png"},
            {"name": "Ensemble pour apprendre", "color": "#256A63","image":"gal/education.png"},
            {"name": "Habiles éco-mobiles","image":"gal/bicycle-24-white.png", "color": "#434C63"},
            {"name": "Indispensables dorlotages", "color": "#4C9BA9","image":"gal/dorlotage.png"},
            {"name": "Ode à la curiosité", "color": "Red","image":"gal/culture.png"},
            {"name": "Secrets de pros", "color": "#FE337F","image":"gal/services.png"},
            {"name": "Séjours douillets", "color": "#012D68","image":"gal/logement.png"},
            {"name": "Tout pour chez soi","color":"#00008b", "image":"gal/chezSoi.png"},
            {"name": "Un petit tour au marché", "color": "GoldenRod","image":"gal/marche.png"}
];
