function draw() {
	svg.append("g")
	 .selectAll("circle")
	 .data(dataset)
	 .enter()
	 .append("circle")
	 .attr("cx",(d) => x(d.x_coord))
	 .attr("cy",(d) => y(d.y_coord))
	 .attr("r", make_word_bigger)
	 .style("opacity", (d) => (d.opacity))
	 .style("fill", set_color)
	 .on("mouseover", handleMouseOver)
	 .on("mousemove", handleMouseMove)
	 .on("mouseout", handleMouseOut);
	}

function draw_legend() {
	var leg_svg = d3v4.select("#tsne_chart")
									.append('svg')
									.attr("width", leg_w)
									.attr("height", leg_h)
									.append("g")
									.attr("transform", "translate(0,0)");

	var legend = leg_svg.selectAll(".legend")
				.data(tabeau_legendes)
				.enter().append("g")
				.attr("class", "leg")
				.style("font-family", "sans-serif");

	legend.append("circle")
				.attr("cx",10)
				.attr("cy",function(d, i) { return 10 + i * 20; })
				.attr("r", 4)
				.style("opacity", 0.6)
				.style("fill", function(d, i) { return d.color; })
				.on("mouseover", handleMouseOver_legend)
				.on("mouseout", handleMouseOut_legend);

	legend.append("text")
			.attr("x", 20)
			.attr("dy", function(d, i) { return 15 + i * 20; })
			.text(function(d, i) { return d.type; })
			.style("opacity", 1)
			.on("mouseover", handleMouseOver_legend)
			.on("mouseout", handleMouseOut_legend);

/*	legend.on("click", function(type){
		d3.selectAll(".legend")
            .style("opacity", 0.2);
		d3.select(this)
		        .style("opacity", 1);
	})
*/
}

function handleMouseOver_legend(d, i) {
	d3v4.select(this)
		.transition()
    .duration(500)
    .attr('r',6)
		.style("opacity", 1)
}

function handleMouseOut_legend(){
	d3v4.select(this)
		.transition()
    .duration(500)
    .attr('r',4)
		.style("opacity", 0.8)
}

function handleMouseOver(d, i) {
	d3v4.select(this)
		.transition()
    .duration(500)
    .attr('r',6)

	return tooltip.style("visibility", "visible")
										.html(d.word + "<br/><b>"
										+ "Pos tag : " + d.tag + "<br/><b>"
										+ "Occurence in dreams : " + d.count + "<br/><b>"
									  + "Frequence in dreams : " + d.frequence).style("color", "white")
}

function handleMouseMove(){
	return tooltip.style("top", (d3v4.event.pageY-50)).style("left", (d3v4.event.pageX+ 20))
}

function handleMouseOut(){
	d3v4.select(this)
		.transition()
    .duration(500)
    .attr('r',2)
	return tooltip.style("visibility", "hidden")
}

function make_word_bigger (d) {
	d3v4.select(this)
	if (d.word == on_word) {
		return 10;
	} else {
		return 2;
	}
}

function set_color (d){
	  d3v4.select(this)
    if (d.tag == "Noun") {
      return "#009b31"; // green
    } else if (d.tag == "Verb") {
      return "#c300ff"; // purple
    } else if (d.tag == "Adverb"){
			return "#ff0000"; // rouge
		} else if (d.tag == "Adjective"){
			return "#0008ff"; // blue
		} else if (d.tag == "Other"){
			return "#f4df41"
		}
}
