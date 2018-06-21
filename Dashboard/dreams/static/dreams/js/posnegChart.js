// Global variables:

var margin = {top: 20, right: 100, bottom: 40, left: 50},
width = document.getElementById("posneg_chart").clientWidth - margin.right
height = 180;

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


var svg = d3.select("#posneg_chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let positives = 0;
let negatives = 0;
let neutrals = 0;
let pos_counts = [0, 0, 0, 0, 0];
let neg_counts = [0, 0, 0, 0, 0];
let pos_width = 0;
let neg_width = 0;
let pos_colors = ['#A3F7D0', '#7AC9A4', '#519C79', '#286F4E', '#004223'];

let neg_colors = ['#FFA3A3', '#CF7A7A', '#A05151', '#712828', '#420000'];

let current_pos_col_idx = -1;
let current_neg_col_idx = -1;
let idx_legend = 0;
let temp1 = -80;
let temp2 = -80;
let showing = false;
var positive_corpus = '';
var negative_corpus = '';
var neutral_corpus = '';





// Variable envoyée par le code Rastel
var posneg = [8, 40, 153, 730, 5239, 888, 8109, 1585, 299, 47, 14];
// Get total count
var total_count = 0;
for (var i = 0; i < posneg.length; i++){
  total_count += posneg[i]
  if(i < 5){
    negatives += posneg[i]
  }else if (i > 5) {
    positives += posneg[i]
  }
};
var total_ticks = ['Extremely negative', 'Very negative', 'Negative', 'Quite negative','Rather negative',
'Neutral', 'Rather positive', 'Quite positive', 'Positive', 'Very positive', 'Extremely positive']
var pos_ticks = ['Rather positive', 'Quite positive', 'Positive', 'Very positive', 'Extremely positive'];
var neg_ticks = ['Rather negative', 'Quite negative', 'Negative', 'Very negative', 'Extremely negative'];

// Building Data
var total_data = [];
for (var i = 0; i < posneg.length; i++){
  if(i <= 4){
    total_data.push({ "name": "negative",
      "value": (posneg[(4-i)] / total_count) * 100,
      "whole_count": negatives,
      "range": total_ticks[(4-i)],
      "range_count": posneg[(4-i)]})

  } else if (i == 5) {
    total_data.push({ "name": "neutral",
      "value": (posneg[i] / total_count) * 100,
      "whole_count": posneg[i],
      "range": total_ticks[i],
      "range_count": posneg[i]})
  } else{
    total_data.push({ "name": "positive",
      "value": (posneg[i] / total_count) * 100,
      "whole_count": positives,
      "range": total_ticks[i],
      "range_count": posneg[i]})
  }
};
console.log(total_data)
// Domain of x axis
x.domain([0, 100]);

// Domain of y axis
y.domain(total_data.map(function(total_data) { return total_data.name; }));

// Create rectangles
svg.selectAll("rect")
.data(total_data)
.enter()
.append("rect")
.attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })

//x depend on polarity class
.attr("x", function(d) {

  if(d.name == 'positive'){
    let pos_width2 = pos_width
    pos_width = pos_width + d.value
    return x(pos_width2)
  } else if (d.name == 'negative') {
    let neg_width2 = neg_width
    neg_width = neg_width + d.value

    return x(neg_width2)

  } else {
    return x(0)
  };
})
.attr("y", function(d) { return y(d.name);})
.attr("width", function(d) { return Math.abs(x(d.value) - x(0));  })
.attr("height", y.rangeBand())

