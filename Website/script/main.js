/*
Sources
Robin, Scott. "PageSlide." : A JQuery Plugin Which Slides a Webpage over to Reveal an Additional Interaction Pane. N.p., 2012. Web. 02 May 2013.<br>
*/

var loc = [0,0];
var selectedTitle = [];
// for range slider
var min = 0;
var max = 0;

//search query
var searchQuery = "";

/* onload */
window.onload = function() {
	document.getElementById("xselect").style.left = (window.innerWidth / 3).toString()+"px";
	document.getElementById("sidebartoggle").style.left = (window.innerWidth * 2 / 3).toString()+"px";
	document.getElementById("yselect").style.top = (window.innerHeight / 2).toString()+"px";
	document.getElementById("xselect").style.top = (window.innerHeight - 45).toString()+"px";
	document.getElementById("sidebartoggle").style.top = (window.innerHeight - 43).toString()+"px";
	document.getElementById("vidlink").style.left = (window.innerWidth - 257).toString()+"px";
	document.getElementById("slider").style.width = (window.innerWidth - 240).toString()+"px";
	document.getElementById("slider").style.top = (window.innerHeight - 70).toString()+"px";
	var descriptheight = document.getElementById("description").offsetHeight;
	document.getElementById("graph").style.top = (70+descriptheight).toString()+"px";
	
	if (window.Event) {
		document.captureEvents(Event.MOUSEMOVE);
	}

	document.onmousemove = getCursorXY;

	searchQuery = get("query");
	if (typeof(searchQuery)==='undefined') searchQuery = "";

	drawSVG(true);
	document.getElementById("xAxisSelect").onchange = function(){
		drawSVG(true);
	} 
	document.getElementById("yAxisSelect").onchange = function(){
		drawSVG(true);
	}

	$(".second").pageslide({ direction: "left"});
}

function search(query){
	//searchQuery = query;
	//Filter data to be displayed/used
	//alert(searchQuery);
	//drawSVG();
	return false;
}

