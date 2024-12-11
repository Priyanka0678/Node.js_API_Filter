// Assume the response JSON is stored in a variable called `response`
const response = {
  "@context": {
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "isothes": "http://purl.org/iso25964/skos-thes#",
    "onki": "http://schema.onki.fi/onki#",
    "uri": "@id",
    "type": "@type",
    "results": {
      "@id": "onki:results",
      "@container": "@list"
    },
    "prefLabel": "skos:prefLabel",
    "altLabel": "skos:altLabel",
    "hiddenLabel": "skos:hiddenLabel",
    "@language": "en"
  },
  "uri": "",
  "results": [
    {
      "type": ["http://www.yso.fi/onto/yso-meta/Concept"],
      "localname": "p36507",
      "prefLabel": "biotechnology",
      "lang": "en",
      "vocab": "koko"
    }
  ]
};

// Filtering logic
const filterTerm = "yso-meta"; // Replace with the desired filter term
const filteredResponse = {
  results: response.results.map(result => {
    const filteredTypes = result.type.filter(type =>
      type.includes(filterTerm)
    );

    return {
      ...result,
      type: filteredTypes
    };
  }).filter(result => result.type.length > 0) // Exclude results with no matching type
};

// Display filtered response
console.log(JSON.stringify(filteredResponse, null, 2));

