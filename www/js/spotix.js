function Spot(num, name, desc, adr, mail, tel, web, fbook, obs, longi, lati, hours, cat){
    this.numero=num;
	this.nom=name;
    this.description=desc ? desc : "-";
	this.adresse=adr;
	this.email=mail;
	this.telephone=tel;
	this.site=web;
	this.facebook=fbook;
	this.observation=obs;
	this.longitude=longi;
	this.latitude=lati;
    this.categorie=cat;
    this.horaire=hours;
    //description sous forme de tableau html
    this.htmlDesc=function(){
        var strRet= "<b><u>"+this.nom+"</u></b><table><tr><th>"+tradDescription+"</th><td colspan='2'>";
        strRet+=this.description+"</td></tr><tr><th>"+tradAdresse+"</th><td colspan='2'>"
        strRet+=this.adresse+"<br> <a href='#' onclick='copyAddress("+this.numero+")'>"+tradCopierladresse+"</a></td></tr>";
        if (this.email)      strRet+="<tr><th>"+tradEmail+"</th><td colspan='2'>"+this.email+"</td></tr>";
        if (this.telephone)  strRet+="<tr><th>"+tradTelephone+"</th><td colspan='2'>"+this.telephone+"</td></tr>";
        if (this.site)       strRet+="<tr><th>"+tradSite+"</th><td colspan='2'><a href='"+this.site+"'>"+this.site+"</a></td></tr>";
        if (this.facebook)   strRet+="<tr><th>"+tradFacebook+"</th><td colspan='2'><a href='"+this.facebook+"'>"+this.facebook+"</a></td></tr>";
        if (this.horaire)    strRet+="<tr><th>"+tradHoraire+"</th><td colspan='2'>"+this.horaire.replace(/,/g,"<br>");
        if (this.observation)strRet+="<tr><th>"+tradDefi+"</th><td colspan='2'>"+this.observation+"</td></tr>";
        if (this.categorie)  strRet+="<tr><th>"+tradCategorie+"</th><td colspan='2'>"+this.categorie+"</td></tr>";
	if (localStorage.modifSpot){
		strRet+="<tr><th><a href='#' class='ui-btn' onclick='showFormNewSpot("+this.latitude+","+this.longitude+","+this.numero+")'>"+tradModifier+"</a></th>";
		strRet+="<th><a href='#' class='ui-btn' onclick='showMap("+this.latitude+","+this.longitude+")'>"+tradMontrersurlacarte+"</a></th>";
		strRet+="<th><a href='#' class='ui-btn' onclick='deleteSpot("+this.numero+")'>"+tradSupprimerCeSpot+"</a></th></tr>";
        } else {
		strRet+="<tr><th><a href='#' class='ui-btn' onclick='showDetail("+(this.numero-1)+")'>&lt;</a></th>";
		strRet+="<th><a href='#' class='ui-btn' onclick='showMap("+this.latitude+","+this.longitude+")'>"+tradMontrersurlacarte+"</a></th>";
		strRet+="<th><a href='#' class='ui-btn' onclick='showDetail("+(this.numero+1)+")'>&gt;</a></th></tr>";
	}
        return strRet+"</table>";
    }
    //contenu de la bulle sur la carte
    this.htmlTooltip=function(){
        var strRet= "<b><u>"+this.nom+"</u></b><table><tr><th>Description</th><td>"+this.description+"</td></tr><tr><th>Adresse</th><td>"+this.adresse+"</td></tr>";
        strRet+="<tr><th><a href='#' onclick='showDetail("+this.numero+")'>Détail</a></th><td></td></tr>";
        
        return strRet+"</table>";
    }
}
//Description html de la bulle d'un nouveau spot
function htmlNewSpot(latlng){
    var strRet="<b>"+tradNewSpot+"</b><table><tr><td><a class='ui-btn' href='#' onclick='showFormNewSpot("+latlng.lat+","+latlng.lng+")'>"+tradAddInList+"</a>";
    strRet+="</td><td><a class='ui-btn' href='#' onclick='removeNewSpot()'>"+tradCancel+"</a></td></tr></table>";
    return strRet;
}
//Description html du formulaire d'ajout d'un nouveau spot ou de modification d'un existant
function htmlFormNewSpot(lat, lng, numSpot){
    var strDiv  ="<div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'>";
    var strRet="<div class='ui-content'>";//<form id='idFormSpot'>";
    if (numSpot>=0) strRet+=tradName+"<br>";
    strRet+=strDiv+"<input type='text' id='idName' placeholder='"+tradName+"' value=''></div>";
    var iCat, spot=findSpotNum(numSpot);
    if (spot) iCat=mapCat[spot.categorie];
    strRet+=strDiv+tradCategorie+" : <span><img id='idIcon' height='24px' src='"+(spot? "img/icon/"+lstCat[iCat].image : "")+"' style='float:left;'>";
        
    strRet+="</span><select id='idCat' onchange='setIcon(this.value)'>";
    
    for (var iCat=0;iCat<lstCat.length; iCat++){
        strRet+="<option>"+lstCat[iCat].name+"</option>";
    }
    strRet+="</select></div>";
    if (numSpot>=0) strRet+=tradDescription+"<br>";
    strRet+="<textarea class='ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow' rows='3' cols='40' id='idDesc' placeholder='"+tradDescription+"' value=''></textarea>";
    if (numSpot>=0) strRet+=tradAdresse+"<br>";
    strRet+=strDiv+"<input type='text' id='idAddr' placeholder='"+tradAdresse+"' value=''></div>";
    if (numSpot>=0) strRet+=tradEmail+"<br>";
    strRet+=strDiv+"<input type='text' id='idMail' placeholder='"+tradEmail+"' value=''></div>";
    if (numSpot>=0) strRet+=tradTelephone+"<br>";
    strRet+=strDiv+"<input type='text' id='idTel' placeholder='"+tradTelephone+"' value=''></div>";
    if (numSpot>=0) strRet+=tradSite+"<br>";
    strRet+=strDiv+"<input type='text' id='idWeb' placeholder='"+tradSite+"' value=''></div>";
    if (numSpot>=0) strRet+=tradFacebook+"<br>";
    strRet+=strDiv+"<input type='text' id='idFbook' placeholder='"+tradFacebook+"' value=''></div>";
    if (numSpot>=0) strRet+=tradDefi+"<br>";
    strRet+="<textarea class='ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow' rows='3' cols='40' id='idObs' placeholder='"+tradDefi+"' value=''></textarea>";
    strRet+="<input hidden type='text' id='idLat' value='"+lat+"'>";
    strRet+="<input hidden type='text' id='idLong' value='"+lng+"'>";
//    strRet+="<table><tr><td><input type='submit' class='ui-btn' value='"+tradEnregistrer+"'></td>"
    strRet+="<table><tr><td><a href='#' onclick='"+(numSpot>=0 ? "saveSpot("+numSpot+")" : "createSpot()")+"' class='ui-btn'>"+tradEnregistrer+"</a></td>"
    strRet+="<td><a href='#' class='ui-btn' onclick='showMapOrList()'>"+tradCancel+"</a></td></tr></table>";
//    strRet+="</form>
    strRet+="</div>";
    return strRet;
}
//Modification de l'attribut src de l'image d'identifiant 'idIcon'
function setIcon(value){
    var iCat=mapCat[value];
    if (iCat>=0)
        $("#idIcon").attr('src','img/icon/'+lstCat[iCat].image);
}
//Remplissage des champs du formulaire d'un spot
function setSpotFields(numSpot){
    var spot=findSpotNum(numSpot);
    if (spot){
            $("#idName").val(spot.nom);
            $("#idDesc").val(spot.description);
            $("#idAddr").val(spot.adresse);
            $("#idMail").val(spot.email);
            $("#idTel").val(spot.telephone);
            $("#idWeb").val(spot.site);
            $("#idFbook").val(spot.facebook);
            $("#idObs").val(spot.observation);
            $("#idCat").val(spot.categorie);
            $("#idHours").val(spot.horaire);
    }
}
//Enregistrement des champs d'un spot depuis le formulaire Html
function saveSpot(numSpot){
    var spot=findSpotNum(numSpot);
   if ($("#idName").val().length>0)
        spot.nom=$("#idName").val();
    
    spot.description=$("#idDesc").val();
    spot.adresse= $("#idAddr").val();
    spot.email=$("#idMail").val();
    spot.telephone= $("#idTel").val();
    spot.site= $("#idWeb").val();
    spot.facebook=$("#idFbook").val();
    spot.observation= $("#idObs").val();
    spot.horaire=$("#idHours").val();
    spot.categorie=$("#idCat").val();
    map.removeLayer(spot.marker);
    spot.marker=L.marker([spot.latitude, spot.longitude],{icon:lstCat[mapCat[spot.categorie]].icon}).bindPopup(spot.htmlTooltip()).addTo(map);
    localStorage.storedLstSpot=stringLstSpot();
    showMapOrList();
}
//Creation d'un nouveau spot depuis le formulaire HTML
function createSpot(){
        if ($("#idName").val().length>0){
            var spotNew=new Spot(numSpotMax++,
                                 $("#idName").val(), $("#idDesc").val(), $("#idAddr").val(),
                                 $("#idMail").val(), $("#idTel").val(), $("#idWeb").val(),
                                 $("#idFbook").val(), $("#idObs").val(),
                                 parseFloat($("#idLong").val()), parseFloat($("#idLat").val()),
                                 $("#idHours").val(), $("#idCat").val());
            lstSpot.push( spotNew);
            removeNewSpot();
            var iCat=mapCat[spotNew.categorie];
            spotNew.marker=L.marker([spotNew.latitude, spotNew.longitude],{icon:lstCat[iCat].icon}).bindPopup(spotNew.htmlTooltip()).addTo(map);
            localStorage.storedLstSpot=stringLstSpot();
            showMap();
        }
}
//remplissage de la zone de recherche
function fillSearch(){
    var strRet="<div class='ui-input-search ui-body-inherit ui-corner-all ui-shadow-inset'>";
    
    strRet+="<input type='search' id='idSearchInput' class='ui-input-has-clear' value='"+strSearch+"'></div>";
    $("#idSearchDiv").html(strRet);
    $("#idSearchInput").on("change keyup paste search", changeSearch);
}
//remplissage du contenu de la liste des spots
function fillList(){
    var strCat;
    var iNb=0;
    var bCatSelected=false;
    var strLst="";
    for (iSpot=0;iSpot<lstSpot.length; iSpot++){
        var iCat=mapCat[lstSpot[iSpot].categorie];
        if (iCat>=0 && !lstCat[iCat].exclu){
            bCatSelected=true;
            if (isSpotSearched(lstSpot[iSpot])){
                if (!strCat || strCat!==lstSpot[iSpot].categorie){
                    strCat=lstSpot[iSpot].categorie;
                    
                    strLst+="<li data-role='list-divider' class='ui-li-divider ui-bar-a'><img height='16' src='img/icon/"+
                    lstCat[iCat].image+"' class='ui-li-icon'> "+strCat+"</li>";
                }
                strLst+="<li><a href='#' class='ui-btn ui-btn-icon-right ui-icon-carat-r' onclick='showDetail("+lstSpot[iSpot].numero+");'>"+lstSpot[iSpot].nom+"</a></li>";
                iNb+=1;
            }
        }
    }
    strLst+="<li data-role='list-divider' class=' ui-li-divider ui-bar-a '><p class='grayed'>"+iNb+" "+tradSpots;
    if (!bCatSelected) strLst+=" ("+tradAucuneCategorie+")";
    strLst+="</p></li>";
    $("#idLstSpot").html(strLst);
}
//Modification de la chaîne de recherche dans les spots
function changeSearch(){
    strSearch=$("#idSearchInput").val();
    fillList();
}
//remplissage de l'écran de la liste des catégories
function listCat(){
    var strBegin="<legend>"+tradCategories+"</legend>";
    strBegin+='<input type="checkbox" id="idCatAll" onclick="checkAllCat()" ';
    var strEnd='><label for="idCatAll">'+tradToutes+'</label>';
    var bAll=true;
    var iCat, iCat0;
    for (iCat=0;iCat<lstCat.length; iCat++){
        iCat0=(iCat+1)%lstCat.length;//astuce pour que le numéro 0 (nouveau spot) soit en fin de liste
        if (lstCat[iCat0].exist){
            strEnd+='<input type="checkbox" id="idCat'+iCat0+'" onclick="checkCat('+iCat0+')" ';
            if (lstCat[iCat0].exclu)
                bAll=false;
            else
                strEnd+="checked";
            
            strEnd+='><label for="idCat'+iCat0+'">'+lstCat[iCat0].name+'</label>';
        }
    }
    if (bAll)
        strBegin+="checked";
    
    return strBegin+strEnd;
}
//Page des réglages
function appSettings(){
    strRet ="<div class='ui-content'>";
    if (localStorage.modifSpot){
	    strRet += "<div><a href='#' class='ui-btn' onclick='copyList()'>"+tradCopierListeSpot+"</a></div>";
	    strRet += "<div><a href='#' class='ui-btn' onclick='initList(true)'>"+tradResetListSpot+"</a></div>";
	    strRet += "<div id='idImport'><a href='#' class='ui-btn' onclick='importListParse()'>"+tradImportListSpot+"</a></div>";
    }
    strRet += "<div><a href='#' class='ui-btn' onclick='updateFromUrl()'>"+tradMettreAJourDepuis
    strRet += "</a><div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input type='text' id='idUrl' placeholder='URL' value='";
    if (localStorage.lastUrl) strRet+= localStorage.lastUrl;
    strRet += "'></div>";
    if (localStorage.datLastUpdate) strRet+= "<div>("+tradDateDerniereMaj+localStorage.datLastUpdate+")</div>";
    strRet +="</div>";
    strRet +="<br>"+tradLangue+": <select onchange='localize($(this).val());showSettings();'>";
    strRet += "<option value='en' "+(language.slice(0,2)=='en'?"selected":"")+">English</option>";
    strRet += "<option value='fr' "+(language.slice(0,2)=='fr'?"selected":"")+">Français</option>";
    strRet += "</select><br/>";
    try{
        var center=map.getCenter();
        strRet += "Latitude: "+center.lat.toFixed(6)+", Longitude: "+center.lng.toFixed(6)+"<br>";
    } catch (err){}
//    strRet += "Zoom: "+map.getZoom()+"<br>";
    strRet +="</div>";
    return strRet;
}
//cochage / décochage de toutes les catégories
function checkAllCat(){
    var iCat=0;
    var bCheck=document.getElementById("idCatAll").checked;
    for (var iCat=0;iCat<lstCat.length; iCat++){
        if (lstCat[iCat].exist){
            document.getElementById("idCat"+iCat).checked=bCheck;
            lstCat[iCat].exclu=!bCheck;
        }
    }
    $("fieldset[data-role=controlgroup]").controlgroup();
    montreFiltreActif()
}
//cochage / décochage d'une catégorie
function checkCat(iCat){
    var bCheck=document.getElementById("idCat"+iCat).checked;
    lstCat[iCat].exclu = !bCheck;
    montreFiltreActif()
}
//Change l'icône du bouton filtre pour montrer si un filtre est actif (une catégorie est cachée)
function montreFiltreActif(){
    var bActif=false;
    for (var iCat=0;iCat<lstCat.length; iCat++){
        if (lstCat[iCat].exist && lstCat[iCat].exclu){
            bActif=true;
        }
    }
    if (bActif)
        $("#idFiltre").addClass("FiltreCercle");
    else
        $("#idFiltre").removeClass("FiltreCercle");
}
    
