function filter() {
	
}

function init() {
    var dm = data_manager();
    
    draw_wordlmap(dm);
	draw_bar_charts_nutriscore(dm);
	initCountryGraph();

}

init();
