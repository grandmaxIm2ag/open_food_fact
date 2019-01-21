function piechart(svg){

	var pc = {};

	pc.sumValue = function (collection) {
		return collection.reduce(function(tot,cur){return tot+cur.value;},0);
	};
	
	pc.radius = 80;
	pc.graphPosition = { top: 400 + pc.radius, left: 830 + pc.radius };
	pc.margin = { top: 20, right: 20, bottom: 30, left: 40 };
	pc.width = 400 - pc.margin.left - pc.margin.right;
	pc.height = 300 - pc.margin.top - pc.margin.bottom;
	
	pc.svg = svg;
	
	var arc = d3.arc()
	    .outerRadius(pc.radius)
	    .innerRadius(0);
	    
	var pie = d3.pie()
	    .value(function(d) { return d.value; })
	    .sort(null);
	    
	pc.draw = function(countData, dm){
		
		pc.colorShades = function (i, threshold) {
			if(i == threshold) return d3.rgb(200, 200, 200);
			var c = dm.choosen_filter == dm.filter.WORLD ? d3.rgb(0,0,0) :
			color_continent(dm.choosen_region); 
			c.opacity = 1.0 - (i / threshold);
			return c;
		};	
		
		var thresh = 10;
		var data_to_use = countData.slice(0, thresh);
		data_to_use.push({ key:"others", value:pc.sumValue(countData)-pc.sumValue(data_to_use) });
	
		var threshold = (thresh > data_to_use.length) ? data_to_use.length - 2 : thresh; 
		pc.g.selectAll(".slice")
			.data(pie(data_to_use))
			.enter().append("path")
			.attr("class", "slice")
			.attr('d', arc)
			.attr('fill', function(d, i) { return pc.colorShades(i, threshold); })
			.append("svg:title").text(function(d) {return  d.data.key+"\n"+d.data.value; });
	};
	
	pc.notify = function(dm){
		pc.g = pc.svg.append("g")
			.attr("transform", "translate(" + (pc.graphPosition.left
                                               + pc.margin.left) +
                  "," + (pc.graphPosition.top + pc.margin.top)
                  + ")")
             .attr("class", "piechart");
		pc.svg.selectAll(".slice").remove();
		dm.get_data_piechart(function(data){
			return pc.draw(data, dm);
		});
	};
	
	pc.draw_pie_chart_categories = function(dm){
		pc.notify(dm);
	};
		
	return pc;
}