// color depend on polarity
.attr("fill", function(d) {
  if(d.name == 'positive'){
    current_pos_col_idx = current_pos_col_idx + 1
    return pos_colors[current_pos_col_idx]
  }
  else if(d.name == 'negative') {
    current_neg_col_idx = current_neg_col_idx + 1
    return neg_colors[current_neg_col_idx]
  } else {
    return '#c6c6c6'
  }
})
.on("mouseover", function(d){
  if(showing == false){
    d3.select(this)//.style("fill", "rgba(145, 0, 0, 0.4)")
    if(d.name == 'positive'){
      return tooltip.style("visibility", "visible")
      .html("<b>Total " + d.name + " count:</b> " + d.whole_count + ' ('+Math.round(d.whole_count / total_count * 100)+'%)'
      + "<br/><b>" +
      d.range + ' : </b>' + d.range_count +' (' + Math.round(d.range_count / d.whole_count * 100) + '% of all positives)')
    } else if (d.name =='negative') {
      return tooltip.style("visibility", "visible")
      .html("<b>Total " + d.name + " count:</b> " + Math.abs(d.whole_count) + ' ('+Math.round(Math.abs(d.whole_count) / total_count * 100)+'%)'
      + "<br/><b>" +
      d.range + ' : </b>' + Math.abs(d.range_count) +' (' + Math.round(Math.abs(d.range_count) / Math.abs(d.whole_count) * 100) + '% of all negatives)')
    } else {
      return tooltip.style("visibility", "visible").html("<b>Total neutrals count: </b>" + d.whole_count + ' (' + Math.round(d.whole_count/total_count*100) + '%)')
    }


  };
})
.on("mousemove", function() {
  return tooltip.style("top", (d3.event.pageY)+"px")
  .style("left",(d3.event.pageX+10)+"px");
})
.on("mouseout", function() {
  d3.select(this)
  return tooltip.style("visibility", "hidden").text('');
});

// adding axis X and Y
svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);

svg.append("g")
.attr("class", "y axis")
.attr("transform", "translate(" + x(0) + ",0)")
.call(yAxis);


// Legend
var legendRectlength = 75;
var legendRectheight = 20;
var legendSpacing = 4;


// Legend for positive:
var legends_pos = d3.select("#posneg_chart").append("svg")
.attr("width", 450)//width + margin.left + margin.right - 110
.attr("height",50)
.append("g")
.attr("transform", "translate(" + margin.left + "," + 0 + ")");

var legend_pos = legends_pos.selectAll('.legend')
.data(total_data.filter(function(d){ return d.name == 'positive'; }))
.enter()
.append('g')
.attr('class', 'legend_pos');

legend_pos.append('rect')
.attr('x', function(){
  temp1 += legendRectlength;
  return(x(0) + temp1)
})
.attr('y', 0)
.attr('width', legendRectlength)
.attr('height', legendRectheight)

.style('fill', function(d, i){
  if(d.name == 'positive'){
    return pos_colors[i]
  }
})
var x_legend = d3.scale.linear()
.range([x(0) - 5, x(0) +5 * legendRectlength])
console.log(x(0))

var legendAxis_pos = d3.svg.axis()
.scale(x_legend)
.orient("bottom")
.ticks(5)
.tickSubdivide(1)
.tickSize(0, 0, 0)
.tickFormat(function(d, i){ return pos_ticks[i] });

legends_pos.append("g")
.attr("class", "axisLegend")
.attr("transform", "translate(" + legendRectlength / 2 + "," + legendRectheight + ")")
.call(legendAxis_pos)
.style("color", 'white');

legends_pos.selectAll('.tick').style('color', 'black');


// Legend for negative
var legends_neg = d3.select("#posneg_chart").append("svg")
.attr("width", 450)
.attr("height",50)
.append("g")
.attr("transform", "translate(" + margin.left + "," + 0 + ")");

var legend_neg = legends_neg.selectAll('.legend')

.data(total_data.filter(function(d){ return d.name == 'negative'; }))
.enter()
.append('g')
.attr('class', 'legend_neg')

legend_neg.append('rect')
.attr('x', function() {
  temp2 += legendRectlength
  return (x(0) + temp2);
})
//.attr('y', 40)
.attr('width', legendRectlength)
.attr('height', 20)
.style('stroke-width', 2)
.style('fill', function(d, i){
  if(d.name == 'negative'){
    //console.log(neg_colors[i])
    return neg_colors[i]
  }
});

var legendAxis_neg = d3.svg.axis()
.scale(x_legend)
.orient("bottom")
.ticks(5)
.tickSubdivide(1)
.tickSize(0, 0, 0)
.tickFormat(function(d, i){ return neg_ticks[i] });
legends_neg.append("g")
.attr("class", "axisLegend")
.attr("transform", "translate(" + legendRectlength / 2 + "," + legendRectheight + ")")
.call(legendAxis_neg)
.style("color", 'white');

legends_neg.selectAll('.tick').style('color', 'black');

x_legend.domain([0, 1.0]);


var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("opacity", "0.8")
        .style("padding","10px")
        .style("border-radius","2px")
        .style("background-color", "black")
        .style("color", "white")
        .style("font-family", "Helvetica");
