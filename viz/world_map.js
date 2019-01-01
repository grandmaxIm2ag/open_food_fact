function draw_wordlmap(){
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 400 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var path = d3.geoPath();
    
    var projection = d3.geoConicConformal()
            .scale(50)
            .translate( [width / 2, height / 1.5]);

    path.projection(projection);
    
    var svg = d3.select('body').append("svg")
            .attr("id", "svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", 'red');
    
    d3.json("continents.json" , function(error, world) {
        svg.append("g")
            .attr("class", "continent")
            .selectAll("path")
            .data(world.features)
            .enter()
            .append("path")
            .style("fill", function(d) { return color_continent
                                         (d.properties.continent); })
            .attr("d", path);
    });

    return svg;
}
