function draw_posneg(posneg){

  var margin_posneg = {top: 20, right: 30, bottom: 20, left: 30},
      width_posneg  = 400 - margin_posneg .left - margin_posneg .right,
      height_posneg  = 80 - margin_posneg .top - margin_posneg .bottom;

  var x_posneg  = d3.scale.linear()
      .range([0, width_posneg]);

  var y_posneg  = d3.scale.ordinal()
      .rangeRoundBands([0, height_posneg ], 0.1);

  var xAxis_posneg  = d3.svg.axis()
      .scale(x_posneg )
      .orient("bottom")
      .tickSubdivide(1)
      .tickSize(0, 0, 0);

  var yAxis_posneg  = d3.svg.axis()
      .scale(y_posneg )
      .orient("left")
      .tickSize(0)
      .tickPadding(6);

  var svg_posneg  = d3.select("#posneg_second_chart").append("svg")
  .attr("width", width_posneg  + margin_posneg .left + margin_posneg .right)
  .attr("height", height_posneg  + margin_posneg .top + margin_posneg .bottom)
  .append("g")
  .attr("transform", "translate(" + margin_posneg .left + "," + margin_posneg .top + ")");

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
  // var posneg = [7, 21, 43, 89, 123, 21, 199, 120, 31, 20, 1];
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
  // var total_ticks_legend = ['Extremely negative', 'Very negative', 'Negative', 'Quite negative','Rather negative',
  //     'Rather positive', 'Quite positive', 'Positive', 'Very positive', 'Extremely positive']
  var total_ticks_legend = ['Extremely negative', 'Very negative', 'Negative', 'Quite negative','Rather negative',
       'Rather positive', 'Quite positive', 'Positive', 'Very positive', 'Extremely positive']
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

  // Domain of x axis
  x_posneg.domain([-100, 100]);

  //x.domain(d3.extent(total_data, function(total_data) { return total_data.value; })).nice();
  y_posneg.domain(total_data.map(function(total_data) { return ''; }));
  //y.domain([0, 0]);
  var neutral_value = total_data[5].value / 2

  svg_posneg.selectAll("rect")
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
        return x_posneg(pos_width2 + neutral_value)
        //x(Math.min(0, d.value))
      } else if (d.name == 'negative') {
        let neg_width2 = neg_width
        neg_width = neg_width + d.value
        return x_posneg(-neg_width - neutral_value)

      } else {
        return x_posneg( - d.value / 2)
      };
    })
    .attr("y", 5)
    .attr("width", function(d) { return Math.abs(x_posneg (d.value) - x_posneg (0));  })
    .attr("height", 30)
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
        return tooltip_posneg.style("visibility", "visible")
        .html("<b>Total " + d.name + " count:</b> " + d.whole_count + ' ('+Math.round(d.whole_count / total_count * 100)+'%)'
        + "<br/><b>" +
        d.range + ' : </b>' + d.range_count +' (' + Math.round(d.range_count / d.whole_count * 100) + '% of all positives)')
      } else if (d.name =='negative') {
        return tooltip_posneg.style("visibility", "visible")
        .html("<b>Total " + d.name + " count:</b> " + Math.abs(d.whole_count) + ' ('+Math.round(Math.abs(d.whole_count) / total_count * 100)+'%)'
        + "<br/><b>" +
        d.range + ' : </b>' + Math.abs(d.range_count) +' (' + Math.round(Math.abs(d.range_count) / Math.abs(d.whole_count) * 100) + '% of all negatives)')
      } else {
        return tooltip_posneg.style("visibility", "visible").html("<b>Total neutrals count: </b>" + d.whole_count + ' (' + Math.round(d.whole_count/total_count*100) + '%)')
      }


    };
  })
  .on("mousemove", function() {
    return tooltip_posneg.style("top", (d3.event.pageY)+"px")
    .style("left",(d3.event.pageX+10)+"px");
  })
  .on("mouseout", function() {
    d3.select(this)
    return tooltip_posneg.style("visibility", "hidden").text('');
  });

  svg_posneg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_posneg  + ")")
      .call(xAxis_posneg )
      .style("opacity", 0)
      .selectAll("text").remove();
  svg_posneg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x_posneg(0) + ",0)")
      .call(yAxis_posneg);


  // Legend
  var legendRectlength = 40;
  var legendRectheight = 10;
  var legendSpacing = 4;

  var legends = d3.select("#posneg_second_chart").append("svg")
    .attr("width", width_posneg + margin_posneg.left + margin_posneg.right)
    .attr("height",25)
    .style("padding-left", "39px")
    .append("g")
    .attr("transform", "translate(" + margin_posneg.left + "," + 0 + ")");

  var legend_pos = legends.selectAll('.legend')
  .data(total_data.filter(function(d){ return d.name == 'positive'; }))
  .enter()
  .append('g')
  .attr('class', 'legend_pos');

  legend_pos.append('rect')
    .attr('x', function(){
      temp1 += legendRectlength;
      return(x_posneg(0) + temp1)
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
          return (x_posneg(0) + temp2) - 5 * legendRectlength;
        })
        .attr('y', 0)
        .attr('width', legendRectlength)
        .attr('height', legendRectheight)
        .style('stroke-width', 2)
        .style('fill', function(d, i){
          if(d.name == 'negative'){
            //console.log(neg_colors[i])
            return neg_colors[4 - i]
          }
        });

    var x_legend = d3.scale.linear()
        .range([x_posneg(0) - 5 * legendRectlength + legendRectlength/2, x_posneg(0) + 5 * legendRectlength + + legendRectlength/2])

    var legendAxis = d3.svg.axis()
        .scale(x_legend)
        .orient("bottom")
        .ticks(10)
        .tickSubdivide(1)
        .tickSize(0, 0, 0)
        .tickFormat(function(d, i){ return total_ticks_legend[i] });

    x_legend.domain([-1.0, 1.0]);

    legends.append("g")
        .attr("class", "axisLegend")
        .attr("transform", "translate(" + -legendRectlength + "," + legendRectheight + ")")
        .call(legendAxis)
        .style("color", 'white');

    legends.selectAll('.tick').style('color', 'black');


  var tooltip_posneg = d3.select("body")
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

}

