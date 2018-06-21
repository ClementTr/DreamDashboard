
var path = [null, null, null];
var values_path = [null, null, null];

let complement = {};

// 1- afficher les fils
// 2- zoomer
// 3- effacer les parents

var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

d3.json("data/root.json", function(error, data) {
  if (error) throw error;

  console.log(JSON.stringify(data))

  draw(data, data);

});

function erase() {
    var circle = g.selectAll("*").remove();
}

function draw(base, subset) {

  var node, circle, text, focus, nodes, view;

  root = d3.hierarchy(subset)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });


  focus = root,
  nodes = pack(root).descendants();

  circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      // .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .attr("class", function(d) { return "node"; })
      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
      .on("click", function(d) { seekAndFind(base, d.data.name); if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.data.name; });

  node = g.selectAll("circle,text");

  svg.style("background", color(-1))
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

}

function load_complement(base, name) {

  console.log("load complement", name, base);

  d3.json(name, function(error, data){

    base.children[path[0]].children = data.children[0].children;

    data.children[0].children = data.children[0].children.map(function(group) {
        return {
          name: group.name,
          children: [],
          size: group.size
        }
    });

    erase();
    draw(base, data.children[0]);

  })

};


function seekAndFind(base, name) {
  console.log("seekAndFind", name, path);

  subset = base;
  i = 0;
  while(path[i]) {
    if(name === values_path[i]){
      path[i] = null;
      erase();
      draw(base, subset);
      return;
    };
    subset = subset.children[path[i]];
    // if( i === 1 ) break;
    i+=1;
  }
  values_path[i] = name;
  console.log("values", values_path)
  path[i] = subset.children.findIndex(function(children){ return children.name == name });
  // base = base.children[path[i]];

  if( subset.children[path[i]].children.length == 0) {
    name = name.replace(/\W/g,'');
    name = "data/dreams_"+name+".json";
    load_complement(base, name);
  }

  erase();
  draw(base, subset.children[path[i]]);

}
