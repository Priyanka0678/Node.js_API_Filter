/*
http://localhost:2000/search?vocab=jupo&query=technology&lang=en&labelLang=en

http://localhost:2000/search?vocab=jupo&query=biotechnology&filter=technology/biotechnology

*/

const http = require("http");
const url = require("url");
const axios = require("axios");

const server = http.createServer(async (req, res) => {
    // **Add CORS Headers Here**
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
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

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(response.data));
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
-----------------------------------------------------------------------------------------------------
    const http = require("http");
const url = require("url");
const axios = require("axios");

const server = http.createServer(async (req, res) => {
    // **Add CORS Headers Here**
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        // Respond to OPTIONS request (CORS pre-flight request)
        res.writeHead(200);
        return res.end();
    }

    const parsedUrl = url.parse(req.url, true); // Parse the incoming URL
    const path = parsedUrl.pathname; // Get the endpoint path
    const queryParams = parsedUrl.query; // Get the query parameters from the URL

    console.log("Received request with query parameters:", queryParams); // Debugging log

    if (path === "/search") {
        const { vocab, query, lang, labelLang, filter } = queryParams;

        // Validating vocab parameter
        const validVocabularies = ["yso", "jupo", "koko"];
        if (vocab && !validVocabularies.includes(vocab)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
                JSON.stringify({
                    error: "Invalid vocabulary. Valid options are: yso, jupo, koko",
                })
            );
        }

        // Default vocab if missing
        const vocabulary = vocab || "yso";

        // Validating query parameter
        const validQueries = ["biotechnology", "technology", "science"];
        if (query && !validQueries.includes(query)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
                JSON.stringify({
                    error: `Invalid query: ${query}. Valid options are: biotechnology, technology, science`,
                })
            );
        }

        // Missing query parameter
        if (!query) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
                JSON.stringify({
                    error: "Failed to fetch the data due to missing query parameter",
                })
            );
        }

        // Validating lang parameter
        const validLanguages = "en";
        if (lang && !validLanguages.includes(lang)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(
                JSON.stringify({
                    error: `Invalid language: ${lang}. Valid options are: en`,
                })
            );
        }

        const fintoApiUrl = `https://finto.fi/rest/v1/search`;

        const params = {
            vocab: vocabulary,
            query: query || "",
            lang: lang || "en",
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
                        error: `No data found for vocab=${vocabulary} and query=${query}`,
                    })
                );
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(response.data));
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

// Start the server on port 3001
server.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});

    