function redraw_posneg(posneg){


  var margin_posneg = {top: 20, right: 30, bottom: 20, left: 30},
      width_posneg  = 400 - margin_posneg .left - margin_posneg .right,
      height_posneg  = 80 - margin_posneg .top - margin_posneg .bottom;

  var x_posneg  = d3.scale.linear()
      .range([0, width_posneg]);

  var y_posneg  = d3.scale.ordinal()
      .rangeRoundBands([0, height_posneg ], 0.1);

  var xAxis_posneg  = d3.svg.axis()
      .scale(x_posneg )
      .orient("bottom")
      .tickSubdivide(1)
      .tickSize(0, 0, 0);

  var yAxis_posneg  = d3.svg.axis()
      .scale(y_posneg )
      .orient("left")
      .tickSize(0)
      .tickPadding(6);


  svg_posneg  = d3.select("#posneg_second_chart")

  svg_posneg.selectAll("*").remove();

  svg_posneg = svg_posneg.append("svg")
  .attr("width", width_posneg  + margin_posneg .left + margin_posneg .right)
  .attr("height", height_posneg  + margin_posneg .top + margin_posneg .bottom)
  .append("g")
  .attr("transform", "translate(" + margin_posneg .left + "," + margin_posneg .top + ")");

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
  // var posneg = [7, 21, 43, 89, 123, 21, 199, 120, 31, 20, 1];
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
  // var total_ticks_legend = ['Extremely negative', 'Very negative', 'Negative', 'Quite negative','Rather negative',
  //     'Rather positive', 'Quite positive', 'Positive', 'Very positive', 'Extremely positive']
  var total_ticks_legend = ['Extremely negative', 'Very negative', 'Negative', 'Quite negative','Rather negative',
       'Rather positive', 'Quite positive', 'Positive', 'Very positive', 'Extremely positive']
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

  // Domain of x axis
  x_posneg.domain([-100, 100]);

  //x.domain(d3.extent(total_data, function(total_data) { return total_data.value; })).nice();
  y_posneg.domain(total_data.map(function(total_data) { return ''; }));
  //y.domain([0, 0]);
  var neutral_value = total_data[5].value / 2

  svg_posneg.selectAll("rect")
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
        return x_posneg(pos_width2 + neutral_value)
        //x(Math.min(0, d.value))
      } else if (d.name == 'negative') {
        let neg_width2 = neg_width
        neg_width = neg_width + d.value
        return x_posneg(-neg_width - neutral_value)

      } else {
        return x_posneg( - d.value / 2)
      };
    })
    .attr("y", 5)
    .attr("width", function(d) { return Math.abs(x_posneg (d.value) - x_posneg (0));  })
    .attr("height", 30)
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
        return tooltip_posneg.style("visibility", "visible")
        .html("<b>Total " + d.name + " count:</b> " + d.whole_count + ' ('+Math.round(d.whole_count / total_count * 100)+'%)'
        + "<br/><b>" +
        d.range + ' : </b>' + d.range_count +' (' + Math.round(d.range_count / d.whole_count * 100) + '% of all positives)')
      } else if (d.name =='negative') {
        return tooltip_posneg.style("visibility", "visible")
        .html("<b>Total " + d.name + " count:</b> " + Math.abs(d.whole_count) + ' ('+Math.round(Math.abs(d.whole_count) / total_count * 100)+'%)'
        + "<br/><b>" +
        d.range + ' : </b>' + Math.abs(d.range_count) +' (' + Math.round(Math.abs(d.range_count) / Math.abs(d.whole_count) * 100) + '% of all negatives)')
      } else {
        return tooltip_posneg.style("visibility", "visible").html("<b>Total neutrals count: </b>" + d.whole_count + ' (' + Math.round(d.whole_count/total_count*100) + '%)')
      }


    };
  })
  .on("mousemove", function() {
    return tooltip_posneg.style("top", (d3.event.pageY)+"px")
    .style("left",(d3.event.pageX+10)+"px");
  })
  .on("mouseout", function() {
    d3.select(this)
    return tooltip_posneg.style("visibility", "hidden").text('');
  });

  svg_posneg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_posneg  + ")")
      .call(xAxis_posneg )
      .style("opacity", 0)
      .selectAll("text").remove();
  svg_posneg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x_posneg(0) + ",0)")
      .call(yAxis_posneg);


  // Legend
  var legendRectlength = 40;
  var legendRectheight = 10;
  var legendSpacing = 4;

  var legends = d3.select("#posneg_second_chart").append("svg")
    .attr("width", width_posneg + margin_posneg.left + margin_posneg.right)
    .attr("height",25)
    .style("padding-left", "39px")
    .append("g")
    .attr("transform", "translate(" + margin_posneg.left + "," + 0 + ")");

  var legend_pos = legends.selectAll('.legend')
  .data(total_data.filter(function(d){ return d.name == 'positive'; }))
  .enter()
  .append('g')
  .attr('class', 'legend_pos');

  legend_pos.append('rect')
    .attr('x', function(){
      temp1 += legendRectlength;
      return(x_posneg(0) + temp1)
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
          return (x_posneg(0) + temp2) - 5 * legendRectlength;
        })
        .attr('y', 0)
        .attr('width', legendRectlength)
        .attr('height', legendRectheight)
        .style('stroke-width', 2)
        .style('fill', function(d, i){
          if(d.name == 'negative'){
            //console.log(neg_colors[i])
            return neg_colors[4 - i]
          }
        });

    var x_legend = d3.scale.linear()
        .range([x_posneg(0) - 5 * legendRectlength + legendRectlength/2, x_posneg(0) + 5 * legendRectlength + + legendRectlength/2])

    var legendAxis = d3.svg.axis()
        .scale(x_legend)
        .orient("bottom")
        .ticks(10)
        .tickSubdivide(1)
        .tickSize(0, 0, 0)
        .tickFormat(function(d, i){ return total_ticks_legend[i] });

    x_legend.domain([-1.0, 1.0]);

    legends.append("g")
        .attr("class", "axisLegend")
        .attr("transform", "translate(" + -legendRectlength + "," + legendRectheight + ")")
        .call(legendAxis)
        .style("color", 'white');

    legends.selectAll('.tick').style('color', 'black');


  var tooltip_posneg = d3.select("body")
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

}
