function create_popup(div, height, width, callback){

    div.style("left", (d3.event.pageX-(width/2)) + "px")
        .style("top", (d3.event.pageY-(width/2)) + "px");

    callback(div);
}
