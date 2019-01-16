function create_popup(div, height, width, callback){

    div.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px");

    callback(div);
}