//montre ou cache les marqueurs sélectionnés sur la carte
function showOrHideMarkers(){
    for (var iSpot=0;iSpot<lstSpot.length; iSpot++){
        var iCat=mapCat[lstSpot[iSpot].categorie];
        if (iCat>=0 && lstSpot[iSpot].marker){
            if (lstCat[iCat].exclu && lstSpot[iSpot].marker.options.opacity>0){
                lstSpot[iSpot].marker.setOpacity(0);
                map.removeLayer(lstSpot[iSpot].marker);
            } else if (!lstCat[iCat].exclu && lstSpot[iSpot].marker.options.opacity==0){
                lstSpot[iSpot].marker.setOpacity(1.0);
                lstSpot[iSpot].marker.addTo(map);
            }
        }
    }
}

//Bascule vers la vue liste
function showList(){
    $("#map").hide();
    $("#idList").html('<div class="ui-content"><div id="idSearchDiv"></div><ul data-role="listview" data-inset="true" data-divider-theme="a" id="idLstSpot" class="ui-listview ui-listview-inset ui-corner-all ui-shadow ui-content"></ul></div>');
    fillSearch();
    fillList();
    $("#idList").show();
    $("#idShowMap").removeClass("ui-btn-active");
    $("#idShowList").addClass("ui-btn-active");
    $("#idFiltre").removeClass("ui-btn-active");
    $("#idSettings").removeClass("ui-btn-active");
}
//Bascule vers la vue détail
function showDetail(iSpot){
    var spot =findSpotNum(iSpot);
    if (spot){
	    $("#map").hide();
	    $("#idList").html('<div class="ui-content"><ul data-role="listview" data-inset="true" data-divider-theme="a" id="idLstSpot" class="ui-listview ui-listview-inset ui-corner-all ui-shadow"></ul></div>');
	    $("#idLstSpot").html(spot.htmlDesc());
	    $("#idList").show();
    } else 
	showList();
}
//Ajout d'un nouveau spot ou modification d'un existant
function showFormNewSpot(lat, lng, num){
    $("#map").hide();
    $("#idList").html(htmlFormNewSpot(lat, lng, num));
    if (num>=0) setSpotFields(num);
    $("#idList").show();
//    $("#idShowMap").removeClass("ui-btn-active");
//    $("#idShowList").addClass("ui-btn-active");
//    $("#idFiltre").removeClass("ui-btn-active");
//    $("#idSettings").removeClass("ui-btn-active");
}
//Bascule vers la liste des catégories
function showCat(){
    $("#map").hide();
    $("#idList").html("<div class='ui-content'><form><fieldset data-role='controlgroup' id='idListCat'></fieldset></form></div>");
    $("#idListCat").html(listCat());
    montreFiltreActif();
//    $("input[type='checkbox']").checkboxradio();
    $("fieldset[data-role=controlgroup]").controlgroup();//Pour appliquer les styles JQueryMobile aux cases à cocher
    $("#idList").show();
    $("#idShowMap").removeClass("ui-btn-active");
    $("#idShowList").removeClass("ui-btn-active");
    $("#idFiltre").addClass("ui-btn-active");
    $("#idSettings").removeClass("ui-btn-active");
}
//Bascule vers la vue carte
function showMap(lati, longi){
    showOrHideMarkers();
    $("#map").show();
    $("#idList").hide();
    $("#idShowMap").addClass("ui-btn-active");
    $("#idShowList").removeClass("ui-btn-active");
    $("#idFiltre").removeClass("ui-btn-active");
    $("#idSettings").removeClass("ui-btn-active");
    if (lati || longi)
        map.setView([lati,longi],15);
}
//Bascule vers la vue réglages
function showSettings(){
    $("#idList").html(appSettings());
    $("#map").hide();
    $("#idList").show();
    $("#idShowMap").removeClass("ui-btn-active");
    $("#idShowList").removeClass("ui-btn-active");
    $("#idFiltre").removeClass("ui-btn-active");
    $("#idSettings").addClass("ui-btn-active");
}
//Bascule vers la vue carte avec itinéraire
//function showRoute(lati, longi){
//    $("#map").show();
//    $("#idList").hide();
//    $("#idShowMap").addClass("ui-btn-active");
//    $("#idShowList").removeClass("ui-btn-active");
//    if (currentLocationCircle){
//        L.Routing.control({
//                      waypoints: [
//                                  currentLocationCircle.getLatLng(),
//                                  L.latLng(lati, longi)
//                                  ]
//                      }).addTo(map);
//    }
//}

