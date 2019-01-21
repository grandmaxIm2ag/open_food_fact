function worldmap(obs, svg){
    var worldmap = {};
    worldmap.obs = obs;
    worldmap.obs.push(worldmap);
    var graphPosition = { top: 0, left: 730 };
    var margin = { top: 20, right: 20, bottom: 30, left: 20};
    var width = 400 - margin.left - margin.right;
    var height = 330 - margin.top - margin.bottom;

    worldmap.path = d3.geoPath();
    
    worldmap.projection = d3.geoEquirectangular()
        .scale(45)
        .translate( [width / 2, height / 3]);

    worldmap.path.projection(worldmap.projection);        
    worldmap.svg = svg.append("g")
        .attr("id", "svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" +
              (graphPosition.left +margin.left) + "," +
              (graphPosition.top + margin.top) + ")");
    
    worldmap.draw = function (world, dm){
        worldmap.svg
            .selectAll("path")
            .attr("class", "continent")
            .data(world.features)
	    .enter()
	    .append("path")
	        .style("opacity", function(d){
	            if(dm.choosen_filter == dm.filter.CONTINENT &&
		           dm.choosen_region != d.properties.continent){
		            return 0.2;
	            }else if (dm.choosen_filter == dm.filter.CONTINENT){
		            return 1.0;
	            }else{
		        return 0.7;
	            }
		})
	
	    .style("fill", function(d) { return color_continent
                                         (d.properties.continent); })
            .style("stroke", "none")
            .attr("d", worldmap.path)
            .on("mouseover", function(d){
                d3.select(this).style("stroke", "black");
            })
            .on("mouseout", function(d){
                d3.select(this).style("stroke", "none");
            })
            .on("click", function(d){
		if(dm.choosen_filter == dm.filter.CONTINENT && dm.choosen_region
		   == d.properties.continent){
		    dm.choosen_filter = dm.filter.WORLD;
		}else if(dm.choosen_filter == dm.filter.CONTINENT){
		    dm.choosen_filter = dm.filter.CONTINENT;
		    dm.choosen_region = d.properties.continent;
		}else{
		    dm.choosen_filter = dm.filter.CONTINENT;
		    dm.choosen_region = d.properties.continent;
		}
		worldmap.svg.selectAll("path").remove();
		worldmap.notifyAll(worldmap.obs, dm);
            })
	return worldmap.svg;
    }

    worldmap.notify = function(dm){
	//dm.get_data_map(function(world) {
        worldmap.draw(worldmap.world, dm);
	//});
    }

    worldmap.draw_worldmap = function(dm){
	dm.get_data_map(function(world) {
	    worldmap.world = world;
	    worldmap.notify(dm);
	});
    }
    worldmap.notifyAll = function(obs, dm) {
	obs.forEach(function(o){
            o.notify(dm);
	});
    }

    return worldmap;
};