function drawSVG(first){
	/* default of first is false */
	if (typeof(first)==='undefined') first = false;

	d3.select("body").select("svg").remove();
	var xAxisSelect = document.getElementById("xAxisSelect").value;
	var yAxisSelect = document.getElementById("yAxisSelect").value;
	

	var margin = {top: 50, right: 200, bottom: 20, left: 50},
    width = window.innerWidth - margin.left - margin.right - 30,
    height = window.innerHeight - 160 - document.getElementById("description").offsetHeight - margin.top - margin.bottom;

	var parseDate = d3.time.format("%x").parse;
	
	var csvdata = document.getElementById("csv").value;
	csvsplit = csvdata.split("\n");
	for (j=1; j<csvsplit.length; j++)
	{
			csvsplit[j] = csvsplit[j].split("\t");
			if (csvsplit[j].length == 14)
			{
					csvsplit[j][0] = csvsplit[j][0]+csvsplit[j][1];
					csvsplit[j].splice(1,1);
			}
	}

	var xindex, yindex;

	switch(xAxisSelect) {
		case "time": xindex = 1; break;
		case "ms": xindex = 6; break;
		case "ur": xindex = 7; break;
		case "nor": xindex = 8; break;
		case "budget": xindex = 9; break;
		case "boxoff": xindex = 10; break;
		case "date": xindex = 12; break;
	}

	switch(yAxisSelect) {
		case "time": yindex = 1; break;
		case "ms": yindex = 6; break;
		case "ur": yindex = 7; break;
		case "nor": yindex = 8; break;
		case "budget": yindex = 9; break;
		case "boxoff": yindex = 10; break;
		case "date": yindex = 12; break;
	}

	var data = csvsplit.slice(1,csvsplit.length-2);

	for (j=0; j<data.length; j++)
	{
		data[j][1] = parseInt(data[j][1]);
		data[j][6] = parseInt(data[j][6]);
		data[j][7] = parseFloat(data[j][7]);
		data[j][8] = parseInt(data[j][8]);
		data[j][9] = parseInt(data[j][9]);
		data[j][10] = parseInt(data[j][10]);
		data[j][12] = parseDate(data[j][12]);
	}
	
	var originalRange = d3.extent(data, function(d) { return d[xindex];});

	/* Filter Data here */
	if (!first)
	{
		//original without search
		//data = data.filter(function(a){return (a[xindex] > min && a[xindex] < max);});
		//without search, but checking if not empty

		if (xindex == 12)
		{
			data = data.filter(function(a){return (!isNaN(a[xindex]) && !isNaN(a[yindex]) && new Date(a[xindex]) > min && new Date(a[xindex]) < max);});
		}
		else
		{
			data = data.filter(function(a){return (!isNaN(a[xindex]) && !isNaN(a[yindex]) && a[xindex] > min && a[xindex] < max);});
		}

		//with search
		/*
		data = data.filter(function(a){
			if (!isNaN(a[xindex]) && !isNaN(a[yindex]) && a[xindex] > min && a[xindex] < max)
			{
				if (searchQuery != "")
				{
					for (var i=0; i<a.length; i++)
					{
						if (a[i].indexOf(searchQuery) !== -1) 
						{
							alert("yay");
							return true;
						}
						alert("checked");
					}
					return false;
				}
				else return true;
			}
			else return false;
		});
*/

	}
	else
	{
		data = data.filter(function(a){return (!isNaN(a[xindex]) && !isNaN(a[yindex]));});
		//with search
		/*
		data = data.filter(function(a){
			if (!isNaN(a[xindex]) && !isNaN(a[yindex]))
			{
				if (searchQuery != "")
				{
					for (var i=0; i<a.length; i++)
					{
						if (a[i].toUpperCase().indexOf(searchQuery.toUpperCase()) !== -1)
						{
							alert("yay");
							return true;
						}
						alert("checked");
					}
					return false;
				}
				else return true;
			}
			else return false;
		});
		*/

		//set min, max
		if (xindex == 12)
		{
			var range = d3.extent(data, function(d) { return new Date(d[xindex]);});
		}
		else
		{
			var range = d3.extent(data, function(d) { return d[xindex];});
		}
		min = range[0];
		max = range[1];
	}

	if (xAxisSelect != "date")
	{
			data = data.sort(function(a,b) {return a[xindex]-b[xindex]});
			var x = d3.scale.linear()
					.domain(d3.extent(data, function(d) { return d[xindex];}))
					.range([0, width]);
	}
	else	
	{
		data = data.sort(function(a,b) {return a[xindex]-b[xindex]});
		x = d3.time.scale()
			.domain(d3.extent(data, function(d) { return d[xindex];}))
	    	.range([0, width]);
	}

	if (yAxisSelect == "time")
	{
		var y = d3.scale.linear()
			.domain(d3.extent(data, function(d) { return d[yindex];}))
			.range([height, 0]);
	}
	else
	{
		var y = d3.scale.linear()
			.domain([0, d3.extent(data, function(d) { return d[yindex];})[1]])
			.range([height, 0]);
	}

	/*Begin Range Slider */
	if (xAxisSelect != "date")
	{
		$(function() {	
			$( "#slider" ).slider({
				range: true,
				min: originalRange[0],
				max: originalRange[1],
				values: [min,max],
				slide: function(event, ui) {slide(event, ui)}
			});
	    });
	}
	/*End Range Slider */
		
	var line = d3.svg.line()
		.x(function(d,i) { return x(d[xindex])})
		.y(function(d) { return y(d[yindex])});

	var graph = d3.select("#graph").append("svg:svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("svg:g")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");
			
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	graph.append("svg:g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

	var yAxisLeft = d3.svg.axis().scale(y).orient("left");
	graph.append("svg:g")
			.attr("class", "y axis")
			.attr("transform", "translate(-25,0)")
			.call(yAxisLeft);	
			
	graph.append("svg:path").attr("class","path").attr("d", line(data));
		
	graph.selectAll()
		.data(data)
	.enter().append("svg:circle")
		.attr("class", function(d) 
						{
							if ($.inArray(d[0], selectedTitle) != -1)
							{
								return "highlighted_point";
							} 
							else
							{
								return "point";
							}
						})
		.attr("href", "#modal")	
		.attr("cx", function(d,i) { return x(d[xindex]);})
		.attr("cy", function(d) { return y(d[yindex]);})
		.attr("r", function(d) {
							if ($.inArray(d[0], selectedTitle) != -1)
							{
								return 3;
							}
							else
							{
								return 2;
							}
						})
		.on('mouseover', function(d){
			d3.select(this).attr('r', 3);
			document.getElementById("tooltip").style.position = "absolute";
			document.getElementById("tooltip").style.top = loc[1].toString()+"px";
			document.getElementById("tooltip").style.left = loc[0].toString()+"px";
			document.getElementById("tooltip").style.visibility = "visible";
			var newhtml;
			if (xAxisSelect == "date")
			{
				var format = d3.time.format("%m/%d/%Y");
				newhtml = d[0]+"<br>x: "+format(new Date(d[xindex]))+"<br>y: "+d[yindex].toString();
			}
			else
				newhtml = d[0]+"<br>x: "+d[xindex].toString()+"<br>y: "+d[yindex].toString();
			document.getElementById("specificcontent").innerHTML = newhtml;
		})
		.on('mouseout', function(){
			d3.select(this).attr('r', 2);
			document.getElementById("tooltip").style.visibility = "hidden";
		})
		.on("click", function(d){
			graph.selectAll(".highlighted_point").attr("class", "point")
									.attr("r", 2);
			d3.select(this).attr("class", "highlighted_point");
			selectedTitle[0] = d[0];
			document.getElementById("movietitle").innerHTML = selectedTitle[0];
			var format = d3.time.format("%m/%d/%Y");
			var newhtml = "Runtime: "+d[1]+sbs(" min<br>Genre: ",d[2])+sbs("<br>Directors: ",d[3])+
						  sbs("<br>Writers: ",d[4])+sbs("<br>Actors: ",d[5])+sbs2("<br>Metascore: ",d[6])+
						  "<br>User Rating: "+d[7]+"<br>Number of Ratings: "+d[8]+
						  sbs2("<br>Budget: $",d[9])+sbs2("<br>Box Office: $",d[10])+sbs("<br>MPAA Rating: ",d[11])+
						  "<br>Date: "+format(new Date(d[12]));
			document.getElementById("moviefacts").innerHTML = newhtml;
		});
	$(".point").pageslide({ direction: "left"});
	$(".highlighted_point").pageslide({ direction: "left"});
	return false;
}

function sbs(s1,s2) {
	if (typeof(s2)==='undefined' || s2 == "")
		return ""
	return (s1+s2.toString())
}

function sbs2(s1,s2) {
	if (isNaN(s2))
		return ""
	return (s1+s2.toString())
}


function getCursorXY(e) {
	loc[0] = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	loc[1] = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

function slide(event, ui){
	//update min, max
	min = ui.values[0];
	max = ui.values[1];
	drawSVG();
}

/* Averages data of same x value */
function averageData(data, xindex, yindex){
	for (i=0; i<data.length-1; i++)
	{
		if (data[i][xindex] = data[i+1][xindex])
		{
			//duplicate
		}
	}
	return data;
}

function toggleTabs(tab){
	if (tab == "info") document.getElementById("box-info").style.visibility = "visible";
	else document.getElementById("box-info").style.visibility = "hidden";
	if (tab == "search") document.getElementById("box-search").setAttribute("visibility", "visible");
	else document.getElementById("box-search").setAttribute("visibility", "hidden");
	if (tab == "trends") document.getElementById("box-trends").setAttribute("visibility", "visible");
	else document.getElementById("box-trends").setAttribute("visibility", "hidden");
}

function resetAll(){
	drawSVG(true);
}

function trend1970(){
	selectedTitle = ["The Last House on the Left", "Straw Dogs", "A Clockwork Orange", "The French Connection", "Dirty Harry", "Taxi Driver",
					 "The Godfather", "Nashville", "Enter the Dragon", "Snake in the Eagle's Shadow", "Drunken Master", "Annie Hall", "Manhattan",
					 "Badlands", "Days of Heaven", "Chinatown"];
	document.getElementById("trend-title1").style.visibility = "visible";
	document.getElementById("trend-description1").style.visibility = "visible";	
	document.getElementById("trend-title2").style.visibility = "visible";
	document.getElementById("trend-description2").style.visibility = "visible";
	document.getElementById("trend-title3").style.visibility = "visible";
	document.getElementById("trend-description3").style.visibility = "visible";
	document.getElementById("trend-title1").innerHTML = "New Hollywood";
	document.getElementById("trend-description1").innerHMTL = "With the seventies came a more bold Hollywood, ready to introduce controversial \
		topics and unafraid of showing violence and sex. The model of example of this is <i>The Last House on the Left</i>, released in 1972. \
		Movies like Dirty Harry and The French Connection sparked controversy over their increase of violence in the film.";
	document.getElementById("trend-title2").innerHTML = "Auteur Theory";
	document.getElementById("trend-description2").innerHTML = "At the same time, film makers began to express their personal visions and creative \
		insight on their films, also known as autuer theory. As a result, directors were given even greater control over the final outcome of the film. \
		Some of the critical successes of auteur theory include <i>The Godfather</i>, <i>Chinatown</i> and Scorsese's <i>Taxi Driver</i>.";
	document.getElementById("trend-title3").innerHTML = "Rise of the Martial Arts";
	document.getElementById("trend-description3").innerHTML = "Thanks to Bruce Lee, martial arts films saw a major increase in popularity in the 70s. \
		Movie viewers were interested in seeing traditional Chinese martial arts and thanks to Lee's Jeet Kune Do style, the additional realism of the \
		action scenes. Despite the quick rise of the genre, in the later half of the decade, the films were noticeably less popular."
	
	$.pageslide({ direction: 'left', href:'#modal' });

	document.getElementById("xAxisSelect").value = "date";
	min = new Date("12/30/1970");
	max = new Date("01/01/1980");

	drawSVG();
}

function trend1980(){
	selectedTitle = ["Indiana Jones and the Temple of Doom", "Indiana Jones and the Last Crusade", "Star Wars: Episode V - The Empire Strikes Back",
					 "Star Wars: Episode VI - Return of the Jedi", "Jaws 3-D", "Jaws 2", "Jaws: The Revenge", "Project A", "Police Story",
					 "Police Story 2"];
	document.getElementById("trend-title1").style.visibility = "visible";
	document.getElementById("trend-description1").style.visibility = "visible";	
	document.getElementById("trend-title1").innerHTML = "Lucas-Spielberg Era";
	document.getElementById("trend-description1").innerHTML = "During the 1980's, George Lucas and Steven Spielberg grew to dominate the box office. \
		Between two <i>Star Wars</i> films, three <i>Jaws</i>, and three Indiana Jones films, the two prompted many imitations and encouraged the \
		development of sequels.";
		
	document.getElementById("trend-title2").style.visibility = "visible";
	document.getElementById("trend-description2").style.visibility = "visible";
	document.getElementById("trend-title2").innerHTML = "Return of the Martial Arts";
	document.getElementById("trend-description2").innerHTML = "After the death of Bruce Lee, it seemed as if the Hong Kong Marital Arts film was\
		in its decline. However, Jackie Chan's entry to the industry revitalized the genre. Jackie encouraged highly dangerous and elaborate scenes\
		as well integration of the genre with comedy.";
		
	document.getElementById("trend-title3").style.visibility = "hidden";
	document.getElementById("trend-description3").style.visibility = "hidden";
		
	$.pageslide({ direction: 'left', href:'#modal' });

	document.getElementById("xAxisSelect").value = "date";
	min = new Date("12/30/1979");
	max = new Date("01/01/1990");

	drawSVG();
}
function trend1990(){
	selectedTitle = ["Titanic", "Terminator 2:Judgement Day", "Jurassic Park", "Sex, Lies, and Videotape", "Reservoir Dogs", "Pulp Fiction",
					 "Beauty and the Beast", "Aladdin", "The Lion King", "Toy Story"];
	document.getElementById("trend-title1").style.visibility = "visible";
	document.getElementById("trend-description1").style.visibility = "visible";	
	document.getElementById("trend-title2").style.visibility = "visible";
	document.getElementById("trend-description2").style.visibility = "visible";
	document.getElementById("trend-title3").style.visibility = "visible";
	document.getElementById("trend-description3").style.visibility = "visible";
	document.getElementById("trend-title1").innerHTML = "Strength in Special Effects";
	document.getElementById("trend-description1").innerHTML = "During the 90's, the increased adoption of special effects lead \
		to big success at the box office. Hit films such as <i>Titanic</i> attracted millions of views and rooted special effects \
		an essential role in modern day film.";
	document.getElementById("trend-title2").innerHTML = "Independent Studios";
	document.getElementById("trend-description2").innerHTML = "Independent films were becoming increasingly relevant after the success \
		of hits like Quentin Tarantino's <i>Reservoir Dogs</i>. American studios quickly jumped upon the success of the movement and \
		rushed to open their own 'independent' studios to produce non-mainstream films.";
	document.getElementById("trend-title3").innerHTML = "Animated Films Rise Again";
	document.getElementById("trend-description3").innerHTML = "Similarly during the time, animated films from Disney regained their \
		popularity. Of special note was Pixar's <i>Toy Story</i> a computer generated film that became immensely popular, paving \
		the road for the future success of Dreamsworks Animation and 20th Century Fox.";

	$.pageslide({ direction: 'left', href:'#modal' });

	document.getElementById("xAxisSelect").value = "date";
	min = new Date("12/30/1989");
	max = new Date("01/01/2000");

	drawSVG();
	
}		
function trend2000(){
	selectedTitle = ["The Lord of the Rings: The Fellowship of the Ring", "The Lord of the Rings: The Two Towers", "The Lord of the Rings: The Return of the King",
					 "Gladiator", "Harry Potter and the Sorcerer's Stone", "Harry Potter and the Chamber of Secrets", "Harry Potter and the Prisoner of Azkaban",
					 "Harry Potter and the Goblet of Fire", "Harry Potter and the Order of the Phoenix", "Harry Potter and the Half-Blood Prince",
					 "Crouching Tiger, Hidden Dragon", "Spirited Away", "City of God", "The Passion of the Christ", "Apocalypto", "Slumdog Millionaire"];
	document.getElementById("trend-title1").style.visibility = "visible";
	document.getElementById("trend-description1").style.visibility = "visible";	
	document.getElementById("trend-title2").style.visibility = "visible";
	document.getElementById("trend-description2").style.visibility = "visible";
	document.getElementById("trend-title3").style.visibility = "visible";
	document.getElementById("trend-description3").style.visibility = "visible";
	document.getElementById("trend-title1").innerHTML = "Documentary Films (not shown)";
	document.getElementById("trend-description1").innerHTML = "Surprisingly, the documentary genre developed into a commercial during the 90's. Hits like \
		<i>March of the Penguins</i> and <i>Bowling for Columbine</i>. With the advent of the DVD, these films were able to expand even more broadly.";
	document.getElementById("trend-title2").innerHTML = "Epic Films";
	document.getElementById("trend-description2").innerHTML = "After the success of <i>Gladiator</i>, epic cinema became more popular among viewers. Hit \
		franchises such <i>The Lord of the Rings</i> were instant hits and the Harry Potter series grew to become the highest-grossing film franchise \
		of all time.";
	document.getElementById("trend-title3").innerHTML = "Globalization of Cinema";
	document.getElementById("trend-description3").innerHMTL = "During the decade, thanks to greater global connection, foreign language films became \
		more popular among English-speaking viewers. Some examples include <i>Spirited Away</i>, <i>City of God</i>, and <i>The Passion of the Christ</i>.";
	$.pageslide({ direction: 'left', href:'#modal' });

	document.getElementById("xAxisSelect").value = "date";
	min = new Date("12/30/1999");
	max = new Date("01/01/2010");

	drawSVG();
}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}