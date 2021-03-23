import { select } from 'd3';
import { handleMouseOver, handleMouseOut } from './handleMouse';
import { chart, innerWidth } from './chartParameters';

// Color legend

export const makeCategoricalLegend = ( 
  colorKeys, 
  colorScale, 
  ) => {
  
chart.append("g")
.attr("transform", `translate(${(innerWidth - 250)}, ${350})`)
.attr("id", "legend")
.append("rect")
  .attr("fill", "var(--secondary-color)")
  .attr("opacity", 1)
  .attr("height", 55)
  .attr("width", 150)
  .attr("id", "legend-box")
  .attr("stroke", "var(--primary-color)")
  .attr("stroke-opacity", 0.3)
  .attr("stroke-dasharray", "10 5 5 5");

select("#legend").selectAll("legend-mark")
  .data(colorKeys)
  .enter()
  .append("circle")
    .attr("cx", (d, i) => 20 )
    .attr("cy", (d, i) => 15 + i * 25)
    .attr("r", 10)
    .attr("fill", d => colorScale(d))
    .attr("class", "legend-mark")
    .attr("opacity", 0.5)
    .attr("stroke", `var(--secondary-color)`)
    .attr("stroke-width", "1px")
    .attr("stroke-linejoin", "round")
    .attr("stroke-dasharray", "4 1 3 1 2 1")
    .on("mouseover focus", handleMouseOver)
    .on("mouseout", handleMouseOut)

select("#legend").selectAll("legend-label")
  .data(colorKeys)
  .enter()
  .append("text")
    .attr("x", (d, i) => 35)
    .attr("y", (d, i) => 15 + i * 25)
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-size", "0.6em")
    .attr("class", "legend-label")
    .attr("fill", "var(--primary-color)")

  select("#legend")
    .append("text")
    .text("Variance from base temperature (8.66℃)")
    .attr("font-size", "0.9em")
    .attr("y", 70)

}