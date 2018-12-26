function data_manager(){
    var dm = {};
    dm.filter = {
	WORLD:0,
	REGION:1
    };
    dm.choosen_filter = dm.filter.WORLD;
    dm.choosen_region = "Europe";
    dm.accept = function(row){
	return true;
    };
    dm.load = function(){
	dm.load_histo_grade_data();
    }
    return dm;
}

function color_nutriscore_grade(grade){
    switch(grade) {
    case '':  return d3.rgb(191, 191, 191);
    case 'a': return d3.rgb(  0, 191,   0);
    case 'b': return d3.rgb(115, 255,   0);
    case 'c': return d3.rgb(255, 204,   0);
    case 'd': return d3.rgb(255, 102,   0);
    case 'e': return d3.rgb(255,  25,   0);
    };
}
