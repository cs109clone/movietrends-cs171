---------------------------------
IMDb Movie Trends
CS171 Project II
By: David DiCiurcio and Kenny Lei
---------------------------------

---------------------------------
Running the Code
---------------------------------
- To scrape data, run "python datascrape.py" in terminal.  Alternatively, you can run "datascrape.py" in a Python Shell.  "datascrape.py" requires the pattern library for web scraping.  Scraped data is outputed to "project2.csv".

- To view web visualization, open "index.html" in a web browser (e.g. Firefox, Chrome, IE).

---------------------------------
File Details
---------------------------------
"datascrape.py" - scrapes movie data between 2000 and 2012 on IMDb website.

"index.html" - imports libraries from the web or locally (e.g. D3) and dictates the placement of the web visualization elements (e.g. svg, lines, circles).  D3 is hosted externally.

"main.js" - contains all the javascript for handling drawing the svg visualization, handling dropdown changes and interactivity within the svg.

"style.css" - controls the style formatting of DOM elements.  Lines, circles, tooltips, etc. are stylized with this file.

"project2.csv" - main csv data file that contains all movie data between 2000 and 2012, scraped for several variables.  It is imported into index.html as a <textarea>.

---------------------------------
Citations
---------------------------------
Robin, Scott. "PageSlide." : A JQuery Plugin Which Slides a Webpage over to Reveal an Additional Interaction Pane. N.p., 2012. Web. 02 May 2013.

Sowin, Joshua. "Fire and Knowledge." Fire and Knowledge RSS. N.p., 22 May 2004. Web. 02 May 2013.