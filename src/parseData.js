import { hierarchy } from 'd3'

// Parse data from source into chart-useable components
// Standard application: Array of objects

export const parseData = (data) => {

  // Console dataset to examine (comment out afterwards)
  // console.log(data);

  // Object
  // Already a hierarchical JSON with root node, so simply process through
  // d3.hierarchy, apply root.sum (needed for d3.treemap()) and root.sort
  
  // name: string // root name -- "Video Game Sales Data Top 100"
  // children: arr // arr of consoles
  //    name: string // console name -- "Wii"
  //    children: arr // arr of games
  //        name: string // game name -- "Wii Sports"
  //        category: string // parent node
  //        value: string // unit sales in millions, should be number

  let myHierarchy = hierarchy(data)
    .sum(d => +d.value)
    .sort( (a, b) => b.value - a.value);

  // console.log("hierarchy(data)");
  // console.log(hierarchy(data));

  // console.log("myHierarchy");
  // console.log(myHierarchy);

  return myHierarchy;
  
}