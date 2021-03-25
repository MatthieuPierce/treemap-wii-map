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

    if (event.currentTarget.className.baseVal !== `legend`) {
    tooltip
      .html(`
          <p class="tooltip-name">${leafName(d)}</p>
          <p class="tooltip-category">Console: ${parentName(d)}</p>
          <p class="tooltip-value">${leafValue(d)}M units sold</p>
        `)
    
  tooltip
    .attr("visibility", "visible")
    .style("background-color", colorScale(parentName(d)))
    .attr("data-value", leafValue(d))
    .style("display", "grid")

  // Position and transition tooltip
  let tooltipDimensions = document.querySelector("#tooltip")
    .getBoundingClientRect();
  let chartDimensions = document.querySelector("#chart")
    .getBoundingClientRect(); 
  
  tooltip
    // .attr("visibility", "visible")
    // .attr("data-education", val)
    // .style("display", "grid")
    .style("top", 
      `${clamp(
        chartDimensions.top,
        // event.clientY - tooltipDimensions.height - 5,
        event.clientY + 15,
        chartDimensions.bottom - tooltipDimensions.height - 1
      )}px`)

    .style("left",
      `${clamp(
        margin.left,
        event.clientX + 5,
        chartDimensions.right - tooltipDimensions.width - 12
      )}px`)
    .style("z-index", 20)
    // .transition()
    // .duration(50)
    .style("opacity", 1)
  }
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