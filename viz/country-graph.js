function country_graph(){

    var count_graph = {};
    count_graph.svg = d3.select("#viz");
    count_graph.graphPosition = { top: 400, left: 40 };
	count_graph.cellMaxSize = 100;

	count_graph.width = 700;
	count_graph.height = 400;
	count_graph.margin = { top: 20, right: 20, bottom: 30, left: 40 };
	count_graph.innerWidth = count_graph.width -
        count_graph.margin.left - count_graph.margin.right;
	count_graph.innerHeight = count_graph.height -
        count_graph.margin.top - count_graph.margin.bottom;

    count_graph.drawCountryGraph = function (countries) {
        
        var maxNbProd = d3.max(countries.map(function(o) { return o.products.length; }));
        var minNbProd = d3.min(countries.map(function(o) { return o.products.length; }));
	    var maxNbCat = d3.max(countries.map(function(o) { return o.prodCategories.length; }));

	    maxNbProd += maxNbProd / 5;
	    maxNbCat += maxNbCat / 5;

	    var x = d3.scaleLog().domain([minNbProd, maxNbProd]).range(
            [0, count_graph.innerWidth]);
	    var xAxis = d3.axisBottom(x);

	    var y = d3.scaleLinear().domain([0, maxNbCat]).range(
            [count_graph.innerHeight, 0]);
	    var yAxis = d3.axisLeft(y);

        var g = count_graph.svg.append("g")
		        .attr("class", "country-graph")
		        .attr("transform", "translate(" +
                      count_graph.graphPosition.left + "," +
                      count_graph.graphPosition.top + ")");

	    g.append("g")
            .attr("class", "axis axis--x_country")
		    .attr("transform", "translate(" +
                  count_graph.margin.left + ", " + (count_graph.height -
                                                    count_graph.margin
                                                    .bottom) + ")");
   		g.select(".axis--x_country").call(xAxis);

   	    g.append("text")             
            .attr("transform",
                  "translate(" + (count_graph.width / 2) + " ," + 
                  (count_graph.height + count_graph.margin
                   .top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Products");

        g.append("g")
            .attr("class", "axis axis--y_country")
    	    .attr("transform", "translate(" + count_graph.margin.left + ","
                  + count_graph.margin.top + ")");
            g.select(".axis--y_country").call(yAxis);

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - (count_graph.margin.left / 3))
            .attr("x",0 - (count_graph.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Categories");     

        var countryGroup = g.append("g")
    		    .attr("transform", "translate(" +
                      count_graph.margin.left + ", " +
                      count_graph.margin.top + ")" );

   	    countryGroup.selectAll("circle")
   		    .data(countries)
   		    .enter()
    	    .append("circle")
    	    .attr("r", function(d) { 
	    	    var nbNutriA = d.products.filter(
                    o => "a" == o.grade.toLowerCase()).length;
	   		    var propNutriA = nbNutriA / d.products.length;
	    	    return count_graph.cellMaxSize * propNutriA;
	        })
	        .attr("cx", function(d) { return x(d.products.length); })
	        .attr("cy", function(d) { return y(d.prodCategories.length); })
	        .attr('fill-opacity', 1)
            .style("fill", function(d) { return color_continent(d.continent
                                                               ); })
	        .append("svg:title")
			.text(function(d) { return d.name });

	    // events
	    countryGroup.selectAll("circle").on("click", function(country) {
            
        });
    };

    count_graph.notify = function (dm){
        count_graph.svg.selectAll("circle").remove();
        count_graph.svg.selectAll(".axis--x_country").remove();
        count_graph.svg.selectAll(".axis--y_country").remove();
        dm.get_data_country_graph(function (countries){
            d3.csv("../csv/continent-countries.csv", function(error, data) {
		        if(error) throw error;
                var targetCountries = [];
                countries.forEach(function(d){
                    var tmp = {};
                    tmp.name = d.name;
			        tmp.products = d.products;
			        tmp.prodCategories = d.prodCategories;
                    for (var i = 1; i<data.length; i++){
                        if(data[i].Country.toLowerCase() == d.name){
                            tmp.continent = data[i].Continent; 
                        }
                    }
                    if(dm.accept(tmp.continent)){
                        targetCountries.push(tmp);
                    }
                });
                count_graph.drawCountryGraph(targetCountries);
            });
        });
    };
    
    count_graph.initCountryGraph = function (dm){
        count_graph.notify(dm);
    };
    return count_graph;
}
