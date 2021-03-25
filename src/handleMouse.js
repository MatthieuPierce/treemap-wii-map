import { select, timeFormat } from 'd3';
import {  leafName, leafValue, parentName } from './accessors';
import { clamp } from './helperFunctions';
import { tooltip } from './tooltip';
import { margin } from './chartParameters';

// Handle mouseOver/focus on marks
export const handleMouseOver = (event, d, colorScale) => {

  // Style currently-focused mark
  // select(event.currentTarget) 
    // .attr("stroke-width", "2")
    // .attr("stroke", "var(--hot-color)")
    // .attr("filter", "url(#svgFilter)")
    // .attr("opacity", 1)

    if (event.currentTarget.className.baseVal !== `legend-mark-group`) {
    tooltip
      .html(`
          <p class="tip-name">${leafName(d)}</p>
          <p>Console: ${parentName(d)}</p>
          <p>${leafValue(d)} Million units sold</p>
        `)
    }
  tooltip
    .attr("visibility", "visible")
    .attr("data-value", d => leafValue(d))
    .style("display", "grid")
    .style("background-color", d => colorScale(parentName(d)))

  // Position and transition tooltip
  let tooltipDimensions = document.querySelector("#tooltip")
    .getBoundingClientRect();
  let chartDimensions = document.querySelector("#chart")
    .getBoundingClientRect(); 
  
  tooltip
    // .attr("visibility", "visible")
    // .attr("data-education", val)
    // .style("display", "grid")
    .style("top", `${event.clientY - tooltipDimensions.height - 5}px`)

      // `${clamp(
      //   0,
      //   event.offsetY - tooltipDimensions.height - 5,
      //   chartDimensions.height - tooltipDimensions.height - 2
      // )}px`)

    .style("left", `${event.clientX + 5}px`)

      // `${clamp(
      //   margin.left,
      //   event.offsetX + 5,
      //   chartDimensions.width - tooltipDimensions.width - 2
      // )}px`)
    .style("z-index", 20)
    .transition()
    .duration(50)
    .style("opacity", 1)
      
    // Only act on tooltip if mark class is not "legend-mark";
  // previously encased all tooltip activity above, had to be 
  // depreciated just to affecting opacity due to fcc-test constraints
  // if (event.currentTarget.className.baseVal !== `legend-mark`) {
  //   }
  
}

// Handle mouseOut/leave
export const handleMouseOut = (event, d) => {
  // select(event.currentTarget)
  //   .attr("opacity", 1)
  //   .attr("stroke", null)
  //   .attr("stroke-width", 0.2)
  //   .attr("filter", null)
    // .attr("transform", null)
    ;

  tooltip
    // .transition()
    // .duration(1)
    .style("opacity", 0)
    .attr("visibility", "hidden")
    .style("z-index", -1)
    .style("display", "none")
    .attr("data-education", null) 

}