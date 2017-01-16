#!/usr/bin/python
# -*- coding: utf8 -*-  
import optparse 
import sys
import json
import csv
import datetime
import codecs

def toUnicode(str):
	return unicode(str.replace('"','\\"'), options.encoding)

parser = optparse.OptionParser(usage = "%prog [options] <csv file> <umap file>\n\n"
   "Conversion d'une exportation Dolibarr au format CSV des professionnels vers un fichier umap pour OpenStreetMap\n"
   u"Deux fichiers sont créés : un avec l'extension .umap pour uMap/OpenStreetMap, l'autre sans extension pour l'application smartphone\n"
   u"Les colonnes suivantes doivent être présentes : 'Nom', 'Adresse', 'Ville', 'Code postal', 'Latitude', 'Longitude', 'Email', 'Téléphone', 'Url', 'Facebook', 'Description', 'Domaine', 'Défi', 'Change'\n"
)
parser.add_option("-c", "--categories", action="store", dest="cat", help=u"Fichier javascript contenant la liste des categories (par défaut data.js dans le répertoire courant)", default="data.js")
parser.add_option("-e", "--encodage", action="store", dest="encoding", help=u"encodage du fichier à convertir", default="iso8859_15")
#parser.add_option("-o", "--output", action="store", dest="output", help="Nom du fichier de destination", default="stuck.umap")

(options, args) = parser.parse_args()

if len(args)<2: 
    parser.print_help()
    sys.exit()

fData=open(options.cat)
debut=False
CAT_CHANGE="50"
strJson=""
for line in fData:
	if debut:
		if line[0:2]=="];" :
			strJson+="]"
			break;
		else:
			strJson+=line
	elif line[0:11]=="var lstCat=" :
		strJson=""+line[11:]
		debut=True

fData.close()
#print strJson
data=json.loads(strJson)#objet json contenant la liste des objets catégorie (contenant les champs name, color, image, num, id, iconUrl)
mapCat={}#table de correspondance entre numéro de catégorie et nom de catégorie
for cat in data:
	if "num" in cat:
		mapCat[cat["num"]]=cat

#print mapCat
arrLines=[]#liste de lignes du fichier csv, chaque ligne est une liste de champs 
mapCol={}#table de correspondance entre les champs à importer et les numéros de colonne du fichier csv
bHeader=True
iLig=0
with open(args[0],'rb') as fCsv:
	reader=csv.reader(fCsv)
	for line in reader:
		iLig+=1
		if bHeader:
			bHeader=False
			iCol=0
			for colName in line:
				if "nom" in colName.lower(): mapCol["nom"]=iCol
				elif "adresse" in colName.lower(): mapCol["adr"]=iCol
				elif "postal" in colName.lower(): mapCol["post"]=iCol
				elif "ville" in colName.lower(): mapCol["ville"]=iCol
				elif "latitude" in colName.lower(): mapCol["lat"]=iCol
				elif "longitude" in colName.lower(): mapCol["long"]=iCol
				elif "email" in colName.lower(): mapCol["mail"]=iCol
				elif u"téléphone" in unicode(colName.lower(),options.encoding): mapCol["tel"]=iCol
				elif "url" in colName.lower(): mapCol["url"]=iCol
				elif "facebook" in colName.lower(): mapCol["fbook"]=iCol
				elif "domaine" in colName.lower(): mapCol["cat"]=iCol
				elif "description" in colName.lower(): mapCol["desc"]=iCol
				elif u"défi" in unicode(colName.lower(), options.encoding): mapCol["defi"]=iCol
				elif "horaire" in colName.lower(): mapCol["hor"]=iCol
				elif "change" in colName.lower(): mapCol["chg"]=iCol
				iCol+=1

			#print "colonnes : ",mapCol
		elif len(line)>0:
			arrLines.append(line)
			try: 
				strCat=line[mapCol["cat"]]
				i=int(strCat)
				if not i in mapCat: print "Erreur : le domaine de la ligne",iLig,"n'est pas dans la liste des catégories\n",line,'\n'
				if line[mapCol["chg"]]=="1":
					ligChange=line[:]#pour cloner le tableau
					ligChange[mapCol["cat"]]=CAT_CHANGE #catégorie des bureaux de change
					arrLines.append(ligChange)#dupplication de la ligne
			except:
				print "Erreur : le domaine de la ligne",iLig,"est incorrect (",strCat,"):\n",line,'\n'
			try: 
				f=float(line[mapCol["lat"]])
			except:
				print "Erreur : la latitude de la ligne",iLig,"est incorrecte :\n",line,'\n'
			try: 
				f=float(line[mapCol["long"]])
			except:
				print "Erreur : la longitude de la ligne",iLig,"est incorrecte :\n",line,'\n'

