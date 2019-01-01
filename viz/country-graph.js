function drawCountryGraph(products) {
	var graphPosition = { top: 200, left: 0 };

	var width = 700;
	var height = 400;
	var margin = { left: 40, right: 0, top: 10, bottom: 10 };
	var innerWidth = width - margin.left - margin.right;
	var innerHeight = height - margin.top - margin.bottom;

	var maxNbProd = 10000;
	var maxNbCat = 10000;

	var x = d3.scaleLinear().domain([0, maxNbProd]).range([0, innerWidth]);
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
}

function initCountryGraph() {
	drawCountryGraph([]);
}