//Positionnement au centre d'une liste de spots
function centerList(lst){
    var lati=0, longi=0, nb=0, iCat;
    for (iSpot=0;iSpot<lst.length; iSpot++)    {
        iCat=mapCat[lstSpot[iSpot].categorie];
        if (iCat>=0 && !lstCat[iCat].exclu){
            lati+=lst[iSpot].latitude;
            longi+=lst[iSpot].longitude;
            nb+=1;
        }
    }
    if (nb){
        lati/=nb;
        longi/=nb;
        var maxDist=0, dist;
        for (iSpot=0;iSpot<lst.length; iSpot++){
            iCat=mapCat[lstSpot[iSpot].categorie];
            if (iCat>=0 && !lstCat[iCat].exclu){
                dist=Math.sqrt(Math.pow(lst[iSpot].latitude-lati, 2)+Math.pow(lst[iSpot].longitude-longi, 2));
                if (maxDist<dist)
                    maxDist=dist;
            }
        }
//        console.log(maxDist);
        map.setView([lati, longi],maxDist==0 ? 18 : Math.round(5/maxDist));
    }
}
//Cherche le spot le plus proche de la position donnée et place les limites de la carte pour qu'elle soit au centre en montrant le spot le plus proche
function setMapBounds(latlng){
    var dist=0, minDist, nearestSpot;
    for (iSpot=0;iSpot<lstSpot.length; iSpot++)    {
        iCat=mapCat[lstSpot[iSpot].categorie];
        if (iCat>=0 && !lstCat[iCat].exclu){
            dist=Math.sqrt(Math.pow(lstSpot[iSpot].latitude-latlng.lat, 2)+Math.pow(lstSpot[iSpot].longitude-latlng.lng, 2));
            if (!minDist || minDist>dist){
                nearestSpot=lstSpot[iSpot];
                minDist=dist;
            }
        }
    }
    if (nearestSpot)
        map.fitBounds([[nearestSpot.latitude,nearestSpot.longitude],[2*latlng.lat-nearestSpot.latitude,2*latlng.lng-nearestSpot.longitude]]);
    else
        map.setView(latlng,16);
}
// traduit les pages dans la langue sélectionnée
function localize(lang){
    $.localise("js/trad", {language: lang});
    language=lang;
}
// Suppression d'un spot de la liste
function deleteSpot(numSpot){
    if (confirm(tradDeleteSpotConfirm))
        for (iSpot=0;iSpot<lstSpot.length; iSpot++)    {
            if (lstSpot[iSpot].numero==numSpot){
                map.removeLayer(lstSpot[iSpot].marker);
                lstSpot.splice(iSpot,1);
                localStorage.storedLstSpot=stringLstSpot();
                showMapOrList();
                break;
            }
        }
}
//Annulation de l'ajout du nouveau spot
function removeNewSpot(){
    map.removeLayer(spotNewMarker);
}
//Retourne à l'écran carte ou liste en fonction du bouton sélectionné
function showMapOrList(){
    if ($("#idShowMap").hasClass("ui-btn-active"))
        showMap(0,0);
    else
        showList();
}
//Lit la liste des spots depuis le presse-papier, l'affiche et demande confirmation avant de remplacer la liste courante
function importListParse(){
    var lst;
    try{
        cordova.plugins.clipboard.paste(function (txt){
                                        lst=parseData(txt);
                                        $('#idImport').html("<a href='#' class='ui-btn' onclick='importListSpots(true)'>"
                                                            +tradImporterSpots.replace("%d", lst.length)
                                                            +"</a><pre id='idPreLst'>"+txt+"</pre>");
                                });
    } catch(err){
        alert(err);
    }
}
//Après confirmation, remplace la liste des spots par celle du contenu préformatté venant du presse-papier
function importListSpots(bText){
    var lst = bText ? parseData($('#idPreLst').text()) : parseJson( $.parseJSON($('#idPreLst').text()) );
    if (confirm(tradImportListSpotConfirm.replace("%d", lst.length))){
        for (iSpot=0;iSpot<lstSpot.length; iSpot++)
            map.removeLayer(lstSpot[iSpot].marker);

        lstSpot=lst;
        localStorage.storedLstSpot=stringLstSpot();
        initData();
        showList()
    }
}
//Après confirmation, remplaca la liste des spots par celle téléchargée depuis une url donnée
function updateFromUrl(){
    localStorage.lastUrl=encodeURI($("#idUrl").val());
    try{
//        $.ajax({
//        url: $("#idUrl").val(),
//        dataType: "jsonp",
        $.getJSON($("#idUrl").val(), function(json){
               lst=parseJson(json);
               if (confirm(tradImportListSpotConfirm.replace("%d", lst.length))){
                  for (iSpot=0;iSpot<lstSpot.length; iSpot++)
                    map.removeLayer(lstSpot[iSpot].marker);

                  lstSpot=lst;
                  localStoreSettings(json);
                  initData();
                  showList()
               }
               }).fail(function(jq, txtStatus, err) { localStorage.modifSpot=true; alert(err);});
    } catch(err){
        alert(err);
    }
}

