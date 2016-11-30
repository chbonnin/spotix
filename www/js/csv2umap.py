#!/usr/bin/python
# coding: utf8 
import optparse 
import sys
import json
import csv
import datetime
import codecs

def toUnicode(str):
	return unicode(str.replace('"','\\"'), "utf8")

parser = optparse.OptionParser(usage = "%prog [options] <csv file> <umap file>\n\n"
   "Conversion d'une exportation Dolibarr au format CSV des professionnels vers un fichier umap pour OpenStreetMap\n"
   "L'ordre des colonnes doit etre le suivant : 'Nom', 'Adresse', 'Ville', 'Code postal', 'Latitude', 'Longitude', 'Email', 'Telephone', 'Url', 'Page Facebook', 'Description', 'Domaine', '', '', 'Defi'\n"
)
parser.add_option("-c", "--categories", action="store", dest="cat", help="Fichier javascript contenant la liste des categories", default="data.js")
#parser.add_option("-o", "--output", action="store", dest="output", help="Nom du fichier de destination", default="stuck.umap")

(options, args) = parser.parse_args()

if len(args)<2: 
    parser.print_help()
    sys.exit()

fData=open(options.cat)
debut=False
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
data=json.loads(strJson)
mapCat={}
for cat in data:
	if "num" in cat:
		mapCat[cat["num"]]=cat

#print mapCat
arrLines=[]
bHeader=True
iLig=0
with open(args[0],'rb') as fCsv:
	reader=csv.reader(fCsv)
	for line in reader:
		iLig+=1
		if bHeader:
			bHeader=False
		else:
			arrLines.append(line)
			try: 
				i=int(line[11])
				if not i in mapCat: print "Erreur : le domaine de la ligne",iLig,"n'est pas dans la liste des catégories\n",line,'\n'
			except:
				print "Erreur : le domaine de la ligne",iLig,"est incorrect :\n",line,'\n'
			try: 
				f=float(line[4])
			except:
				print "Erreur : la latitude de la ligne",iLig,"est incorrecte :\n",line,'\n'
			try: 
				f=float(line[5])
			except:
				print "Erreur : la longitude de la ligne",iLig,"est incorrecte :\n",line,'\n'

arrLines.sort(key=lambda line: (int(line[11]), line[0]))
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
strOut+=datJ.strftime("%d %B %Y")+'''"
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
iCat=-1
for record in arrLines:
	cat=mapCat[int(record[11])]
	if iCat != int(record[11]):#nouvelle categorie
		if iCat>=0:	#fin de la categorie precedente
			strOut+='\n    ]\n   },\n'

		iCat=int(record[11])
		strOut+='''
    {
      "type": "FeatureCollection",
'''
		strOut+= u'''
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
		strOut+='        ,\n'

	strOut+= u'''
        {
          "type": "Feature",
          "properties": {
'''
	strOut+=u'            "name": "'+toUnicode(record[0])+'"'
	if len(record[10])>0: strOut+=u',\n            "Description": "'+toUnicode(record[10])+'"'
	strOut+=u',\n            "Adresse": "'+toUnicode(record[1]+" "+record[3]+" "+record[2])+'"'
	if len(record[6])>0: strOut+=u',\n            "Email": "'+toUnicode(record[6])+'"'
	if len(record[7])>0: strOut+=u',\n            "Téléphone": "'+toUnicode(record[7])+'"'
	if len(record[8])>0: strOut+=u',\n            "Site web": "'+toUnicode(record[8])+'"'
	if len(record[9])>0: strOut+=u',\n            "Page facebook": "'+toUnicode(record[9])+'"'
	if len(record[14])>0: strOut+=u',\n            "Défi": "'+toUnicode(record[14])+'"'
	strOut+= '''
          },
          "geometry": {
            "type": "Point",
            "coordinates": ['''+record[5]+', '+record[4]+''']
          }
        }
'''

if iCat>=0:	#fin de la derniere categorie
	strOut+='\n    ]\n   }\n'

strOut+='''  ]
}
'''

with codecs.open(args[1], encoding='utf-8', mode='w') as fUmap: 
	fUmap.write(strOut)




