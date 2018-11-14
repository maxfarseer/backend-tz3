/* eslint-disable */
export function processData(raw) {
  const data = { nodes: [], links: [] };

  // Convert to JSON
  raw = raw.map(d => d.toJSON());

  // Set numLinks to zero
  raw.forEach(caseObj => {
    caseObj._id = caseObj._id.toString();
    caseObj.numLinks = 0;
  });

  // Calculate numLinks
  raw.forEach(caseObj => {
    caseObj.citedCases.forEach(id => {
      const c = getFromArray(raw, "_id", id.toString());
      if (c) {
        c.numLinks += 1;
        caseObj.numLinks += 1;
      }
    });
  });

  // Sort and Limit
  raw = raw.sort((a, b) => {
    return b.score * (b.numLinks + 1) - a.score * (a.numLinks + 1);
  });
  raw = raw.slice(0, 200);

  // Build a network
  const nodes = {};
  for (let [i, value] of raw.entries()) {
    const d = value; //.toJSON();
    nodes[value._id] = {
      i: i,
      name: d.name,
      year: d.year,
      score: d.score,
      numLinks: d.numLinks
    };
  }

  for (let [i, value] of raw.entries()) {
    for (let id of value.citedCases) {
      if (nodes[id]) {
        data.links.push({ source: i, target: nodes[id].i });
      }
    }
  }

  data.nodes = Object.keys(nodes).map(function(key) {
    return nodes[key];
  });

  return data;
}

function getFromArray(array, prop, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][prop] === value) return array[i];
  }

  return null;
}
