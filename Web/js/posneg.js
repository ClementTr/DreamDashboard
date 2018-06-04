//alert("Hello, france!");
var margin = {top: 20, right: 30, bottom: 40, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0)
    .tickPadding(6);


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let positives = 0;
let negatives = 0;
let neutrals = 0;


//console.log("Hello World")


// Load dataset
d3.csv("data/dreams_pol.csv", function(error, data) {
  // x.domain(d3.extent(data, function(d) { return d.value; })).nice();
  // y.domain(data.map(function(d) { return d.name; }));
  data.forEach(function(d) {
    // calc percentages
    dream_number = +d.dream_number;
    name_p = +d.name;
    date = +d.date;
    word_count = +d.word_count;
    dream_txt = +d.dream_txt;
    clean_text = +d.clean_text;
    pol_value = +d.pol_value;
    polarity = +d.polarity;
    if(pol_value > 0){
      positives = positives + 1
    }
    else if (pol_value < 0) {
      negatives = negatives - 1
    }
    else {
      neutrals = neutrals + 1
    }
  });
  var total_data = [{
    "name": "positive",
    "value": positives},
    {
      "name": "neutral",
      "value": neutrals
    },
    {
      "name": "negative",
      "value": negatives
    }];
    console.log(total_data);

    x.domain(d3.extent(total_data, function(total_data) { return total_data.value; })).nice();
    y.domain(total_data.map(function(total_data) { return total_data.name; }));

  svg.selectAll(".bar")
      .data(total_data)
      .enter().append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
      .attr("x", function(d) {return x(Math.min(0, d.value)); })
      .attr("y", function(d) { return y(d.name);})
      .attr("width", function(d) { return Math.abs(x(d.value) - x(0));  })
      .attr("height", y.rangeBand());

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .call(yAxis);
});
