import './index.css';
import { 
  extent,
  interpolateBuGn,
  json, 
  scaleSequential,
  treemap,
 } from 'd3';
 import { feature, mesh } from 'topojson-client';
import { colorValue } from './accessors';
import { chart, innerHeight, innerWidth } from './chartParameters';
import { makeSequentialLegend } from './legendSequential'
import { parseData } from './parseData';
import { handleMouseOver, handleMouseOut } from './handleMouse';

// NON-CODE PLANNING: CHART OBJECTIVES
// top 100 best-selling video games
// by category (color scale/ordinal + spatial grouping) 
// and sales volume (area/sqrt)
// tooltip with data-value property and optional details

// Chart basic construction & layout parameters in chartParameters.js

let dataset;
// Datset source
const dataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

// Async wrapper
let asyncWrapper = async () => {

  // Fetch Dataset & Render Marks
  json(dataUrl).then(data => {

    // Parse dataset function in parseData.js
    dataset = parseData(data);

    // Console out parsed dataset for examination
    // console.log("dataset")
    // console.log(dataset);

    // colorScale
    const colorScale = scaleSequential(interpolateBuGn)
      .domain(extent(dataset, colorValue))
      // .range([0, 1])

    // Add style SVG filter for use in tooltip hover
    chart.append("filter")
      .attr("id", "svgFilter")
      .append("feMorphology")
        .attr("operator", "erode")
        .attr("radius", 1)

    // Tooltip -- from tooltip.js)

    // Sequential legend -- from legendSequential
    // makeSequentialLegend(dataset, colorScale);

    // Treemap
    let myTree = d => treemap()
      .size([innerWidth, innerHeight])
      .padding(1)
      .round(true)
      (d);

  let root = myTree(dataset)

    console.log(root.leaves())

   let leaf = chart.selectAll("g")
      .data(root.leaves())
      .join("g")
        .attr("transform", d => `translate(${d.x0}, ${d.y0})`)

    let spaceRegex = /\s/gi;
    let etcRegex = /[^a-zA-Z0-9\-]/gi
    const formatStringForId = s => s.replaceAll(spaceRegex, '-').replaceAll(etcRegex, '');

    leaf.append("rect")
      .attr("id", d => `leaf-rect-${formatStringForId(d.data.name)}`)
      .attr("fill", "cyan")
      .attr("fill-opacity", 0.5)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)



    // Marks (circles) -- from marks.js
    // marks(
    //   dataset, 
    //   xScale, 
    //   yScale,
    //   colorScale,
    //   xBand
    //   );

    // xAxis -- buildXAxis function in xAxis.js
    // buildXAxis(xScale);

    // yAxis -- buildYAxis function in yAxis.js
    // buildYAxis(yScale);


    }
  )
  // Gotta catch those errors
  .catch(err => {
    alert(err);
    console.log(err);
  });



};
asyncWrapper();




