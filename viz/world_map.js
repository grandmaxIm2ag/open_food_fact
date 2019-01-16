function worldmap(obs, svg){
    var worldmap = {};
    worldmap.obs = obs;
    worldmap.obs.push(worldmap);
    var graphPosition = { top: 0, left:900 };
    var margin = { top: 20, right: 20, bottom: 30, left: 40};
    var width = 400 - margin.left - margin.right;
    var height = 330 - margin.top - margin.bottom;

    worldmap.path = d3.geoPath();
    
    worldmap.projection = d3.geoEquirectangular()
            .scale(55)
            .translate( [width / 2, height / 1.5]);

    worldmap.path.projection(worldmap.projection);        
    worldmap.svg = svg.append("svg")
            .attr("id", "svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", 'red')
            .attr("transform", "translate(" +
                  (graphPosition.left +margin.left) + "," +
                  (graphPosition.top + margin.top) + ")");
    
    worldmap.draw = function (world, dm){
        worldmap.svg.append("g")
            .attr("class", "continent")
            .selectAll("path")
            .data(world.features)
	    .enter()
	    .filter(
		function(d){
		    if(dm.choosen_filter == dm.filter.CONTINENT &&
		       dm.choosen_region != d.properties.continent){
			return false;
		    }else{
			return true;
		    }
		}
	    )
            .append("path")
            .style("fill", function(d) { return color_continent
                                         (d.properties.continent); })
            .attr("d", worldmap.path)
            .on("click", function(d){
		if(dm.choosen_filter == dm.filter.CONTINENT && dm.choosen_region
		   == d.properties.continent){
		    dm.choosen_filter = dm.filter.WORLD;
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
	dm.get_data_map(function(world) {
            worldmap.draw(world, dm);
	});
    }

    worldmap.draw_worldmap = function(dm){
	worldmap.notify(dm);
    }
    worldmap.notifyAll = function(obs, dm) {
	obs.forEach(function(o){
            o.notify(dm);
	});
    }

    return worldmap;
};
