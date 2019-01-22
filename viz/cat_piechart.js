function piechart(svg){

    var pc = {};

    pc.sumValue = function (collection) {
	return collection.reduce(function(tot,cur){return tot+cur.value;},0);
    };
    
    pc.radius = 80;
    pc.graphPosition = { top: 390 + pc.radius, left: 810 + pc.radius };
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

    pc.g = pc.svg.append("g")
        .attr("class", "piechart");
    
    
    pc.draw = function(countData, dm){
	
	pc.g.attr("transform", "translate(" + 
		  (pc.graphPosition.left + pc.margin.left) + "," + 
		  (pc.graphPosition.top + pc.margin.top) + ")");
	
	pc.colorShades = function (i, threshold) {
	    if(i == threshold) return d3.rgb(200, 200, 200);
	    var c = dm.choosen_filter == dm.filter.WORLD ? d3.rgb(0, 0, 0) : color_continent(dm.choosen_region); 
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

	var legendG = pc.g.selectAll(".legend")
	    .data(pie(data_to_use))
	    .enter().append("g")
	    .attr("transform", function(d,i){
		return "translate(" + (pc.width-250) + "," + (i * 15 - 80) + ")";
	    })
	    .attr("class", "legend");

	legendG.append("rect") // make a matching color rect
	    .attr("width", 10)
	    .attr("height", 10)
	    .attr("fill", function(d, i) {
		return pc.colorShades(i, threshold);
	    });

	legendG.append("text") // add the text
	    .text(function(d){
		return d.data.key;
	    })
	    .style("font-size", 12)
	    .attr("y", 10)
	    .attr("x", 11);
    };

    pc.svg.append("g").append("text")
    		.attr("transform",
                  "translate(" + (pc.graphPosition.left + pc.radius / 2) + " ," + 
                  (pc.graphPosition.top + pc.height/2 - 15 ) + ")")
            
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Categories");
    
    pc.notify = function(dm){
	pc.g.selectAll(".slice").remove();
	dm.get_data_piechart(function(data){
	    return pc.draw(data, dm);
	});
    };
    
    pc.draw_pie_chart_categories = function(dm){
	pc.notify(dm);
    };
    
    return pc;
}