arrLines.sort(key=lambda line: (int(line[mapCol["cat"]]), line[mapCol["nom"]])) #classement par num de categorie puis nom
strOut=u'''{
  "type": "umap",
  "properties": {
    "easing": true,
    "tilelayersControl": true,
    "embedControl": true,
    "fullscreenControl": false,
    "locateControl": true,
    "searchControl": true,
    "datalayersControl": true,
    "zoomControl": true,
    "showLabel": false,
    "slideshow": {},
    "captionBar": true,
    "popupContentTemplate": "#{description}",
    "popupTemplate": "Table",
    "iconClass": "Drop",
    "limitBounds": {
      "west": null,
      "east": null,
      "north": null,
      "south": null
    },
    "tilelayer": {
      "maxZoom": 18,
      "url_template": "http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
      "minZoom": 0,
      "attribution": "Map tiles by [[http://stamen.com|Stamen Design]], under [[http://creativecommons.org/licenses/by/3.0|CC BY 3.0]]. Data by [[http://openstreetmap.org|OpenStreetMap]], under [[http://creativecommons.org/licenses/by-sa/3.0|CC BY SA]].",
      "name": "Toner"
    },
    "licence": {
      "url": "http://www.data.gouv.fr/Licence-Ouverte-Open-Licence",
      "name": "Licence ouverte/Open Licence"
    },
    "description": "",
    "name": "Professionnels du Stück",
    "onLoadPanel": "caption",
    "displayPopupFooter": true,
    "miniMap": true,
    "moreControl": true,
    "scaleControl": true,
    "scrollWheelZoom": true,
    "zoom": 10,
    "updateDate": "'''
datJ=datetime.date.today()
strOut+=datJ.strftime("%d/%m/%Y")+'''"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      7.875823974609376,
      48.49886263829421
    ]
  },
  "layers": [
'''
strOutUmap=strOut
iCat=-1
for record in arrLines:
	strAdd=""
	cat=mapCat[int(record[mapCol["cat"]])]
	if iCat != int(record[mapCol["cat"]]):#nouvelle categorie
		if iCat>=0:	#fin de la categorie precedente
			strAdd+='\n    ]\n   },\n'

		iCat=int(record[mapCol["cat"]])
		strAdd+='''
    {
      "type": "FeatureCollection",
'''
		strAdd+= u'''
      "_storage": {
        "displayOnLoad": true,
        "name": "'''+ cat["name"]+'''",
        "id": '''+ str(cat["id"])+''',
        "remoteData": {},
        "iconUrl": "'''+cat["iconUrl"]+'''",
        "color": "'''+cat["color"]+'''"
      },
      "features": [
'''
	else:#suite d'une categorie
		strAdd+='        ,\n'

	strAdd+= u'''
        {
          "type": "Feature",
          "properties": {
'''
	strAdd+=u'            "name": "'+toUnicode(record[mapCol["nom"]])+'"'
	if len(record[mapCol["desc"]])>0: strAdd+=u',\n            "Description": "'+toUnicode(record[mapCol["desc"]])+'"'
	strAdd+=u',\n            "Adresse": "'+toUnicode(record[mapCol["adr"]]+" "+record[mapCol["post"]]+" "+record[mapCol["ville"]])+'"'
	if len(record[mapCol["mail"]])>0: strAdd+=u',\n            "Email": "'+toUnicode(record[mapCol["mail"]])+'"'
	if len(record[mapCol["tel"]])>0: strAdd+=u',\n            "Téléphone": "'+toUnicode(record[mapCol["tel"]])+'"'
	if len(record[mapCol["url"]])>0:
        	strAdd+=u',\n            "Site web": "'
		if record[mapCol["url"]][0:4].lower() != "http" : strAdd+='http://' # Ajout du protocole si absent
		strAdd+=toUnicode(record[mapCol["url"]])+'"'

	if len(record[mapCol["fbook"]])>0: strAdd+=u',\n            "Page facebook": "'+toUnicode(record[mapCol["fbook"]])+'"'
	if len(record[mapCol["defi"]])>0: strAdd+=u',\n            "Défi": "'+toUnicode(record[mapCol["defi"]])+'"'
	if "hor" in mapCol and len(record[mapCol["hor"]])>0: strAdd+=u',\n            "Horaires d’ouverture": "'+toUnicode(record[mapCol["hor"]])+'"'
	strAdd+= '''
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              '''+record[mapCol["long"]]+',\n              '+record[mapCol["lat"]]+'''
	    ]
          }
        }
'''
	if record[mapCol["cat"]]==CAT_CHANGE:
		strOut+=strAdd
	else:
		strOut+=strAdd
		strOutUmap+=strAdd

strAdd=""
if iCat>=0:	#fin de la derniere categorie
	strAdd+='\n    ]\n   }\n'

strAdd+='''  ]
}
'''

strOut+=strAdd
strOutUmap+=strAdd
strUmap=args[1]

if strUmap[-5:]==".umap":
	strSpot=strUmap[:-5]
else:
	strSpot=strUmap
	strUmap+=".umap"

with codecs.open(strUmap, encoding='utf-8', mode='w') as fUmap: 
	fUmap.write(strOutUmap)


with codecs.open(strSpot, encoding='utf-8', mode='w') as fSpot: 
	fSpot.write(strOut)

