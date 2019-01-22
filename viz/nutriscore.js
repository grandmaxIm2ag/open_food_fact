function nutriscore(svg){ 
    var nutri = {};
    nutri.block_popup = false;
    nutri.graphPosition = { top: 165, left: 780 };
    
    nutri.svg = svg;
    nutri.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    nutri.x = d3.scaleBand().padding(0.1);
    nutri.y = d3.scaleLinear();

    nutri.draw = function (data_to_update, dm) {
        var width = 300 - nutri.margin.left - nutri.margin.right,
	    height = 200 - nutri.margin.top - nutri.margin.bottom;
	    nutri.x.rangeRound([0, width]);
	    nutri.y.rangeRound([height, 0]);

	    nutri.g.select(".axis--x_nutri")
	        .attr("transform", "translate(0," + height + ")")
	        .call(d3.axisBottom(nutri.x));

	
	nutri.g.select(".axis--y_nutri")
	    .call(d3.axisLeft(nutri.y));
        
	// ENTER
	nutri.g.selectAll(".bar")
	    .data(data_to_update)
	    .enter().append("rect")
            .attr("class", "bar")
	    .attr("x", function (d) { return nutri.x(d.grade); })
	    .attr("y", height)
	    .attr("width", nutri.x.bandwidth())
	    .attr("fill", function(d) { return color_nutriscore_grade
					(d.grade); } )
        .transition()
            .duration(1000)
            .attr("y", function (d) { return nutri.y(d.count); })
            .attr("height", function (d) { return height - nutri.y(d.count); });
	
	nutri.g.selectAll(".bar").on("mouseover", function(d) {
	    if(nutri.block_popup){
		return;
	    }
	    var div = d3.select("body").append("div")
		.attr("class", "tooltip_nutriscore")
		.style("opacity", 0.9);
	    create_popup(div,250,350, function(div){
		var dm_bis = dm.copy();
		dm_bis.filter_grade = true;
		dm_bis.choosen_grade = d.grade;
		var svg_bis = div.append("svg")
		    .style("width", 550 + 'px')
		    .style("height", 250 + 'px');
		var pc = piechart(svg_bis);
		pc.graphPosition = { top: 250/2, left: 350/3 };
		pc.margin = { top: 0, right: 0, bottom: 0, left: 0};
		pc.draw_pie_chart_categories(dm_bis);
	    });
	    
        })
	    .on("mouseout", function(d) {
		d3.selectAll("div.tooltip_nutriscore").remove();
            });

    };
    
    nutri.notify = function(dm){
        nutri.svg.select(".barchart").remove();
        nutri.g = nutri.svg.append("g")
            .attr("class", "barchart")
	    .attr("transform", "translate(" + (nutri.graphPosition.left
                                               + nutri.margin.left) +
                  "," + (nutri.graphPosition.top + nutri.margin.top)
                  + ")");
        nutri.g.append("g")
	    .attr("class", "axis axis--x_nutri");

	nutri.g.append("text")             
            .attr("transform",
                  "translate(" + ((300 - nutri.margin.left - nutri.margin.right) / 2) + " ," + 
                  (200 -10) + ")")
            .style("text-anchor", "middle")
            .text("Nutriscore Grade");

        nutri.g.append("g")
    	    .attr("class", "axis axis--y_nutri");

	nutri.g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (nutri.margin.left +25))
            .attr("x",0 - ((200 - nutri.margin.bottom) / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Products");
	
        nutri.g.append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", "0.71em")
	    .attr("text-anchor", "end");
        
        dm.get_data_nutriscore(function(data) {
            nutri.x.domain(data.map(function (d) { return d.grade; }));
            var v = data.map(function (d) { return d.count; });
            nutri.y.domain([0, d3.max(data.map(function (d) {
                return d.count; }))]);
            nutri.draw(data, dm);
        });
    };
    
    nutri.draw_bar_charts_nutriscore = function(dm){
        /*.text("Count of Product")*/;
        nutri.notify(dm);
        return nutri.svg.node();
    };
    return nutri;
}
