function draw_tsne() {

	svg.append("g")
	 .selectAll("circle")
	 .data(dataset)
	 .enter()
	 .append("circle")
	 .attr("cx",(d) => x(d.x_coord))
	 .attr("cy",(d) => y(d.y_coord))
	 .attr("r", (d) => (d.opacity * 2 - 0.2) )
	 .style("opacity", 1)//(d) => (d.opacity))
	 .style("fill", set_color)
	 .on("mouseover", handleMouseOver)
	 .on("mousemove",  function(d) {return handleMouseMove(d3v4.event.pageX, d3v4.event.pageY, d.word,  d.tag, d.count, d.frequence)})
	 .on("mouseout", handleMouseOut);
}


function draw_legend() {
	var leg_svg = d3v4.select("#tsne_chart")
									.append('svg')
									.attr("width", leg_w + 500)
									.attr("height", 35)
									.append("g")
									.attr("transform", "translate(0,0)");

	var legend = leg_svg.selectAll(".legend")
				.data(tabeau_legendes)
				.enter().append("g")
				.attr("class", "leg")
				.style("font-family", "sans-serif");

	legend.append("circle")
				.attr("cx", function(d, i) {
					if(i<3){
						return 10 + i * 100;
					}
					else{
						return 10 + (i-3) * 100;
					}
				})
				.attr("cy", function(d, i) {
					if(i<3){
						return 10;
					}
					else{
						return 25;
					}
				})
				.attr("r", 4)
				.style("opacity", 0.6)
				.style("fill", function(d, i) { return d.color; })
				.on("mouseover", handleMouseOver_legend)
				.on("mouseout", handleMouseOut_legend);

	legend.append("text")
				.attr("x", function(d, i) {
					if(i<3){
						return 15 + i * 100;
					}
					else{
						return 15 + (i-3) * 100;
					}
				})
				.attr("dy", function(d, i) {
					if(i<3){
						return 15;
					}
					else{
						return 30;
					}
				})
			.text(function(d, i) { return d.type; })
			.style("opacity", 1)
			.on("mouseover", handleMouseOver_legend)
			.on("mouseout", handleMouseOut_legend);

}

function handleMouseOver_legend(d, i) {
	d3v4.select(this)
		.transition()
		.duration(100)
    .attr('r', 2)
		.style("opacity", 1)
}

function handleMouseOut_legend(){
	d3v4.select(this)
		.transition()
    .duration(100)
    .attr('r', 1)
		.style("opacity", 0.8)
}

function handleMouseOver(d, i) {
	// d3v4.select(this)
	// 	.transition()
  //   .duration(100)
  //   .attr('r', 2)
	// 	.attr("width", 8)
	// 	.attr('height', 8)

	return tooltip_tsne.style("visibility", "visible")
										.html(d.word + "<br/><b>"
										+ "Pos tag : " + d.tag + "<br/><b>"
										+ "Occurence in dreams : " + d.count + "<br/><b>"
									  + "Frequence in dreams : " + d.frequence).style("color", "white")
}

function handleMouseMove(x, y, word, postag, count, frequence){
	div_popup.transition()
					 .duration(50)
					 .style("width", "100px")
					 .style("height", "50px")
					 .style("opacity", .9);
	div_popup.html(word + "<br/><b>Tag:</b> " + postag + "<br/><b>Count</b>: " + count)
					 .style("left", x + "px")
					 .style("top", y + "px");
}

function handleMouseOut(){
	// d3v4.select(this)
	// 	.transition()
  //   .duration(100)
  //   .attr('r', 2);

	div_popup.transition()
					 .duration(500)
					 .style("height", 0)
					 .style("opacity", 0);
}

function make_word_bigger (d) {
	d3v4.select(this)
	if (d.word == on_word) {
		return 10;
	} else {
		return 2;
	}
}

// function set_color (d){
// 	  d3v4.select(this)
//     if (d.tag == "Noun") {
//       return "#009b31"; // green
//     } else if (d.tag == "Verb") {
//       return "#392759"; // purple
//     } else if (d.tag == "Adverb"){
// 			return "A63446"; // rouge
// 		} else if (d.tag == "Adjective"){
// 			return "#6874E8"; // blue
// 		} else if (d.tag == "Other"){
// 			return "F7ACCF"
// 		} else if (d.tag == "Proper Noun"){
// 			return "#702e2e" // Proper
// 		}
// }

function set_color (d){
	  d3.select(this)
    if (d.tag == "Noun") {
      return "#1982C4"; // Blue
    } else if (d.tag == "Verb") {
      return "#966CD1"; // purple
    } else if (d.tag == "Adverb"){
			return "#FF595E"; // rouge
		} else if (d.tag == "Adjective"){
			return "#8AC926"; // green
		} else if (d.tag == "Other"){
			return "#797c7a" // TO DO
		} else if (d.tag == "Proper Noun"){
			return "#FFCA3A" // yellow
		}
}
