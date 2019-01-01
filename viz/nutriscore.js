function draw_bar_charts_nutriscore(){
    var svg = d3.select("body"),
	margin = { top: 0, right: 0, bottom: 0, left: 0 },
	x = d3.scaleBand().padding(0.1),
	y = d3.scaleLinear();

    var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
	.attr("class", "axis axis--x");

    g.append("g")
	.attr("class", "axis axis--y");

    g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
    /*.text("Count of Product")*/;

    function draw() {

	var dm = data_manager();
	d3.tsv("../tsv/hypotesis.tsv", function(error, data){
	    if(error) throw error;

	    data_to_update = [
		{grade:"a", count:0.0},
		{grade:"b", count:0.0},
		{grade:"c", count:0.0},
		{grade:"d", count:0.0},
		{grade:"e", count:0.0}
	    ];
	    
	    var tmp = {
		"a":0,
		"b":1,
		"c":2,
		"d":3,
		"e":4,
	    };
	    for(var i = 1; i<data.length; i++){
		idx = tmp[data[i].grade];
		var v = data_to_update[idx].count;
		data_to_update[idx].count = (v + 1);
	    }

	    x.domain(data_to_update.map(function (d) { return d.grade; }));
	    y.domain([0, d3.max(data_to_update.map(function (d) { return d.count; }))]);
	    
	    var width = 300 - margin.left - margin.right,
		    height = 200 - margin.top - margin.bottom;

	    x.rangeRound([0, width]);
	    y.rangeRound([height, 0]);

	    g.select(".axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	    
	    g.select(".axis--y")
		.call(d3.axisLeft(y));

	    // ENTER
	    g.selectAll(".bar")
		.data(data_to_update)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function (d) { return x(d.grade); })
		.attr("y", function (d) {
		    return y(d.count); })
		.attr("width", x.bandwidth())
		.attr("height", function (d) { return height - y(d.count); })
		.attr("fill", function(d) { return color_nutriscore_grade(d.grade); } );
	});
    }

    draw();
    return svg.node();
}
