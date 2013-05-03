---------------------------------
IMDb Movie Trends
CS171 Project III
By: David DiCiurcio and Kenny Lei
---------------------------------

---------------------------------
Running the Code
---------------------------------
- To scrape data, run "python datascrape.py" in terminal.  Alternatively, you can run "datascrape.py" in a Python Shell.  "datascrape.py" requires the pattern library for web scraping. Scraped data is outputed to "project2.csv". Range of years scraped can be changed at the end of "datascrape.py" file

- To view web visualization, open "index.html" in a web browser (e.g. Firefox, Chrome, IE).  Sidebar can be accessed by clicking on a movie data point or "toolbar" link.

---------------------------------
File Details
---------------------------------
"datascrape.py" - scrapes movie data from 1970's until now on IMDb website.

"datascrape2.py" - scrapes only movie data that contains complete data, excludes a lot of movies however.

"index.html" - imports libraries from the web or locally (e.g. D3) and dictates the placement of the web visualization elements (e.g. svg, lines, circles).  D3 is hosted externally.

"sources.html" - contains citations of code we used from external sources.  Major source was pageslide jquery plugin.

"main.js" - contains all the javascript for handling drawing the svg visualization, handling dropdown changes and interactivity within the svg.

"style.css" - controls the style formatting of DOM elements.  Lines, circles, tooltips, etc. are stylized with this file.

"project3-cleaned6.txt" - main csv data file that contains all movie data between 2000 and 2012, scraped for several variables.  It is imported into index.html as a <textarea>.

---------------------------------
Citations
---------------------------------
Robin, Scott. "PageSlide." : A JQuery Plugin Which Slides a Webpage over to Reveal an Additional Interaction Pane. N.p., 2012. Web. 02 May 2013.

Sowin, Joshua. "Fire and Knowledge." Fire and Knowledge RSS. N.p., 22 May 2004. Web. 02 May 2013.