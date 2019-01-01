
var filter = {
	continent: 'europe'
};

function init() {
    var dm = data_manager();
    var nutri = nutriscore();
    
    var Observer=[nutri];
    
    draw_wordlmap(dm,Observer);
	nutri.draw_bar_charts_nutriscore(dm);
	initCountryGraph();

}

init();
