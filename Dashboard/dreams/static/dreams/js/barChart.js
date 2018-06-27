

function draw_barchart(data_bar){

  var margin_bar = {top: 20, right: 50, bottom: 70, left: 30},
      width_bar = 350 - margin_bar.left - margin_bar.right,
      height_bar = 220 - margin_bar.top - margin_bar.bottom;


  var x_bar = d3.scale.ordinal().rangeRoundBands([0, width_bar], .05);

  var y_bar = d3.scale.linear().range([height_bar, 0]);

  var xAxis_bar = d3.svg.axis()
      .scale(x_bar)
      .orient("bottom");

  var yAxis_bar = d3.svg.axis()
      .scale(y_bar)
      .orient("left")
      .ticks(10);

  var svg_bar = d3.select("#bar_chart").append("svg")
      .attr("width", width_bar + margin_bar.left + margin_bar.right)
      .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin_bar.left + "," + margin_bar.top + ")");

  x_bar.domain(data_bar.map(function(d) { return d.word; }));
  y_bar.domain([0, d3.max(data_bar, function(d) { return d.freq; })]);

  svg_bar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_bar + ")")
      .call(xAxis_bar)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx","-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  // svg_bar.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis_bar)
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Value ($)");

  svg_bar.selectAll("bar")
      .data(data_bar)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x_bar(d.word); })
      .attr("width", x_bar.rangeBand()-10)
      .attr("y", function(d) { return y_bar(d.freq); })
      .attr("height", function(d) { return height_bar - y_bar(d.freq); });
}

function redraw_barchart(data_bar){

  console.log("BARCHART", data_bar);

  var svg_bar = d3.select("#bar_chart")

  // svg_bar.select("svg").selectAll("*").remove();
  svg_bar.selectAll("*").remove();

  var margin_bar = {top: 20, right: 50, bottom: 70, left: 30},
      width_bar = 350 - margin_bar.left - margin_bar.right,
      height_bar = 220 - margin_bar.top - margin_bar.bottom;


  var x_bar = d3.scale.ordinal().rangeRoundBands([0, width_bar], .05);

  var y_bar = d3.scale.linear().range([height_bar, 0]);

  var xAxis_bar = d3.svg.axis()
      .scale(x_bar)
      .orient("bottom");

  var yAxis_bar = d3.svg.axis()
      .scale(y_bar)
      .orient("left")
      .ticks(10);

  svg_bar = svg_bar.append("svg")
      .attr("width", width_bar + margin_bar.left + margin_bar.right)
      .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin_bar.left + "," + margin_bar.top + ")");

  x_bar.domain(data_bar.map(function(d) { return d.word; }));
  y_bar.domain([0, d3.max(data_bar, function(d) { return d.freq; })]);

  svg_bar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_bar + ")")
      .call(xAxis_bar)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx","-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  // svg_bar.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis_bar)
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Value ($)");

  svg_bar.selectAll("bar")
      .data(data_bar)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x_bar(d.word); })
      .attr("width", x_bar.rangeBand()-10)
      .attr("y", function(d) { return y_bar(d.freq); })
      .attr("height", function(d) { return height_bar - y_bar(d.freq); });
}
