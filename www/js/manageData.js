var mapCat={};
var strSearch="";
var MarkerIcon = L.Icon.extend({//Marqueur de base d'où sont dérivés les autres marqueurs
                               options: {
                               shadowUrl: 'img/icon/ombre.png',
                               iconSize:     [66, 87],
                               shadowSize:   [41, 41],
                               iconAnchor:   [32, 86],
                               shadowAnchor: [14, 40],
                               popupAnchor:  [0, -85]                               }
                               });
var mapLatin= {"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};
//Initialisation
function initData(){
    if (!localStorage.lastUrl)
        localStorage.lastUrl="http://lestuck.eu/professionnels_du_stuck";//premier lancement
    
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
    if (localStorage.datLastUpdate){
        var datLast=new Date(localStorage.datLastUpdate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
        if ((new Date().getTime() - datLast.getTime())/86400000 > 90){
            if (!localStorage.datLastQuestion || (new Date().getTime() - new Date(localStorage.datLastQuestion).getTime())/86400000 > 30){
                localStorage.datLastQuestion=(new Date()).toISOString();
                if (confirm(tradMajQuestion.replace("%D", datLast.getDate()).replace("%M", datLast.getMonth()+1).replace("%Y",datLast.getFullYear())))
                    updateFromUrl(localStorage.lastUrl, true);
            }
        }
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
        lstSpot[iSpot].marker=L.marker([lstSpot[iSpot].latitude, lstSpot[iSpot].longitude],
                                       {icon:lstCat[iCat].icon, zIndexOffset: (iCat==1 ? 0 : 10)}).bindPopup(lstSpot[iSpot].htmlTooltip()).openPopup().addTo(map);
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
        if ($("#idImport").html().indexOf("<pre>")===0)
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
        alert(tradAdresseCopiee);
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
        strRet+=(spot.description ? spot.description.replace(/\n/g,". ") : "-")+"\n";
        strRet+=(spot.adresse ? spot.adresse : "-")+"\n";
        if (spot.email)         strRet+=spot.email+"\n";
        if (spot.telephone)     strRet+=spot.telephone+"\n";
        if (spot.site)          strRet+=spot.site+"\n";
        if (spot.facebook)      strRet+= spot.facebook+"\n";
        if (spot.observation)   strRet+=spot.observation.replace(/\n/g,". ")+"\n";
        if (spot.horaire)       strRet+=spot.horaire.replace(/\n/g,". ")+"\n";
        strRet+= spot.latitude+","+spot.longitude+"\n\n";
    }
    return strRet;
}
//Conversion de la liste des spots au format CSV
function csvLstSpot(){
    var strRet='', strCat="";
    lstSpot.sort(compareSpot);
    strRet+="Nom,Adresse,Code postal,Ville,Latitude,Longitude,EMail,Téléphone,Url,Page facebook,Domaine,Description,Défi,Horaires\n";
    for (iSpot=0;iSpot<lstSpot.length; iSpot++)    {
        spot=lstSpot[iSpot];
        strRet+= champCsv(spot.nom)+",";
        strRet+= champCsv(spot.adresse)+",,,";
        strRet+= spot.latitude+","+spot.longitude+",";
        strRet+= champCsv(spot.email)+",";
        strRet+= spot.telephone+",";
        strRet+= spot.site+",";
        strRet+= spot.facebook+",";
        strRet+= lstCat[mapCat[spot.categorie]].num+",";
        strRet+= champCsv(spot.description)+",";        
        strRet+=champCsv(spot.observation)+",";
        strRet+=champCsv(spot.horaire)+"\n";
    }
    return strRet;
}
//Transforme un contenu en champ CSV avec séparateurs si besoin
function champCsv(strContent){
    if (strContent===undefined)
        return '';
    else if (strContent.indexOf('"')>=0 || strContent.indexOf(',')>=0)
        return '"'+strContent.replace(/[""]/g,'""')+'"';
    else
        return strContent;
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
//Retourne vrai si le spot donné correspond à la recherche demandée
function isSpotSearched(spot){
    if (strSearch.length>0){
        return containsLatin(spot.nom, strSearch) || containsLatin(spot.description, strSearch)|| containsLatin(spot.observation, strSearch);
    } else
        return true;
}
//Recherche une chaîne dans une autre sans accent
function containsLatin(strContent, strSearched){
    return strContent && toLowerLatin(strContent).indexOf(toLowerLatin(strSearched))>=0;
}
//Transforme une chaîne en son équivalent en minuscule et sans accents
function toLowerLatin(str){
    return str.replace(/[^A-Za-z0-9\[\] ]/g,function(a){return mapLatin[a]||a}).toLowerCase();
}
