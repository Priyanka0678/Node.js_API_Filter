const http = require("http");
const url = require("url");
const axios = require("axios");

const server = http.createServer(async (req, res) => {
    // Add CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const parsedUrl = url.parse(req.url, true); // Parse the incoming URL
    const path = parsedUrl.pathname; // Get the endpoint path
    const queryParams = parsedUrl.query; // Get the query parameters from the URL

    console.log("Received request with query parameters:", queryParams); // Debugging log

    if (path === "/search") {
        const { vocab, query, lang, labelLang, filter } = queryParams;
        const fintoApiUrl = `https://finto.fi/rest/v1/search`;

        const params = {
            vocab: vocab || "yso",
            query: query || "",
            lang: lang || "en",
            labelLang: labelLang || "en",
            filter: filter || "technology/biotechnology",
        };

        console.log("Params being sent to Finto API:", params);

        try {
            const response = await axios.get(fintoApiUrl, { params });

            if (!response.data || response.data.length === 0) {
                console.log("No data found for the given query in the Finto API.");
                res.writeHead(404, { "Content-Type": "application/json" });
                return res.end(
                    JSON.stringify({
                        error: `No data found for vocab=${vocab} and query=${query}`,
                    })
                );
            }

            // Constructing the desired response structure
            const responseData = {
                "@context": {
                    "skos": "http://www.w3.org/2004/02/skos/core#",
                    "isothes": "http://purl.org/iso25964/skos-thes#",
                    "onki": "http://schema.onki.fi/onki#",
                    "uri": "@id",
                    "type": "@type",
                    "results": {
                        "@id": "onki:results",
                        "@container": "@list",
                    },
                    "prefLabel": "skos:prefLabel",
                    "altLabel": "skos:altLabel",
                    "hiddenLabel": "skos:hiddenLabel",
                    "@language": "en",
                },
                "uri": "",
                "results": response.data.results.map(item => ({
                    type: item.type || ["http://www.yso.fi/onto/tsr-meta/Concept"],
                    localname: item.localname || "",
                    prefLabel: item.prefLabel || "",
                    lang: item.lang || "en",
                    vocab: vocab || "koko",
                    filter: filter || "tsr-meta"
                }))
            };

            // Sending the response back to the client
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(responseData, null, 2));
        } catch (error) {
            console.error("API Request Error:", error.message);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ error: "Failed to fetch data", details: error.message })
            );
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Endpoint not found");
    }
});

// Start the server on port 2000
server.listen(2000, () => {
    console.log("Server is running on http://localhost:2000");
});
