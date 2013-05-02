var loc = [0,0];
var selectedTitle = "";
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
	document.getElementById("vidlink").style.left = (window.innerWidth - 157).toString()+"px";
	document.getElementById("slider").style.width = (window.innerWidth - 240).toString()+"px";
	document.getElementById("slider").style.top = (window.innerHeight - 70).toString()+"px";
	var descriptheight = document.getElementById("description").offsetHeight;
	document.getElementById("graph").style.top = (70+descriptheight).toString()+"px";
	
	if (window.Event) {
		document.captureEvents(Event.MOUSEMOVE);
	}

	document.onmousemove = getCursorXY;

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
	searchQuery = query;
	//Filter data to be displayed/used
	alert(query);
	drawSVG(true);
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
		data = data.filter(function(a){return (a[xindex] != "" && a[yindex] != "" && a[xindex] > min && a[xindex] < max);});

		//with search
		//var search = document.getElementById("");
		//var search = "The Cave";
		//data = data.filter(function(a){return (a[xindex] != "" && a[yindex] != "" && a[xindex] > min && a[xindex] < max && $.inArray(search, a) != -1);});

	}
	else
	{
		//with search
		//var search = document.getElementById("");
		//var search = "The Cave";
		//data = data.filter(function(a){return (a[xindex] != "" && a[yindex] != "" && $.inArray(search, a) != -1);});

		//set min, max
		var range = d3.extent(data, function(d) { return d[xindex];});
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
	$(function() {	
		$( "#slider" ).slider({
			range: true,
			min: originalRange[0],
			max: originalRange[1],
			values: [min,max],
			slide: function(event, ui) {slide(event, ui)}
		});
    });
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
							if (d[0] == selectedTitle)
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
							if (d[0] == selectedTitle) 
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
			selectedTitle = d[0];
			document.getElementById("movietitle").innerHTML = selectedTitle;
			var format = d3.time.format("%m/%d/%Y");
			var newhtml = "Runtime: "+d[1]+sbs("<br>Genre: ",d[2])+sbs("<br>Directors: ",d[3])+
						  sbs("<br>Writers: ",d[4])+sbs("<br>Actors: ",d[5])+sbs("<br>Metascore: ",d[6])+
						  "<br>User Rating: "+d[7]+"<br>Number of Ratings: "+d[8]+
						  sbs("<br>Budget: ",d[9])+sbs("<br>Box Office: ",d[10])+sbs("<br>MPAA Rating: ",d[11])+
						  "<br>Date: "+format(new Date(d[12]));
			document.getElementById("moviefacts").innerHTML = newhtml;
		});
	$(".point").pageslide({ direction: "left"});
	$(".highlighted_point").pageslide({ direction: "left"});
}

function sbs(s1,s2) {
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

function trend1950(){

}

function trend1960(){

}

function trend1970(){
	
}

function trend1980(){
	
}
function trend1990(){
	
}
function trend2000(){
	
}