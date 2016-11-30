var mapCat={};

var MarkerIcon = L.Icon.extend({//Marqueur de base d'où sont dérivés les autres marqueurs
                               options: {
                               shadowUrl: 'img/icon/ombre.png',
                               iconSize:     [66, 87],
                               shadowSize:   [41, 41],
                               iconAnchor:   [32, 86],
                               shadowAnchor: [14, 40],
                               popupAnchor:  [0, -85]
                               }
                               });

//Initialisation
function initData(){
    if (!localStorage.storedLstSpot){//premier lancement ou après une réinitialisation
        lstSpot=[];
        $.getJSON("stuck.umap", function(json){//données umap
                  lstSpot=parseJson(json);
		  localStoreSettings(json);
                  initMarkers();
              });
//        if (lstSpot.length==0){//données texte
//            lstSpot=parseData(stuckData);
//            localStorage.storedLstSpot=stuckData;
//        }
    } else {//données stockées
        lstSpot=parseData(localStorage.storedLstSpot);
        initMarkers();
    }
}

//Initialisation des icones des catégories et des marqueurs
function initMarkers(){
    numSpotMax=lstSpot.length;
    for (var iCat=0; iCat< lstCat.length; iCat++){
        lstCat[iCat].icon=new MarkerIcon({iconUrl:"img/icon/"+lstCat[iCat].image});
        mapCat[lstCat[iCat].name]=iCat;
	lstCat[iCat].exist=false;
    }
    for (iSpot=0;iSpot<lstSpot.length; iSpot++){
        var iCat=mapCat[lstSpot[iSpot].categorie];
	
        if (iCat===undefined){
            alert("Catégorie inconnue : " + lstSpot[iSpot].categorie);
            break;
        }
	lstCat[iCat].exist=true;
        lstSpot[iSpot].marker=L.marker([lstSpot[iSpot].latitude, lstSpot[iSpot].longitude],{icon:lstCat[iCat].icon}).bindPopup(lstSpot[iSpot].htmlTooltip()).openPopup().addTo(map);
    }
}
//Réinitialisation de la liste des spots
function initList(bAsk){
    if (!bAsk || confirm(tradResetListSpotConfirm)){
        localStorage.storedLstSpot="";
        for (iSpot=0;iSpot<lstSpot.length; iSpot++)
            map.removeLayer(lstSpot[iSpot].marker);
        
        initData();
    }
}
//Copie la liste des spots au format texte dans le presse-papier
function copyList(){
    try{
        if ($("#idImport").html().startsWith("<pre>"))
            $("#idImport").html("<pre>"+csvLstSpot()+"</pre>");
        else{
            cordova.plugins.clipboard.copy(stringLstSpot());
            alert(tradListeCopiee);
        }
    } catch(err){
        $('#idImport').html("<pre>"+stringLstSpot()+"</pre>");
        alert(err);
    }
}

//Copie l'adresse d'un spot dans le presse-papier (pour la coller dans une app d'itinéraire)
function copyAddress(iSpot){
    try{
        cordova.plugins.clipboard.copy(findSpotNum(iSpot).adresse);
    } catch(err){
        alert(err.message);
    }
}

//Lecture de la liste des spots depuis un contenu texte
function parseData(strData){
    var strLig, strPrevious, strCat;
    var strNom, strDesc, strAdr, strMail, strTel, strWeb, strFbook, strObs, fLong, fLat, strHoraire, strCat;
    var lstRet=[];
    var numLig=0, iLig, numSpot=0;
    var patMail=/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    var patWeb=/https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
    var patTel=/^[^-0-9()+. ,/]*([-0-9()+. ]+)$/;
    var patFBook=/https:\/\/www\.facebook\.com.*/;
    var patCoord=/^([-+0-9.]+)[,/]([-+0-9.]+)$/;
    var patHoraire=/lundi.*mardi.*mercredi.*jeudi.*vendredi.*/i;
    
    arrLig=strData.split("\n");
    for (iLig=0; iLig<arrLig.length; iLig++){
        strLig=arrLig[iLig].trim();
        if (strLig.length==0){
            if (numLig==1){
                strCat=strNom;
            } else if (numLig>2)
                lstRet.push(new Spot(numSpot++, strNom, strDesc, strAdr, strMail, strTel, strWeb, strFbook, strObs, fLong, fLat, strHoraire, strCat));
            
            numLig=0;
            strNom=strDesc=strAdr=strMail=strTel=strWeb=strFbook=strObs=strHoraire="";
            fLong=fLat=0.0;
        } else {
            if (numLig==0)
                strNom=strLig;
            else if (numLig==1)
                strDesc=strLig;
            else if (numLig==2)
                strAdr=strLig;
            else if (patMail.test(strLig) && !strMail)
                strMail=patMail.exec(strLig);
            else if (patFBook.test(strLig))
                strFbook=patFBook.exec(strLig);
            else if (patWeb.test(strLig))
                strWeb=patWeb.exec(strLig);
            else if (patTel.test(strLig))
                strTel=patTel.exec(strLig)[1];
            else if (patHoraire.test(strLig))
                strHoraire=strLig;
            else if (patCoord.test(strLig)){
                var match=patCoord.exec(strLig);
                fLat=parseFloat(match[1]);
                fLong=parseFloat(match[2]);
            } else
                strObs=strLig;
            
            
            strPrevious=strLig;
            numLig++;
        }
    }
    return lstRet;
}
//Lecture de la liste des spots depuis un objet JSON
function parseJson(json){
    var lst=[], numSpot=0;
    for (var iLay=0; iLay<json.layers.length; iLay++){
        if (json.layers[iLay].features.length>0){
            var strCat=json.layers[iLay]._storage.name;
            var lstFeatures=json.layers[iLay].features;
            for (var iFeat=0; iFeat<lstFeatures.length; iFeat++){
                var feat=lstFeatures[iFeat];
		if (feat.properties.name){
		    if (feat.properties.Adresse)//format Stuck
	                lst.push(new Spot(numSpot++, feat.properties.name, feat.properties.Description, feat.properties.Adresse, feat.properties.Email,
                                  feat.properties["Téléphone"], feat.properties["Site web"], feat.properties["Page facebook"], feat.properties["Défi"],
                                  feat.geometry.coordinates[0], feat.geometry.coordinates[1], feat.properties["Horaires d’ouverture"], strCat));
		    else //format Galleco
	                lst.push(new Spot(numSpot++, feat.properties.name, feat.properties.Description, feat.properties.address1+" "+feat.properties.zip+" "+feat.properties.city, 
				feat.properties.email, feat.properties["Téléphone"], feat.properties.website, feat.properties["Page facebook"], feat.properties["Défi"],
				feat.geometry.coordinates[0], feat.geometry.coordinates[1], feat.properties["Horaires d’ouverture"], strCat));
		}
            }
        }
    }
    return lst;
}

