function draw_wordlmap(dm, obs){
    var graphPosition = { top: -100, left:800 };
    var margin = { left: 40, right: 0, top: 00, bottom: 10};
    var width = 400 - margin.left - margin.right;
    var height = 330 - margin.top - margin.bottom;

    var path = d3.geoPath();
    
    var projection = d3.geoEquirectangular()
            .scale(55)
            .translate( [width / 2, height / 1.5]);

    path.projection(projection);        
    var svg = d3.select('#viz').append("svg")
            .attr("id", "svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", 'red')
            .attr("transform", "translate(" +
                  (graphPosition.left +margin.left) + "," +
                  (graphPosition.top + margin.top) + ")");
    
    function draw(world){
        svg.append("g")
            .attr("class", "continent")
            .selectAll("path")
            .data(world.features)
            .enter()
            .append("path")
            .style("fill", function(d) { return color_continent
                                         (d.properties.continent); })
            .attr("d", path)
            .on("click", function(d){
                dm.choosen_filter = dm.filter.CONTINENT;
                dm.choosen_region = d.properties.continent;
                notifyAll(obs, dm);
            })
            .on("keypress", function(d) {
                console.log("keypress"); // also tried "keyup", "keydown", "key"
            });
    }

    dm.get_data_map(function(world) {
        draw(world);
    });
    
    return svg;
};



function notifyAll(obs, dm) {
    obs.forEach(function(o){
        o.notify(dm);
    });
}
