function init() {
    var dm = data_manager();
    var nutri = nutriscore();
    var count_graph = country_graph();
    var Observer=[nutri, count_graph];
    
    draw_wordlmap(dm,Observer);
	nutri.draw_bar_charts_nutriscore(dm);
	count_graph.initCountryGraph(dm);

}

init();
