function init() {
    var svg = d3.select("#viz");
    var dm = data_manager();
    var nutri = nutriscore(svg);
    var count_graph = country_graph(svg);
    var Observer=[nutri, count_graph];
    var map = worldmap(Observer, svg);
    map.draw_worldmap(dm);
    nutri.draw_bar_charts_nutriscore(dm);
    count_graph.initCountryGraph(dm);

}

init();
