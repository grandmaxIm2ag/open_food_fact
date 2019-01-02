function drawCountryGraph(countries) {
	var graphPosition = { top: 0, left: 40 };
	var cellMaxSize = 100;

	var width = 700;
	var height = 400;
	var margin = { left: 40, right: 0, top: 10, bottom: 10 };
	var innerWidth = width - margin.left - margin.right;
	var innerHeight = height - margin.top - margin.bottom;

	var maxNbProd = d3.max(countries.map(function(o) { return o.products.length; }));
	var maxNbCat = d3.max(countries.map(function(o) { return o.prodCategories.length; }));

	maxNbProd += maxNbProd / 5;
	maxNbCat += maxNbCat / 5;

	var x = d3.scaleLog().domain([5, maxNbProd]).range([0, innerWidth]);
	var xAxis = d3.axisBottom(x);

	var y = d3.scaleLinear().domain([0, maxNbCat]).range([innerHeight, 0]);
	var yAxis = d3.axisLeft(y);

	var g = d3.select("#viz").append("g")
		.attr("class", "country-graph")
		.attr("transform", "translate(" + graphPosition.left + "," + graphPosition.top + ")");

	g.append("g")
		.attr("transform", "translate(" + margin.left + ", " + (height - margin.bottom) + ")")
   		.call(xAxis);

   	g.append("text")             
      .attr("transform",
            "translate(" + (width / 2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Products");

    g.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (margin.left / 3))
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Categories");     

    var countryGroup = g.append("g")
    				.attr("transform", "translate(" + margin.left + ", " + margin.top + ")" );

   	countryGroup.selectAll("circle")
   		.data(countries)
   		.enter()
    	.append("circle")
    	.attr("r", function(d) { 
	    	var nbNutriA = d.products.filter(o => "a" == o.grade.toLowerCase()).length;
	   		var propNutriA = nbNutriA / d.products.length;
	    	return cellMaxSize * propNutriA;
	    })
	    .attr("cx", function(d) { return x(d.products.length); })
	    .attr("cy", function(d) { return y(d.prodCategories.length); })
	    .attr('fill-opacity', 0.4)
	    .append("svg:title")
				.text(function(d) { return d.name });

	// events
	countryGroup.selectAll("circle").on("click", function(country) {
       
    });
}

function initCountryGraph() {
	d3.tsv("../tsv/hypotesis.tsv", function(error, data) {
		if(error) throw error;

		var products = data;
		if (filter.continent) {
			products = data.filter(
			o => o.Continent.toLowerCase() === filter.continent.toLowerCase());
		}

		var countries = products.map(function(o) { return o.Country; });
		countries = Array.from(new Set(countries));

		var targetCountries = [];
		for (var i = 0; i < countries.length; i++) {
			var countryName = countries[i];

			var countryProds = products.filter(o => o.Country.toLowerCase() === countryName.toLowerCase());

			var prodCategories = countryProds.map(function(o) { return o.Categorie; });
			prodCategories = Array.from(new Set(prodCategories));

			var country = {};
			country.name = countryName;
			country.products = countryProds;
			country.prodCategories = prodCategories;
			
			targetCountries.push(country);
		}

		drawCountryGraph(targetCountries);
	});
}