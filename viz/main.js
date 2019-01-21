function init() {
    var svg = d3.select("#viz");
    var dm = data_manager();
    var pc = piechart(svg);
    var nutri = nutriscore(svg);
    var legend = legendCircles(svg);
    var count_graph = country_graph(legend, svg);
    var Observer=[nutri, count_graph, pc];
    var map = worldmap(Observer, svg); 
    map.draw_worldmap(dm);
    nutri.draw_bar_charts_nutriscore(dm);
    count_graph.initCountryGraph(dm);
    pc.draw_pie_chart_categories(dm);
}

init();
