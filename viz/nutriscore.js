function nutriscore(){ 
    var nutri = {};
    nutri.graphPosition = { top: 200, left: 900 };

    nutri.svg = d3.select("#viz");
	nutri.margin = { top: 20, right: 20, bottom: 30, left: 40 };
	nutri.x = d3.scaleBand().padding(0.1);
	nutri.y = d3.scaleLinear();

    nutri.draw = function (data_to_update) {
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
		    .enter().append("rect").transition().duration(2000)
            .attr("class", "bar")
		    .attr("x", function (d) { return nutri.x(d.grade); })
		    .attr("y", function (d) {
		        return nutri.y(d.count); })
		    .attr("width", nutri.x.bandwidth())
		    .attr("height", function (d) { return height -
                                           nutri.y(d.count); })
		    .attr("fill", function(d) { return color_nutriscore_grade
                                        (d.grade); } );
    };
    
    nutri.notify = function(dm){
        nutri.svg.selectAll(".bar").remove();
        nutri.svg.selectAll(".axis--y_nutri").remove();
        nutri.g = nutri.svg.append("g")
	        .attr("transform", "translate(" + (nutri.graphPosition.left
                                               + nutri.margin.left) +
                  "," + (nutri.graphPosition.top + nutri.margin.top)
                  + ")");
        nutri.g.append("g")
	        .attr("class", "axis axis--x_nutri");

        nutri.g.append("g")
	        .attr("class", "axis axis--y_nutri");

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
            nutri.draw(data);
        });
    };
    
    nutri.draw_bar_charts_nutriscore = function(dm){
        /*.text("Count of Product")*/;
        nutri.notify(dm);
        return nutri.svg.node();
    };
    return nutri;
}
