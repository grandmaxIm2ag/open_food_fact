function piechart(){

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];



            var w = 500;
            var h = 100;

           var svg = d3.select("body")
               .append("svg")
               .attr("width", w)
               .attr("height", h)

           svg.selectAll("rect")
               .data(dataset)
               .enter()
               .append("rect")
               .text(function(d){
                   return d;
               })
               .attr("x", function(d, i){
                   return i * 21;
               })
               .attr("y", 0)
               .attr("width", 20)
               .attr("height", 100)

/*        
    var arcs = vis.selectAll("path")
    	.data(pie)
    	.enter()
    		.append("g")
    			.attr("class", "slice")
    		.append("path")
    			.attr('d', arc)
    			.attr('fill', function(d, i) { return color(i); });
        	.append("text")
        		.attr("transform", function(d) {
        			d.innerRadius = 0;
        			d.outerRadius = radius;
        			return "translate(" + arc.centroid(d) + ")";
        		})
        		.attr("text-anchor", "middle")
        		.text(function(d, i) { return i; });
*/
}

