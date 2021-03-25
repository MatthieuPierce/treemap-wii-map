import './index.css';
import { 
  extent,
  interpolateBuGn,
  json, 
  scaleOrdinal, 
  scaleSequential,
  shuffle,
  treemap,
  treemapSquarify,
  schemePaired,
  interpolateSinebow,
  range
 } from 'd3';
import { leafName, leafValue, parentName } from './accessors';
import { chart, innerHeight, innerWidth } from './chartParameters';
import { parseData } from './parseData';
import { handleMouseOver, handleMouseOut } from './handleMouse';
import { makeCategoricalLegend } from './legendCategorical';

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
    // arriving as a hierarchy that has already received sum() and sort()
    dataset = parseData(data);
    // Console out incoming parsed dataset for examination
    // console.log("dataset:")
    // console.log(dataset);

    // Add style SVG filter and filter functions for use in tooltip hover
    // chart.append("filter")
    //   .attr("id", "svgFilter")
    //   .append("feMorphology")
    //     .attr("operator", "erode")
    //     .attr("radius", 1)

    // Tooltip -- from tooltip.js)

    // Sequential legend -- from legendSequential
    // makeSequentialLegend(dataset, colorScale);

    // Treemap function
    let myTreemap = d => treemap()
      .size([innerWidth, innerHeight])
      .tile(treemapSquarify)  // treemapSquarify is default
      .paddingInner(2)
      .paddingOuter(0)
      .round(true)
      (d);

    let root = myTreemap(dataset)

    const categories = root.children.map(node => node.data.name)

    // // colorScale sequential   // used colorScaleOrdinalSeq instead
    // const colorScale = scaleSequential(interpolateBuGn)
    // .domain(extent(dataset, colorValue))
    // // .range([0, 1])

    // ordinal colorScale       // used colorScaleOrdinalSeq instead
    // const catColorScale = scaleOrdinal(schemePaired)
    //   .domain(categories)

    // colorScaleOrdinalSeq - oridinal colorScale from sequential scheme
    // Make categorical/ordinal color scheme from sequential interprolator
    // from arbitrary number/arr (here categories.length for node parents)
    // categorySteps assumes range of [0, 1], per d3 interpolators
    let categorySteps = 1 / categories.length;
    let categoryTValues = range(0, 1, categorySteps).concat(1);
    // re-sort values to radiate from 0 in the center
    let valuesReSort = categoryTValues.reduce((acc, e, i) => {
      let firstAcc = acc[0];
      let lastAcc = acc[acc.length - 1];
      if (Math.abs(firstAcc + e) >= Math.abs(lastAcc + e)) {
        return [...acc, e]
      } else {
        return [ e, ...acc]
      }
    },[])
    let schemeOrdinalSequential = valuesReSort.map(t => interpolateSinebow(t));
    // let schemeShuffle = shuffle(schemeOrdinalSequential.slice());
    const colorScaleOrdinalSeq = scaleOrdinal(schemeOrdinalSequential)
      .domain(categories);

    // tiles: treemap leaf tile groups
    let leaf = chart.selectAll("g")
        .data(root.leaves())
        .join("g")
          .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
          .attr("class", "leaf-group")
          .on("mouseover mousemove pointerover focus", 
          (event, d) => handleMouseOver(event, d, colorScaleOrdinalSeq))
        .on("mouseout pounterout pointerleave", 
          (event, d) => handleMouseOut(event, d))

      let spaceRegex = /\s/gi;
      let etcRegex = /[^a-zA-Z0-9\-]/gi
      const formatStringForId = s => s.replaceAll(spaceRegex, '-').replaceAll(etcRegex, '');

    // treemap leaf tile rects
      leaf.append("rect")
        .attr("id", d => `leaf-rect-${formatStringForId(leafName(d))}`)
        .attr("class", "tile")
        .attr("data-name", d => `${leafName(d)}`)
        // alternative for data-category is d.data.category; less future-proof
        .attr("data-category", d => `${parentName(d)}`)
        .attr("data-value", d => d.value)
        .attr("fill", d => colorScaleOrdinalSeq(parentName(d)))
        .attr("fill-opacity", 0.5)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        
    // clip path for text in leaf
    leaf.append("clipPath")
      .attr("id", d => `leaf-clip-path-${formatStringForId(leafName(d))}`)
      .append("use")
      .attr("xlink:href", d => `#leaf-rect-${formatStringForId(leafName(d))}`)

    // treemap leaf text as svg foreignObject
    let foreignDiv = leaf.append("foreignObject")
      .attr("class", "tile-foreign-object")
      // .attr("clip-path", d => `url(#leaf-clip-path-${formatStringForId(leafName(d))})` )
      .attr("x", 5)
      .attr("y", 5)
      .attr("width", d => d.x1 - d.x0 - 5)
      .attr("height", d => d.y1 - d.y0 - 10)
      .append('xhtml:div')
        .attr("class", "tile-foreign-div")
        .on("mouseover mousemove pointerover focus", 
          (event, d) => handleMouseOver(event, d, colorScaleOrdinalSeq))
        .on("mouseout pounterout pointerleave", 
          (event, d) => handleMouseOut(event, d))

    foreignDiv.append('xhtml:p')
      // .attr("xmlns", "http://www.w3.org/1999/xhtml")
      .attr("class", "data-name")
      .text(d => `${leafName(d)}`)

    foreignDiv.append('xhtml:p')
      // .attr("xmlns", "http://www.w3.org/1999/xhtml")
      .attr("class", "units-sold")
      .text(d => `${leafValue(d)}M sold`)

    // treemap leaf text
      // leaf.append("text")
      //   .attr("class", "tile-text")
      //   .attr("clip-path", d => `url(#leaf-clip-path-${formatStringForId(leafName(d))})` )
      //   .selectAll("tspan")
      //     // Split name string (expect multiple words) into array of words
      //     // for entry into distinct tspans 
      //   .data(d => leafName(d).split(" ").concat(`${d.value}M units`))
      //   .join("tspan")
      //     .attr("fill", "var(--primary-color)")
      //     .text(d => d)
      //     .attr("x", 5)
      //     .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)

    // makeCategoricalLegend takes colorKeys and colorScale

    makeCategoricalLegend(categories, colorScaleOrdinalSeq);

    }
  )
  // Gotta catch those errors
  .catch(err => {
    alert(err);
    console.log(err);
  });



};
asyncWrapper();




