function data_manager(){
    var dm = {};
    dm.filter = {
	WORLD:0,
	CONTINENT:1,
	COUNTRY:2
    };
    dm.filter_grade = false;
    dm.choosen_filter = dm.filter.WORLD;
    dm.choosen_region = "africa";
    dm.choosen_country = "france";
    dm.choosen_grade = "A";
    dm.accept = function(value){
	var b = true;
	switch(dm.choosen_filter){
        case dm.filter.WORLD:
	    b = b & true;
	    break;
        case dm.filter.COUNTRY:
            b = b & (value.Country == dm.choosen_country); 
	    break;
	case dm.filter.CONTINENT:
            b = b & (value.Continent == dm.choosen_region); 
	    break;
	}
	
	if(dm.filter_grade){
	    b = b & (value.grade == dm.choosen_grade); 
	}
	
        return b;
    };
    
    dm.get_data_nutriscore = function(callback){
        var data_to_populate = [
            {grade:"a", count:0.0},
            {grade:"b", count:0.0},
            {grade:"c", count:0.0},
            {grade:"d", count:0.0},
            {grade:"e", count:0.0}
        ];
        d3.tsv("../tsv/hypotesis.tsv", function(error, data){
            if(error) throw error;
            var tmp = {
                "a":0,
                "b":1,
                "c":2,
                "d":3,
                "e":4,
            };
            
            for (var i = 1; i<data.length; i++){
                
                if(dm.accept(data[i])){
                    var idx = tmp[data[i].grade];
                    var v = data_to_populate[idx].count;
                    data_to_populate[idx].count = (v + 1);
                }
            }
            callback(data_to_populate);
        });
    };

    dm.get_data_country_graph = function(callback)  {
	d3.tsv("../tsv/hypotesis.tsv", function(error, data) {
	    if(error) throw error;

	    var products = data;
            
	    var countries = products.map(function(o) { return o.Country; });
	    countries = Array.from(new Set(countries));

            
	    var targetCountries = [];
	    for (var i = 0; i < countries.length; i++) {
		var countryName = countries[i];

		var countryProds = products.filter(o => o.Country.toLowerCase() === countryName.toLowerCase());

		var prodCategories = countryProds.map(function(o) { return o.Categorie; });
		prodCategories = Array.from(new Set(prodCategories));

		var country = {};
		country.Country = countryName;
		country.products = countryProds;
		country.prodCategories = prodCategories;
                targetCountries.push(country);
	    }
            callback(targetCountries);
	});
    };
    
    dm.get_data_map = function(callback){
        d3.json("../json/continents.json" , function(error, world){
            callback(world);
        });
    };
    
    dm.get_data_piechart = function(callback){
    	
    	var chosenFilter = "northAmerica";
    	
	
    	d3.tsv("../tsv/hypotesis.tsv", function(error, data) {
    	    if(error) throw error;

	    function countBy(collection, col) {
		var object = Object.create(null);
		var arr = [];
		var a=0;
		collection.forEach(function(e) {
		    k = e[col];
		    if (k in object) { arr[object[k]].value++; }
		    else {
			object[k] = a++;
			arr.push({key:k, value:1});
		    }
		});
		return arr;
	    }
	    
	    var filtData = [] = data.filter(entry => dm.accept(entry));		// Filtering
	    var countData = countBy(filtData, 'Categorie');								// Counting the number of products for each category
	    countData.sort(function(a, b){return b.value-a.value});
	    callback (countData);
	});
	
    }
    
    dm.copy = function(){
	var other = data_manager();
	other.filter_grade=dm.filter_grade;
	other.choosen_filter=dm.choosen_filter;
	other.choosen_region=dm.choosen_region;
	other.choosen_country=dm.choosen_country;
	other.choosen_grade=dm.choosen_grade;
	return other;
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

function color_continent(continent){
    switch(continent){
    case '': return "black";
    case 'asia': return d3.rgb( 231, 76, 60 );
    case 'africa': return d3.rgb( 142, 68, 173 );
    case 'europe': return d3.rgb( 52, 152, 219 );
    case 'northAmerica': return d3.rgb( 69, 179, 157 );
    case 'oceania': return d3.rgb(45, 176, 65);
    case 'southAmerica': return d3.rgb(165,42,42);
    };
}

