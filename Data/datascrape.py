import csv, re, cStringIO, codecs

from pattern.web import abs, URL, DOM, plaintext, strip_between
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

#unicode writer
class UnicodeWriter:
    """
    A CSV writer which will write rows to CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        self.writer.writerow([s.encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)

# Creating the csv output file for writing into as well as defining the writer
output = open("project2.csv", "wb")
writer = UnicodeWriter(output)

# add header row
writer.writerow(["Movie_Title", "Time", "Genre", "Directors", "Writers", "Actors","Metascore", "User_Rating","Number_of_Ratings", "Budget", "Box_Office_US", "Box_Office_World", "MPAA", "Date"])


# Get the DOM object to scrape for movie links. [Hint: Use absolute URL's.
# Documentation can be found here: http://www.clips.ua.ac.be/pages/pattern-web]

def load(year, pagenum, pagerank):
	strnum = str(year)
	url = URL("http://www.imdb.com/search/title?at=0&sort=moviemeter,asc&start="
			   +str(pagenum)+"&title_type=feature&year="+strnum+","+strnum)
	dom = DOM(url.download(timeout=30, cached=True))
	htmlsource = dom.by_id("main").by_class("results")[0].by_class("title")[pagerank].by_tag("a")[0].source
	urlpiece = re.search(r'/title/+[t0-9]+/', htmlsource)
	finalurl = "http://www.imdb.com" + urlpiece.group(0)
	url2 = URL(finalurl)
	return url2

#this handles title
def tfun(data):
	try:
		title = data.by_class("header")[0].by_tag("span")[0].content
		return title.encode('ascii', 'ignore')
	except:
		return ""

#this handles runtime and removes whitespace
def runfun(data):
	try:
		return ((((data.by_class("infobar")[0].by_tag("time")[0].content).\
				   encode('ascii', 'ignore')).strip()).split())[0]
	except:
		return ""

#this handles genres
def gfun(data):
	try:
		genres = data.by_class("infobar")[0].by_tag("a")
		if genres == []:
			return ""
		genres.pop()
		fgenres = ""
		for g in genres:
			fgenres += "; " + (g.by_tag("span")[0].content).encode('ascii', 'ignore')
		return fgenres.replace("; ", "", 1)
	except:
		return ""

#this handles directors
def dfun(data):
	try:
		direct = data.by_attribute(itemprop="director")[0].by_tag("a")[0].\
				  by_tag("span")
		fdirect = ""
		for d in direct:
			fdirect += "; " + (d.content).encode('ascii', 'ignore')
		return fdirect.replace("; ", "", 1)
	except:
		return ""

#this handles studio
"""
def sfun(data):
	try:
		studio = 
	except:
		return ""
"""

#this handles writers
def wfun(data):
	try:
		writers = data.by_attribute(itemprop="creator")[0].by_tag("a")
		fwriters = ""
		for w in writers:
			try:
				fwriters += "; " + (w.by_tag("span")[0].content).encode('ascii', 'ignore')
			except:
				pass
		return fwriters.replace("; ", "", 1)
	except:
		return ""

#this handles actors
def afun(data):
    try:
        actors = data.by_attribute(itemprop="actors")[0].by_tag("a")
    except:
        return ""
    factors = ""
    for a in actors:
        try:
            factors += "; " + (a.by_tag("span")[0].content).encode('ascii', 'ignore')
        except:
	        pass
    return factors.replace("; ", "", 1)

#this handles user ratings
def rtfun(data):
	try:
		return (data.by_class("star-box-details")[0].\
			    by_attribute(itemprop="ratingValue")[0].\
			    content).encode('ascii', 'ignore')
	except:
		return ""

#this handles # of ratings
def rtnmfun(data):
	try:
		return (data.by_class("star-box-details")[0].\
				by_attribute(itemprop="ratingCount")[0].\
		  		content).encode('ascii', 'ignore')
	except:
		return ""

#this handles metascore
def msfun(data):
	try:
		return ((data.by_class("star-box-details")[0].by_attribute(href="criticreviews?ref_=tt_ov_rt")[0].content).strip()).encode('ascii', 'ignore')
	except:
		return ""

#this handles date
def dfun(data):
	try:
		tempvar = re.search(r'See all release dates(.+?)<meta', str(data), re.DOTALL)
		tempvar = tempvar.group(0)[24:-5]
		return tempvar.encode('ascii', 'ignore')
	except:
		return ""

#this handles budget
def bfun(text):
	tempvar = re.search(r'</h5>(.+?)\(estimated\)', text, re.DOTALL)
	try:
		tempvar = tempvar.group(0)[6:-12]
		return tempvar.encode('ascii', 'ignore')
	except:
		return ""

#this handles box office revenue
def bousfun(text):
	tempvar = re.search(r'<h5>Gross</h5>(.+?)\(USA\)', text, re.DOTALL)
	try:
		tempvar = tempvar.group(0)[15:-6]
		return tempvar.encode('ascii', 'ignore')
	except:
		return ""

#this handles box office revenue international
def bowfun(text):
	tempvar = re.search(r'\$.{0,13} \(Worldwide\)', text)
	try:
		tempvar = tempvar.group(0)[0:-12]
		return tempvar.encode('ascii', 'ignore')
	except:
		return ""

#this prepares money page
def loadbus(url):
	url = URL(str(url)+"business?ref_=tt_dt_bus")
	dom = DOM(url.download(timeout=30, cached=True))
	return (dom.by_id("tn15content").content).encode('ascii', 'ignore')

#this handles MPAA
def mpaafun(data):
	try:
		tempvar = data.by_attribute(itemprop="contentRating")[1].source
		tempvar = re.search(r'"[PGNCR137-]+?"', str(tempvar))
		return ((tempvar.group(0))[1:-1]).encode('ascii', 'igore')
	except:
		return ""
	
#this handles tags

year = 2000
while year < 2011:
	pagenum = 1
	while pagenum < 101:
		pagerank = 0
		while pagerank < 50:
			url2 = load(year, pagenum, pagerank)
			dom2 = DOM(url2.download(timeout=30, cached=True))
			data = dom2.by_id("overview-top")
			text = loadbus(url2)
			print dfun(data)
#			print tfun(data)
#			print runfun(data)
#			print gfun(data)
#			print dfun(data)
#			print wfun(data)
#			print afun(data)
#			print msfun(data)
#			print rtfun(data)
#			print rtnmfun(data)
#			print bfun(text)
#			print bousfun(text)
#			print bowfun(text)
#			print mpaafun(data)
#			print "-------------------------"
#			print pagerank
#			print pagenum
#			print year
#			print "-------------------------"
			writer.writerow([tfun(data), runfun(data), gfun(data), dfun(data),
							 wfun(data), afun(data), msfun(data), rtfun(data),
							 rtnmfun(data), bfun(text), bousfun(text), 
							 bowfun(text), mpaafun(data), dfun(dom2)])
			pagerank += 1
		pagenum += 50
	year += 1


output.close()
