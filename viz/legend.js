function legendCircles(svg){

	var legend = {};
	legend.svg = svg;
	legend.graphPosition = { top: 100, left: 100 };
	
	legend.circleMaxSize = 100;				// = count_graph.cellMaxSize = How big is 100%
	legend.circleMaxPerc = 40;				// What max % will be displayed
	legend.circleNb = 4;
	var ratio = legend.circleMaxSize/100;
	var radiusMax = legend.circleMaxPerc*ratio;
	
	legend.margin = { top: 10, right: 20, bottom: 10, left: 10 };
	legend.width = 2*radiusMax + 50 + legend.margin.left + legend.margin.right;
	legend.height = 2*radiusMax + legend.margin.top + legend.margin.bottom;
	
	legend.circleRadius = [];
	legend.hitbox = [];
	var centerX = legend.margin.left + radiusMax;
	var step = legend.circleMaxPerc / legend.circleNb;
	for(i=legend.circleMaxPerc; i>=step; i-=step){
		let r = i*ratio;
		let centerY = legend.height-legend.margin.bottom - r;
		legend.circleRadius.push({ perc:i, radius:r, cx:centerX, cy:centerY });
		legend.hitbox.push({ x:legend.margin.left, y:centerY-r, w:2*radiusMax, h:2*step*ratio });
	}
	

	
	g = legend.svg.append("g")
		.attr("width", legend.width)
		.attr("height", legend.height)
		.attr("transform", "translate(" + legend.graphPosition.left + ","
										+ legend.graphPosition.top + ")");
		
	g.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", legend.width)
			.attr("height", legend.height)
			.style("stroke", "black")
			.style("fill", "none");

	var colorTable = [];
	
	var elem = g.selectAll("circle-line-text")
		.data(legend.circleRadius)
		.enter();
		
		elem.append("circle")
			.attr("id", function(d,i){ return "c"+i })
			.attr("r", function(d){ return d.radius; })
			.attr("cx", function(d){ return d.cx; })
			.attr("cy", function(d){ return d.cy; })
			.style("stroke", "black")
			.style("fill", function(d,i){ colorTable[i]=0; return "none"; });
			
		elem.append("line")
			.attr("x1", function(d){ return d.cx; })
			.attr("y1", function(d){ return d.cy - d.radius; })
			.attr("x2", function(d){ return d.cx + radiusMax + 25; })
			.attr("y2", function(d){ return d.cy - d.radius; })
			.style("stroke-dasharray", "10,3")
			.style("stroke", "black");
			
		elem.append("text")
			.text(function(d){ return d.perc + "%"; })
			.attr("x", function(d){ return d.cx + radiusMax + 25; })
			.attr("y", function(d){ return d.cy - d.radius + 6; })
			.attr("font-size", "12px");
	
	var ck = -1;
	var colors = [ "none", "lightgrey", "lightblue", "blue"];
	function colorUpdate(callback){ 
		colorTable.forEach(function(d2,j,data){ 
			callback(j,data); 
			d3.select("#c"+j).style("fill", colors[data[j]]); 
		}); 
	}
	
	g.selectAll("hitb")
		.data(legend.hitbox)
		.enter()
		.append("rect")
			.attr("x", function(d){ return d.x; })
			.attr("y", function(d){ return d.y; })
			.attr("width", function(d){ return d.w; })
			.attr("height", function(d){ return d.h; })
			.style("fill", "transparent")
			.style("opacity", 0.5)
			.on("mouseover", function(d,i){
				colorUpdate(function(j,data){ if(j>=i) data[j]++; });
			})
			.on("mouseout", function(d,i){
				colorUpdate(function(j,data){ if(j>=i) data[j]--; });
			})
			.on("click", function(d,i){
				colorUpdate(function(j,data){ data[j] = (j<i ? 0 : i==ck ? 1 : 3); });
				ck = (i==ck ? -1 : i);
			});
	
	legend.notify = function(hover, circleRadius){
		if(hover){ 
			g.append("circle")
				.attr("id", "hover")
				.attr("r", circleRadius)
				.attr("cx", centerX)
				.attr("cy", legend.height-legend.margin.bottom - circleRadius)
				.style("stroke", "yellow")
				.style("fill", function(d,i){ colorTable[i]=0; return "none"; });
		}
		else g.selectAll("#hover").remove();
		console.log("Test");
	}
	
	return legend;

}
