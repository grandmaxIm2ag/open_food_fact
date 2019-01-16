function piechart(svg){
	console.log("test0");	
	var pc = {};
	var threshold = 10;		// Number of slices, not counting Others

	pc.colorShades = function (i) {
		if(i == threshold) return d3.rgb(200, 200, 200);
		var c = d3.rgb(200, 200, 200);
		c.opacity = 1.0 - (i / threshold);
		return c;
	};
	
	pc.sumValue = function (collection) {
		return collection.reduce(function(tot,cur){return tot+cur.value;},0);
	};
	
	pc.radius = 50;
	pc.graphPosition = { top: 650 + pc.radius, left: 950 + pc.radius };
	pc.margin = { top: 20, right: 20, bottom: 30, left: 40 };
	pc.width = 400 - pc.margin.left - pc.margin.right;
	pc.height = 300 - pc.margin.top - pc.margin.bottom;
	
	console.log("test01");
	pc.svg = svg;
	
	pc.g = pc.svg.append("g")
			.attr("transform", "translate(" + (pc.graphPosition.left
                                               + pc.margin.left) +
                  "," + (pc.graphPosition.top + pc.margin.top)
                  + ")")
             .attr("class", "piechart");
			
	var arc = d3.arc()
	    .outerRadius(pc.radius)
	    .innerRadius(0);
	    
	var pie = d3.pie()
	    .value(function(d) { return d.value; })
	    .sort(null);
		    
	console.log("test1");
	pc.draw = function(countData){
		
		var data_to_use = countData.slice(0, threshold);
		console.log(pie(data_to_use));
		data_to_use.push({ key:"others", value:pc.sumValue(countData)-pc.sumValue(data_to_use) });
	
		pc.g.selectAll(".slice")
			.data(pie([data_to_use]))
			.enter().append("path")
			.attr("class", "slice")
			.attr('d', arc)
			.attr('fill', function(d, i) { return pc.colorShades(i); });
		/*pc.g.append("text")
		    		.attr("transform", function(d) {
		    			d.innerRadius = 0;
		    			d.outerRadius = pc.radius;
		    			return "translate(" + arc.centroid(d) + ")"; })
		    		.attr("text-anchor", "middle")
		    		.text(function(d) { return d.key; });
		 */   		
	};
	console.log("test2");
	pc.notify = function(dm){
		pc.svg.selectAll(".slice").remove();
		dm.get_data_piechart(function(data){
			return pc.draw(data);
		});
	};
	console.log("test3");
	pc.draw_pie_chart_categories = function(dm){
		pc.notify(dm);
	};
	console.log(pc);	
	return pc;
}