//Calcul du zoom en fonction de la distance au spot le plus proche de la position courante
function calcMaxZoom(latLng){
    var dist=0, minDist;
    for (iSpot=0;iSpot<lstSpot.length; iSpot++)    {
        iCat=mapCat[lstSpot[iSpot].categorie];
        if (iCat>=0 && !lstCat[iCat].exclu){
            dist=Math.sqrt(Math.pow(lstSpot[iSpot].latitude-latLng.lat, 2)+Math.pow(lstSpot[iSpot].longitude-latLng.lng, 2));
            if (!minDist || minDist>dist)
                minDist=dist;
        }
    }
    if (minDist && Math.round(5/minDist)<16)
        return Math.round(5/minDist);
    else
        return 16;
}

//Comparaison de deux spots pour les classer par catégorie puis par nom
function compareSpot(un, autre){
    if (un.categorie.localeCompare(autre.categorie) != 0)
        return un.categorie.localeCompare(autre.categorie);
    else if (un.numero == autre.numero)
        return Math.sign(un.numero - autre.numero);
    else
        return 0;
}

//Conversion de la liste des spots en texte
function stringLstSpot(){
    var strRet="", strCat="";
    lstSpot.sort(compareSpot);
    for (iSpot=0;iSpot<lstSpot.length; iSpot++)    {
        spot=lstSpot[iSpot];
        if (spot.categorie != strCat){
            strRet+=spot.categorie+"\n\n";
            strCat=spot.categorie;
        }
        strRet+= spot.nom+"\n";
        strRet+=(spot.description ? spot.description : "-")+"\n";
        strRet+=(spot.adresse ? spot.adresse : "-")+"\n";
        if (spot.email)         strRet+=spot.email+"\n";
        if (spot.telephone)     strRet+=spot.telephone+"\n";
        if (spot.site)          strRet+=spot.site+"\n";
        if (spot.facebook)      strRet+= spot.facebook+"\n";
        if (spot.observation)   strRet+=spot.observation+"\n";
        if (spot.horaire)       strRet+=spot.horaire+"\n";
        strRet+= spot.latitude+","+spot.longitude+"\n\n";
    }
    return strRet;
}
//Conversion de la liste des spots au format CSV
function csvLstSpot(){
    var strRet='', strCat="";
    lstSpot.sort(compareSpot);
    for (iSpot=0;iSpot<lstSpot.length; iSpot++)    {
        spot=lstSpot[iSpot];
        if (spot.categorie != strCat){
            strRet+=spot.categorie+"\n\n";
            strCat=spot.categorie;
        }
        strRet+= spot.nom+"\n";
        strRet+=(spot.description ? spot.description : "-")+"\n";
        strRet+=(spot.adresse ? spot.adresse : "-")+"\n";
        if (spot.email)         strRet+=spot.email+"\n";
        if (spot.telephone)     strRet+=spot.telephone+"\n";
        if (spot.site)          strRet+=spot.site+"\n";
        if (spot.facebook)      strRet+= spot.facebook+"\n";
        if (spot.observation)   strRet+=spot.observation+"\n";
        if (spot.horaire)       strRet+=spot.horaire+"\n";
        strRet+= spot.latitude+","+spot.longitude+"\n\n";
    }
    return strRet;
}
//Trouve le spot de la liste correspondant à un numéro donné
function findSpotNum(numSpot){
    for (iSpot=0;iSpot<lstSpot.length; iSpot++)    {
        if (lstSpot[iSpot].numero==numSpot){
            return lstSpot[iSpot];
        }
    }
    return null;
}
//Enregistre les réglages courants (spots, date, flags) dans le stockage local
function localStoreSettings(json){
                  localStorage.storedLstSpot=stringLstSpot();
		  localStorage.datLastUpdate=json.properties.updateDate;
		  localStorage.modifSpot=(json.properties.modifSpot ? true : "");
}
