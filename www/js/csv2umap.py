#!/usr/bin/python
# -*- coding: utf8 -*-  
import optparse 
import sys
import json
import csv
import datetime
import codecs
import re
import unidecode

def toUnicode(str):
	return unicode(str.replace('"','\\"').replace("\t",""), options.encoding)

def calcNumeroRue(strAdr):
	mat=re.match(r'([0-9]+[a-zA-Z]?)[ ,;]*(.*)', strAdr)
	if mat:
		return mat.group(1), toUnicode(mat.group(2))
	else:
		return '', toUnicode(strAdr)

def calcUserId(strNom, strId):
	return (re.sub(r'[\W]','',unidecode.unidecode(toUnicode(strNom))).lower()+"    ")[0:7].strip()+strId

def calcPassword(strUsr, strId):
	strPwd=strUsr[:-1]+str(int(strId)*2)
	while len(strPwd)<8: strPwd+='x'
	return strPwd

parser = optparse.OptionParser(usage = "%prog [options] <Dolibarr csv file> <output umap file> [<adherents csv file>]\n\n"
   "Conversion d'une exportation Dolibarr au format CSV des professionnels vers un fichier umap pour OpenStreetMap\n"
   u"Deux fichiers sont créés : un avec l'extension .umap pour uMap/OpenStreetMap, l'autre sans extension pour l'application smartphone\n"
   u"Les fichier facultatif des adhérents donne la correspondance entre les numéros d'adhérent et le nom de pro\n"
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
SEP_CYCLOS=";"
strJson=""
for line in fData:
	if debut:
		if line[0:2]=="];" :
			strJson+="]"
			break
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

mapAdh={}# table de correspondance entre les noms de pro et les numéros d'adhérent
if len(args)>2:# format du fichier adherents.csv : Identifiant,Société
	with open(args[2],'rb') as fAdh:
		reader=csv.reader(fAdh)
		for line in reader:
			if line[1] and len(line[0])==6 :#Nom de société disponible
				mapAdh[line[1]]=line[0]

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
				elif colName.lower()=="id": mapCol["id"]=iCol
				iCol+=1

			#print "colonnes : ",mapCol
		elif len(line)>0:
			try: 
				f=float(line[mapCol["lat"]])
			except:
				print "Erreur : la latitude de la ligne",iLig,"est incorrecte :\n",line,'\n'
				continue

			try: 
				f=float(line[mapCol["long"]])
			except:
				print "Erreur : la longitude de la ligne",iLig,"est incorrecte :\n",line,'\n'
				continue
			
			try: 
				strCat=line[mapCol["cat"]]
				i=int(strCat)
				if not i in mapCat: 
					print "Erreur : le domaine de la ligne",iLig,"n'est pas dans la liste des catégories\n",line,'\n'

				if line[mapCol["chg"]]=="1":
					ligChange=line[:]#pour cloner le tableau
					ligChange[mapCol["cat"]]=CAT_CHANGE #catégorie des bureaux de change
					arrLines.append(ligChange)#dupplication de la ligne
				
				arrLines.append(line)
			except:
				print "Erreur : le domaine de la ligne",iLig,"est incorrect (",strCat,"):\n",line,'\n'

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
strOutCyclos='name{0:}field.proname{0:}username{0:}address.line1{0:}address.zip{0:}address.city{0:}email{0:}field.website{0:}field.facebook{0:}field.catpro{0:}field.aboutme{0:}\
password.login.value{0:}landline.number{0:}mobile.number{0:}latitude{0:}longitude'.format(SEP_CYCLOS)
if mapAdh:
	strOutCyclos+='{0:}field.numadherent\n'.format(SEP_CYCLOS)
else :
	strOutCyclos+='\n'

iCat=-1
#Boucle sur les pros
for record in arrLines:
	strAdd=''
	objCat=mapCat[int(record[mapCol["cat"]])]
	#numero, rue=calcNumeroRue(record[mapCol["adr"]])
	strTel=record[mapCol["tel"]].replace("+33(0)","0").replace(" ","").replace(".","")
	if strTel[0:2]=="06" or strTel[0:2]=="07":
		strMobile=strTel
		strTel=''
	else: 
		strMobile=''

	strUsr=calcUserId(record[mapCol["nom"]],record[mapCol["id"]])
	strMail=record[mapCol["mail"]].strip()
	strUrl=record[mapCol["url"]]
	strFbook=toUnicode(record[mapCol["fbook"]])
	if len(strUrl)>0 and not ":" in strUrl: strUrl="http://"+strUrl
	if len(strFbook)>0 and not ":" in strFbook: strFbook="https://"+strFbook
	if not strMail: strMail="mel%d@email.com" % int(record[mapCol["id"]])

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
        "name": "'''+ objCat["name"]+'''",
        "id": '''+ str(objCat["id"])+''',
        "remoteData": {},
        "iconUrl": "'''+objCat["iconUrl"]+'''",
        "color": "'''+objCat["color"]+'''"
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
		try:
#'name,field.proname,username,address.line1,address.zip,address.city,email,field.website,field.facebook,field.catpro,field.aboutme,password.login.value,landline.number,mobile.number,latitude,longitude\n'
			#              'name,       proname,  user,      address, zip,       city,    email,     web,     facebook,  category,  description, password, tel,      mobile,   latitude, longitude'
			strOutCyclos+=u'"{1:s}"{0:}"{2:s}"{0:}{3:s}{0:}"{4:s}"{0:}{5:s}{0:}"{6:s}"{0:}{7:s}{0:}"{8:s}"{0:}"{9:s}"{0:}{10:s}{0:}"{11:s}"{0:}"{12:s}"{0:}{13:s}{0:}{14:s}{0:}{15:s}{0:}{16:s}'.format(
            SEP_CYCLOS,
			toUnicode(record[mapCol["nom"]]), toUnicode(record[mapCol["nom"]]), 
			strMail, 
			toUnicode(record[mapCol["adr"]]), #rue, numero,
			record[mapCol["post"]],
			toUnicode(record[mapCol["ville"]]),
			strMail,
			strUrl,
			strFbook,
			objCat["name"],
			toUnicode(record[mapCol["desc"]]),
#			toUnicode(record[mapCol["defi"]]),
#			1 if record[mapCol["chg"]]=="1" else 0,
			calcPassword(strUsr,record[mapCol["id"]]),
			strTel, 
            strMobile,
			record[mapCol["lat"]],
			record[mapCol["long"]] 
			)
			if mapAdh :
				if record[mapCol['nom']] in mapAdh:
					strOutCyclos+=(SEP_CYCLOS+mapAdh[record[mapCol['nom']]]+'\n')
				else:
					strOutCyclos+=SEP_CYCLOS+'9999999\n' #numAdh?
			else: 
				strOutCyclos+='\n'
		except Exception:
			print toUnicode(record[mapCol["nom"]])
			print toUnicode(record[mapCol["nom"]])
			print strMail
#			print rue, numero
			print record[mapCol["post"]]
			print toUnicode(record[mapCol["ville"]])
			print strMail
			print strUrl
			print strFbook
			print objCat["name"]
			print toUnicode(record[mapCol["desc"]])
#			print toUnicode(record[mapCol["defi"]])
#			print 1 if record[mapCol["chg"]]=="1" else 0
			print calcPassword(strUsr,record[mapCol["id"]]),
			print strTel
			print strMobile
			raise

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

if args[0]==strSpot+".csv":
	strSpot+=".out"

with codecs.open(strUmap, encoding='utf-8', mode='w') as fUmap: 
	fUmap.write(strOutUmap)

with codecs.open(strSpot, encoding='utf-8', mode='w') as fSpot: 
	fSpot.write(strOut)

with codecs.open(strSpot+".csv", encoding='utf-8', mode='w') as fCyclos: 
	fCyclos.write(strOutCyclos)
