function drawCountryGraph(countryMap) {
	var graphPosition = { top: 0, left: 0 };
	var cellMaxSize = 100;

	var width = 700;
	var height = 400;
	var margin = { left: 40, right: 0, top: 10, bottom: 10 };
	var innerWidth = width - margin.left - margin.right;
	var innerHeight = height - margin.top - margin.bottom;

	var maxNbProd = 100;
	var maxNbCat = 50;

	for (var country in countryMap) {
   		var products = countryMap[country].products;
   		var prodCategories = countryMap[country].prodCategories;

   		maxNbProd = d3.max([maxNbProd, products.length]);
   		maxNbCat = d3.max([maxNbCat, prodCategories.length]);
   	}

	maxNbProd += maxNbProd / 4;
	maxNbCat += maxNbCat / 4;

	var x = d3.scaleLog().domain([20, maxNbProd]).range([0, innerWidth]);
	var xAxis = d3.axisBottom(x);

	var y = d3.scaleLinear().domain([0, maxNbCat]).range([innerHeight, 0]);
	var yAxis = d3.axisLeft(y);

	var g = d3.select("#viz").append("g")
		.attr("class", "country-graph")
		.attr("transform", "translate(" + graphPosition.left + "," + graphPosition.top + ")");

	g.append("g")
		.attr("transform", "translate(" + margin.left + ", " + (height - margin.bottom) + ")")
   		.call(xAxis);

    g.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    var countryGroup = g.append("g")
    				.attr("transform", "translate(" + margin.left + ", " + margin.top + ")" );

   	for (var country in countryMap) {
   		var products = countryMap[country].products;
   		var prodCategories = countryMap[country].prodCategories;

   		var nbNutriA = products.filter(o => "a" == o.grade.toLowerCase()).length;

   		var propNutriA = nbNutriA / products.length;

  		countryGroup.append("circle")
			.attr("r", cellMaxSize * propNutriA)
			.attr("cx", x(products.length))
			.attr("cy", y(prodCategories.length))
			.append("svg:title")
				.text(country);	
	}
}

function initCountryGraph() {
	d3.tsv("../tsv/hypotesis.tsv", function(error, data) {
		if(error) throw error;

		var products = data.filter(
			o => o.Continent.toLowerCase() === filter.continent.toLowerCase());

		var countries = products.map(function(o) { return o.Country; });
		countries = Array.from(new Set(countries));

		var countryMap = {};
		for (var i = 0; i < countries.length; i++) {
			var countryName = countries[i];
			var country = countryMap[countryName] || {};

			var countryProds = products.filter(o => o.Country.toLowerCase() === countryName.toLowerCase());

			var prodCategories = countryProds.map(function(o) { return o.Categorie; });
			prodCategories = Array.from(new Set(prodCategories));

			country.products = countryProds;
			country.prodCategories = prodCategories;

			countryMap[countryName] = country;
		}

		drawCountryGraph(countryMap);
	});
}
