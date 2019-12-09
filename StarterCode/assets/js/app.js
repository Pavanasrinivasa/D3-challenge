//SVG dimensions
var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

//define dimensions of the area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//create an svg wrapper, appened an svg group that will hold our chart
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
d3.select("body").append("div").attr("class", "tooltip").style("opacity",0);

//import data
d3.csv("assets/data/data.csv", function(err, stateData){
    if(err)throw err;
    console.log(stateData)
        stateData.forEach(function(data){
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
    });

//create scale functions
    var xLinearScale = d3.scaleLinear().range([0,width]);
    var yLinearScale = d3.scaleLinear().range([height,0]);
//create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(stateData, function(data){
        return data.healthcare;
    });
    xMax = d3.max(stateData, function(data){
        return data.healthcare;
    });
    yMin = d3.min(stateData, function(data){
        return data.poverty;
    });
    yMax = d3.max(stateData, function(data){
        return data.poverty;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMin);

//append axes
    chartGroup.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);
//create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare +1.5))
    .attr("cy", d => yLinearScale(d.poverty +0.3))
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", .5)
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });
//initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (abbr + '%');
    });
// create tooltip
    chartGroup.call(toolTip);
//create event listeners to display
    circlesGroup.on("click", function(data){
        toolTip.show(data);
    })
//onmouseout event
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });
//create axes labels
    chartGroup.append("text")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(stateData)
    .enter()
    .append("tspan")
        .attr("x", function(data){
            return xLinearScale(data.healthcare +1.3);
        })
        .attr("y", function(data){
            return yLinearScale(data.poverty +.1);
        })
        .text(function(data){
            return data.abbr
        });
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healtcare(%)");
    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top+30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")
    });