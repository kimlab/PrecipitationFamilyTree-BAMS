// training.js

var margin = {top: 20, right: 120, bottom: 20, left:100},
    width = 1400 - margin.right - margin.left,
    height = 1000- margin.top - margin.bottom;
 
var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var x = d3.scale.linear()
    .domain([1835,2035])
    .range([-50,1100]);

var y = d3.scale.linear()
    .domain([0,26])
    .range([0,700]);

var p = d3.scale.linear()
    .domain([0,1000])
    .range([0,140]);

var xAxis_top = d3.svg.axis()
    .scale(x)
    .orient('top')
    .tickFormat(d3.format("d"))
    .ticks(10);

var xAxis_prcp = d3.svg.axis()
    .scale(p)
    .orient('top')
    .tickFormat(d3.format("d"))
    .ticks(2);


//var xAxis_bot = d3.svg.axis()
//    .scale(x)
//    .orient('bottom')
//    .tickFormat(d3.format("d"))
//    .ticks(10);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

var line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("basis")
    ;

var svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.selectAll(".link")
    .data( nodeData )
  .enter().append("path")
    .attr("class", "link")
    .attr("d", function(d) {
        var src = {"x": x(treeData[d.src-1].year), "y": y(d.src)};
        var mid = {"x": x(treeData[d.src-1].year - d.xoff), "y": y(d.des+d.yoff)};
        var des = {"x": x(treeData[d.des-1].year), "y": y(d.des)};
        return line( [src, mid, des] );
        //return diagonal({source: src, target: des});
      })
    .style("stroke", function(d) { return treeData[d.src-1].clr} )
    .style("stroke-dasharray", function(d) { return d.ls } )
    .style("stroke-opacity", 0.5 )
    ;

svg.selectAll("circle")
    .data( treeData )
  .enter().append("circle")
    .attr("id",function(d) { return d.idx; } )
    .attr("cx",function(d) { return x(d.year); } )
    .attr("cy", function(d) { return y(d.idx); } )
    .attr("r", function(d) { if (d.map) { return 13;} else { return 8;} })
    //.style("fill", function(d)  { if (d.val) { return d.clr;} else { return "url(#hash4_4)";} } )
    .style("fill", function(d) { return d.clr;} )
    .style("fill-opacity", function(d) { if (d.val) { return 1;} else { return 0.5;} } )
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    ;

svg.selectAll("outerCircle")
    .data( treeData )
  .enter().append("circle")
    .attr("id",function(d) { return d.idx; } )
    .attr("cx",function(d) { return x(d.year); } )
    .attr("cy", function(d) { return y(d.idx); } )
    .attr("r", function(d) { if (d.map) { return 15;} else { return 10;} })
    .style("fill", "none")
    .style("stroke-dasharray", function(d) { if (d.ant==false) {return ("5,3")} else {return ("0,0")} })
    //.style("stroke-dasharray", ("5,3"))
    .style("stroke-width", 1.5)
    .style("stroke", function(d) { if (d.ant=="unknown") {return "none"} else {return d.clr} } )
    ;



svg.selectAll(".bar")
    .data( treeData )
  .enter().append("rect")
    .attr("class", "bar")
    .attr("id",function(d) { return d.idx; } )
    .attr("x",1120)
    .attr("y", function(d) { return y(d.idx)-12; } )
    .attr("width", function(d) { return p(d.prcp); })
    .attr("height",24)
    .style("fill", function(d) { return d.clr;} )
    .style("fill-opacity", function(d) { if (d.val) { return 1;} else { return 0.5;} } )
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    ;


svg.selectAll(".name")
    .data( treeData )
  .enter().append("text")
    .attr("class", "name")
    .attr("id",function(d) { return d.idx; } )
    .attr("x", function(d) { return x(d.year)+20; } )
    .attr("y", function(d) { return y(d.idx)+8; } )
    .style("fill", "slategray")
    .text( function(d) { return d.name + ', ' + d.year; } )
    .text( function(d) { return d.name + ', ' + d.year; } )
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    ;

svg.selectAll(".prcp")
    .data( treeData )
  .enter().append("text")
    .attr("class", "prcp")
    .attr("id",function(d) { return d.idx; } )
    .attr("x",1130 )
    .attr("y", function(d) { return y(d.idx)+5; } )
    .style("fill", "white")
    //.style("fill", function(d) { return d.clr; } )
    .text( function(d) { return d.prcp } )//+ 'mm'; } )
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    ;

svg.append("text", "g")
    .attr("class", "title")
    .attr("transform", "translate(0, " + height*0.95 + ")")
    .text("Family Tree of Global Precipitation Estimation");

svg.append("g")
    .attr('class', 'x axis')
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis_top);

svg.append("g")
    .attr('class', 'x axis')
    .attr("transform", "translate(0, " + 0 + ")")
    .call(xAxis_top);

svg.append("g")
    .attr('class', 'p axis')
    .attr("transform", "translate(1120, " + 0 + ")")
    .call(xAxis_prcp);

svg.append("g")
    .attr('class', 'p axis')
    .attr("transform", "translate(1120, " + height + ")")
    .call(xAxis_prcp);



function mouseOver(d){

  var bar = d3.select( svg.selectAll("rect")[0][this.id-1]  );
  var clc = d3.select( svg.selectAll("circle")[0][this.id-1]);
  var txt = d3.select( svg.selectAll(".name")[0][this.id-1]  );

  var tx  = 1155;
  var ty  = y(treeData[this.id-1].idx)+5 

  //console.log( this );
  //console.log( bar[0][0] );
  //console.log( clc[0][0] );
  //console.log( txt[0][0] );

  bar.transition().duration(100).style("fill", "firebrick");
  clc.transition().duration(100).style("fill", "firebrick");
  txt.transition().duration(100).style("fill", "firebrick")
     .style("font-weight", "bold");

  //svg.append("text", "g")
  //   .attr("class", "prcp")
  //   .attr("transform", "translate(" + tx + "," + ty + ")")
  //   .style("fill", "white")
  //   .style("font-size", 14)
  //   .text( treeData[this.id-1].prcp + "mm" );
}


function mouseOut(d){

  var bar = d3.select( svg.selectAll("rect")[0][this.id-1]  );
  var clc = d3.select( svg.selectAll("circle")[0][this.id-1]);
  var txt = d3.select( svg.selectAll(".name")[0][this.id-1] );

  //console.log( bar[0][0] );
  //console.log( clc[0][0] );
  //console.log( txt[0][0] );

  bar.transition().duration(300).style("fill", treeData[ this.id-1 ].clr );
  clc.transition().duration(300).style("fill", treeData[ this.id-1 ].clr );
  txt.transition().duration(300).style("fill", "slategray")
     .style("font-weight", "normal");

  //d3.select( ".prcp" ).remove();
}


