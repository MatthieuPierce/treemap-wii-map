import { scaleBand } from 'd3';
import { handleMouseOver, handleMouseOut } from './handleMouse';
import { chart, margin, innerWidth, innerHeight } from './chartParameters';

// Color legend

export const makeCategoricalLegend = ( 
  colorKeys, 
  colorScale, 
  ) => {
  
  let legend = chart.append("g")
    .attr("transform", `translate(${(0)}, ${innerHeight + 15})`)
    .attr("id", "legend")
    .attr("class", "legend")

    let colorBandsScale = scaleBand()
    .domain( colorKeys )
    .range( [ 0, innerWidth] )
    .paddingInner(0)
    .paddingOuter(0)

  //background rect
  // legend.append("rect")
  //     .attr("fill", "var(--secondary-color)")
  //     .attr("opacity", 1)
  //     .attr("height", 55)
  //     .attr("width", 150)
  //     .attr("id", "legend-box")
  //     .attr("stroke", "var(--primary-color)")
  //     .attr("stroke-opacity", 0.3)
  //     .attr("stroke-dasharray", "10 5 5 5");

  // legend marks
  let legendMark = legend.selectAll("g")
    .data(colorKeys)
    .enter()
    .append("g")
    .attr("class", "legend-mark-group legend")
      ;

    legendMark.append("rect")
      // .attr("x", (d, i) => 5 + i * 45 )
      .attr("x", d => colorBandsScale(d))
      .attr("y", 5 )
      .attr("width", colorBandsScale.bandwidth())
      .attr("height", 25)
      .attr("fill", d => colorScale(d))
      .attr("class", "legend-mark legend-item legend")
      .attr("opacity", 0.5)
      // .attr("stroke", `var(--secondary-color)`)
      // .attr("stroke-width", "1px")
      // .attr("stroke-linejoin", "round")
      // .attr("stroke-dasharray", "4 1 3 1 2 1")
      .on("mouseover focus", handleMouseOver)
      .on("mouseout", handleMouseOut)

  // legend labels
  legendMark.append("text")
    .attr("x", d => colorBandsScale(d) + colorBandsScale.bandwidth() / 2)
    .attr("y", 20)
      .text(d => d)
      .style("alignment-baseline", "middle")
      // .style("font-size", "1em")
      .attr("class", "legend-label legend")
      .attr("text-anchor", "middle")
      .attr("fill", "var(--primary-color)")

  legend.append("text")
    .text("Console")
    .style("font-weight", 700)
    .attr("class", "legend-title legend")
    .attr("text-anchor", "start")
    .attr("y", 0)
    .attr("x", 5)

}