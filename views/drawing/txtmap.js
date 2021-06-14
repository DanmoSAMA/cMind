// import d3 from 'https://unpkg.com/d3@3.5.6/dist/d3.min.js';
// import './lib/d3-flextree.js';
// import markmap from './lib/view.mindmap.js';
// const parse = require('../../lib/parse.markdown');
// import parse from './lib/parse.txtmap.js';
// import transform from './lib/transform.headings.js';

// d3.json("data/tree.json", function(error, data) {
//   if (error) throw error;
//
//   markmap('svg#mindmap', data, {
//     preset: 'colorful', // or default
//     linkShape: 'diagonal' // or bracket
//   });
// });

function drawOnSvg(id, root, obj) {
  let indent = function (ind) {
    let s = "";
    for (; ind > 0; ind--) {
      s += " ";
    }
    return s;
  };
  let f = function (ind, obj) {
    let s = "";
    for (let k in obj) {
      s += indent(ind) + k + "\n" + f(ind+2, obj[k]);
    }
    return s;
  };
  const data = transform(parse(root + "\n" + f(2, obj)));
  markmap(`svg#${id}`, data, {
    preset: "colorful", // or default
    linkShape: "diagonal", // or bracket
  });
}

function getSvgDownloadLink(id) {
  const css = 
`<style type="text/css">
  <![CDATA[
    .markmap-node {
      cursor: pointer;
    }
    .markmap-node-circle {
      fill: #fff;
      stroke-width: 1.5px;
    }
    .markmap-node-text {
      fill:  #000;
      font: 10px sans-serif;
    }
    .markmap-link {
      fill: none;
    }
  ]]>
</style>`
  let svg = document.getElementById(id);
  let blob = new Blob(["<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">" + css + svg.innerHTML + "</svg>"], {type: "image/svg+xml"});
  return URL.createObjectURL(blob);
}
