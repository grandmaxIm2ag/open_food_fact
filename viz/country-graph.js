function country_graph(legend, svg){

    var count_graph = {};
    count_graph.popup = false;
    count_graph.svg = svg;
    count_graph.graphPosition = { top: 50, left: 20 };
    count_graph.cellMaxSize = 100;

    var selectCountry = false;

    count_graph.width = 700;
    count_graph.height = 500;
    count_graph.margin = { top: 20, right: 20, bottom: 20, left: 40 };
    count_graph.innerWidth = count_graph.width -
        count_graph.margin.left - count_graph.margin.right;
    count_graph.innerHeight = count_graph.height -
        count_graph.margin.top - count_graph.margin.bottom;

    count_graph.drawCountryGraph = function (countries, dm) {
        
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
                   .top) + ")")
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
        	    .attr("class", "country-dot")
        	    .attr("r", function(d) { 

	            	var nbNutriA = d.products.filter(
                            o => "a" == o.grade.toLowerCase()).length;
	               	var propNutriA = (nbNutriA / d.products.length).toFixed(2);
	                	return count_graph.cellMaxSize * propNutriA;
	            })
	            .attr("cx", function(d) { return x(d.products.length); })
	            .attr("cy", function(d) { return y(d.prodCategories.length); })
	            .attr('fill-opacity', 1)
                    .style("fill", function(d) { return color_continent(d.Continent
                                                                       ); })
	            .append("svg:title")
	            .text(function(d) { return firstCapital(d.Country) });

	    // events
	    countryGroup.selectAll("circle").on("click", function(d) {
	        if (selectCountry) {
		        selectCountry = false;
		        d3.selectAll("div.tooltip_country").remove();
	        } else {   
		        selectCountry = true;
        		var div = d3.select("body")
                    .append("div")
            		    .attr("class", "tooltip_country")
                        .style("padding", '10px')
            		    .style("opacity", 1);

        		create_popup(div,500,350, function(div){
        		    var dm_bis = dm.copy();
        		    dm_bis.choosen_filter = dm.filter.COUNTRY;
        		    dm_bis.choosen_country = d.Country;
    		        dm_bis.choosen_region = d.Continent;

                    var btnClose = div.append("a")
                                        .attr("class", "close");
                    btnClose.on("click", function() {
                        div.remove();
                        selectCountry = false;
                    });

                    var header = div.append("div");
                    header.append("h1")
		             .text(firstCapital(d.Country))
		             .append("cross")
	                 .attr("rx", 25)
	                 .attr("ry", 10)
		             .style("fill","black")
		             .on("click", function(){
		                d3.selectAll("div.tooltip_country").remove();
		                legend.notify(false);
		             });

                    var table = div.append("table")
                                    .attr("class", "tb-country")
                                    .attr("align", "left");

                    var trhead = table.append("thead")
                                        .append("tr");

                    trhead.append("th").attr("width", "15%");
                    trhead.append("th").attr("width", "20%");
                    trhead.append("th").attr("width", "20%");
                    trhead.append("th").attr("width", "30%");

                    var tbody = table.append("tbody");

                    var row1 = tbody.append("tr");
                    row1.append("td").text("Continent:");
                    row1.append("td").text(firstCapital(d.Continent));
                    row1.append("td").text("Nutri-score A:");

                    var nbNutriA = d.products.filter(o => "a" == o.grade.toLowerCase()).length;
                    var propNutriA = ((nbNutriA / d.products.length) * 100).toFixed(2);

                    row1.append("td").text(propNutriA + "%");

                    var row2 = tbody.append("tr");
                    row2.append("td").text("Products:");
                    row2.append("td").text(d.products.length);
                    row2.append("td").text("Categories:");
                    row2.append("td").text(d.prodCategories.length);                

        		    var svg_bis = div.append("svg")
        			                 .style("width", 700 + 'px')
        			                 .style("height", 500 + 'px');

		        
        		    var nutri_bis = nutriscore(svg_bis);
        		    nutri_bis.graphPosition = { top: 0, left: 0 };
        		    nutri_bis.margin = { top: 30, right: 30, bottom: 30, left: 50};
		            nutri_bis.block_popup = true;
		            var pc = piechart(svg_bis);
		            pc.graphPosition = { top: 500/5, left: (3*700)/4 };
		            pc.margin = { top: 0, right: 0, bottom: 0, left: 0};
		            pc.draw_pie_chart_categories(dm_bis);

        		    nutri_bis.draw_bar_charts_nutriscore(dm_bis);
        		});
	        }
	    });

        countryGroup.selectAll("circle").on("mouseover", function(d) {
            var line_data = [
	        {"x":minNbProd , "y":d.prodCategories.length},
	        {"x":d.products.length , "y":d.prodCategories.length},
	        {"x":d.products.length , "y":0}
            ];
            var line_function = d3.line()
	        .x(function(d){return x(d.x)})
	        .y(function(d){return y(d.y)});
            
            countryGroup
	        .append("path")
	        .attr("d", line_function(line_data))
	        .attr("stroke", "black")
                .attr("stroke-width", 2)
	        .attr("class", "line dashed")
	        .attr("fill", "none");
            
            if(!selectCountry) legend.notify(true,d3.select(this).attr("r"));
        });

	    countryGroup.selectAll("circle").on("mouseout", function(d) {
            countryGroup.selectAll("path").remove();
            if(!selectCountry) legend.notify(false);
        });
    };

    count_graph.notify = function (dm){
        count_graph.svg.selectAll(".country-dot").remove();
        count_graph.svg.selectAll(".axis--x_country").remove();
        count_graph.svg.selectAll(".axis--y_country").remove();
        dm.get_data_country_graph(function (countries){
            d3.csv("../csv/continent-countries.csv", function(error, data) {
		if(error) throw error;
                var targetCountries = [];
                countries.forEach(function(d){
                    var tmp = {};
                    tmp.Country = d.Country;
		    tmp.products = d.products;
		    tmp.prodCategories = d.prodCategories;
                    for (var i = 1; i<data.length; i++){
                        if(data[i].Country.toLowerCase() == d.Country){
                            tmp.Continent = data[i].Continent; 
                        }
                    }
                    if(dm.accept(tmp)){
                        targetCountries.push(tmp);
                    }
                });
                count_graph.drawCountryGraph(targetCountries, dm);
            });
        });
    };
    
    count_graph.initCountryGraph = function (dm){
        count_graph.notify(dm);
    };

    return count_graph;
}
