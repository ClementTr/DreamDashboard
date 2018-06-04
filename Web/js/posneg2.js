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
let pos_counts = [0, 0, 0, 0, 0];
let neg_counts = [0, 0, 0, 0, 0];
let pos_width = 0;
let neg_width = 0;
let pos_colors = ['#A3F7D0', '#7AC9A4', '#519C79', '#286F4E', '#004223'];
/*['#F9A9A9', '#E89696', '#D88383', '#C87070', '#B85D5D',
                  '#A84B4B', '#983838', '#882525', '#781212', '#680000'];*/
let neg_colors = ['#FFA3A3', '#CF7A7A', '#A05151', '#712828', '#420000'];
/*['#c6e1d9', '#A8CDC2', '#8CB9AC', '#73A597', '#5D9182',
                  '#497E6E', '#376A5B', '#275648', '#1A4237', '#102f26'];*/
let current_pos_col_idx = -1;
let current_neg_col_idx = -1;
let idx_legend = 0;
let temp1 = -80;
let temp2 = -80;
let showing = false;
var positive_corpus = '';
var negative_corpus = '';
var neutral_corpus = '';
//console.log("Hello World")


// Load dataset
d3.csv("data/dreams_pol2.csv", function(error, data) {
  // x.domain(d3.extent(data, function(d) { return d.value; })).nice();
  // y.domain(data.map(function(d) { return d.name; }));

  data.forEach(function(d) {
    // calc percentages

    clean_text = +d.clean_text;
    pol_value = +d.pol_value;
    polarity = +d.polarity;
    if(pol_value > 0){
      positives = positives + 1
      positive_corpus += (' ' +d.clean_text)
      if(pol_value <= 0.2) {
        pos_counts[0] = pos_counts[0] + 1
      }
      else if(pol_value > 0.2 && pol_value <= 0.4){
        pos_counts[1] = pos_counts[1] + 1
      }
      else if(pol_value > 0.4 && pol_value <= 0.6){
        pos_counts[2] = pos_counts[2] + 1
      }
      else if(pol_value > 0.6 && pol_value <= 0.8){
        pos_counts[3] = pos_counts[3] + 1
      }
      else {
        pos_counts[4] = pos_counts[4] + 1
      }
    }
    else if (pol_value < 0) {
      negatives = negatives - 1
      negative_corpus += (' ' +d.clean_text)
      if(pol_value >= -0.2) {
        neg_counts[0] = neg_counts[0] - 1
      }
      else if(pol_value < -0.2 && pol_value >= -0.4){
        neg_counts[1] = neg_counts[1] - 1
      }
      else if(pol_value < -0.4 && pol_value >= -0.6){
        neg_counts[2] = neg_counts[2] - 1
      }
      else if(pol_value < -0.6 && pol_value >= -0.8){
        neg_counts[3] = neg_counts[3] - 1
      }
      else {
        neg_counts[4] = neg_counts[4] - 1
      }
    }
    else {
      neutrals = neutrals + 1
      neutral_corpus += (' '+d.clean_text)
    }
  });
  //console.log(negatives + positives + neutrals)
  var total_count = positives - negatives + neutrals;
  var pos_ticks = ['Rather positive', 'Quite positive', 'Positive', 'Very positive', 'Extremely positive'];
  var neg_ticks = ['Rather negative', 'Quite negative', 'Negative', 'Very negative', 'Extremely negative'];
  var total_ticks = ['Extremely negative', 'Very negative', 'Negative', 'Quite negative','Rather negative',
                    'Rather positive', 'Quite positive', 'Positive', 'Very positive', 'Extremely positive']
  var total_data = [];

  function getFrequency(string, cutOff) {
  var cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""),
      words = cleanString.split(' '),
      frequencies = {},
      word, frequency, i;

  for( i=0; i<words.length; i++ ) {
    word = words[i];
    frequencies[word] = frequencies[word] || 0;
    frequencies[word]++;
  }

  words = Object.keys( frequencies );

  return words.sort(function (a,b) {
    return frequencies[b] -frequencies[a];
  }).slice(0,cutOff).toString();
}
positive_corpus = getFrequency(positive_corpus, 5).replace(/,/g, ' ');
negative_corpus = getFrequency(negative_corpus, 5).replace(/,/g, ' ');
neutral_corpus = getFrequency(neutral_corpus, 5).replace(/,/g, ' ');

console.log(positive_corpus)


  for(var i = 0; i <= 4; i++){
    total_data.push({ "name": "positive",
                      "value": (pos_counts[i] / total_count) * 100,
                      "whole_count": positives,
                      "range": pos_ticks[i],
                      "range_count": pos_counts[i],
                      "most_freq": positive_corpus})
  };
  total_data.push({ "name": "neutral",
                    "value": (neutrals / total_count) * 100,
                    "whole_count": neutrals,
                    "range": '0',
                    "range_count": negatives,
                    "most_freq": neutral_corpus});
  for(var i = 0; i <= 4; i++){
    total_data.push({ "name": "negative",
                      "value": (neg_counts[i] / total_count) * 100,
                      "whole_count": negatives,
                      'range': neg_ticks[i],
                      "range_count": neg_counts[i],
                      "most_freq": negative_corpus})
  };
//console.log(total_data)
  var label_names = [ '-1', '-0.8', '-0.6', '-0.4',
                      '-0.2', '0', '0.2', '0.4', '0.6', '0.8', '1.0'];

    x.domain([-100, 100]);

    //x.domain(d3.extent(total_data, function(total_data) { return total_data.value; })).nice();
    y.domain(total_data.map(function(total_data) { return total_data.name; }));

  svg.selectAll("rect")
      .data(total_data)
      .enter()
      .append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
      .attr("x", function(d) {

        if(d.name == 'positive'){
          let pos_width2 = pos_width
          pos_width = pos_width + d.value
          //console.log(d.value)
          //console.log(pos_width2)
          //console.log(x(pos_width2))
          return x(pos_width2)
          //x(Math.min(0, d.value))
        } else if (d.name == 'negative') {
          let neg_width2 = neg_width
          neg_width = neg_width + d.value
          return x(neg_width)

        } else {
          return x( - d.value / 2)
        };
      })
      .attr("y", function(d) { return y(d.name);})
      .attr("width", function(d) { return Math.abs(x(d.value) - x(0));  })
      .attr("height", y.rangeBand())
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
                        d.range + ' : </b>' + d.range_count +' (' + Math.round(d.range_count / d.whole_count * 100) + '% of all positives)' +
                        "<br/><b>Most frequent words in positive dreams:</b> " + d.most_freq)
          } else if (d.name =='negative') {
            return tooltip.style("visibility", "visible")
                  .html("<b>Total " + d.name + " count:</b> " + Math.abs(d.whole_count) + ' ('+Math.round(Math.abs(d.whole_count) / total_count * 100)+'%)'
                        + "<br/><b>" +
                        d.range + ' : </b>' + Math.abs(d.range_count) +' (' + Math.round(Math.abs(d.range_count) / Math.abs(d.whole_count) * 100) + '% of all negatives)'+
                        "<br/><b>Most frequent words in negative dreams:</b> " + d.most_freq)
          } else {
            return tooltip.style("visibility", "visible").html("<b>Total neutrals count: </b>" + d.whole_count + ' (' + Math.round(d.whole_count/total_count*100) + '%)'+
            "<br/><b>Most frequent words in neutrals dreams:</b> " + d.most_freq)
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
      });;

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .call(yAxis);



  var legendRectlength = 80;
  var legendRectheight = 20;
  var legendSpacing = 4;

  var legends = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height",100)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")");

  var legend_pos = legends.selectAll('.legend')
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

    //.style('stroke-width', 2)
    .style('fill', function(d, i){
      if(d.name == 'positive'){
        return pos_colors[i]
      }
    })

  var legend_neg = legends.selectAll('.legend')

      .data(total_data.filter(function(d){ return d.name == 'negative'; }))
      .enter()
      .append('g')
      .attr('class', 'legend_neg')

      legend_neg.append('rect')
        .attr('x', function() {
          temp2 += legendRectlength
          return (x(0) + temp2) - 5 * legendRectlength;
        })
        .attr('y', 0)
        .attr('width', legendRectlength)
        .attr('height', 20)
        .style('stroke-width', 2)
        .style('fill', function(d, i){
          if(d.name == 'negative'){
            //console.log(neg_colors[i])
            return neg_colors[4 - i]
          }
        });

    var x_legend = d3.scale.linear()
        .range([x(0) - 5 * legendRectlength + legendRectlength/2, x(0) + 5 * legendRectlength + + legendRectlength/2])

    var legendAxis = d3.svg.axis()
        .scale(x_legend)
        .orient("bottom")
        .ticks(10)
        .tickSubdivide(1)
        .tickSize(0, 0, 0)
        .tickFormat(function(d, i){ return total_ticks[i] });

    x_legend.domain([-1.0, 1.0]);

    legends.append("g")
        .attr("class", "axisLegend")
        .attr("transform", "translate(" + 0 + "," + legendRectheight + ")")
        .call(legendAxis)
        .style("color", 'white');

    legends.selectAll('.tick').style('color', 'black');


      var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color", "rgba(66, 66, 66, 0.7)")
        .style("color", "white")
        .text("");

  });
