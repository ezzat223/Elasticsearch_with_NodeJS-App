/* --------------------- imports --------------------- */
const express = require("express");
const client = require("./elasticsearch/client");
const data = require("./data_management/retrieve_and_ingest_data");
const cors = require("cors");

/* --------------------- variables --------------------- */
const app = express();
const PORT = process.env.PORT || 3001;

/* --------------------- retrieve_and_ingest_data --------------------- */
app.use("/ingest_data", data);
// visit this url to make it work for the first time "http://localhost:3001/ingest_data/earthquakes"
// add index pattern: Stack Management => Kibana Data View => Create Data View

app.use(cors());

app.get("/results", (req, res) => {
  const passedType = req.query.type;
  const passedMag = req.query.mag;
  const passedLocation = req.query.location;
  const passedDateRange = req.query.dateRange;
  const passedSortOption = req.query.sortOption;

  async function sendESRequest() {
    const body = await client.search({
      index: "earthquakes",
      body: {
        sort: [
          {
            mag: {
              order: passedSortOption,
            },
          },
        ],
        size: 300,
        query: {
          bool: {
            filter: [
              {
                term: { type: passedType },
              },
              {
                range: {
                  mag: {
                    gte: passedMag,
                  },
                },
              },
              {
                match: { place: passedLocation },
              },
              // for those who use prettier, make sure there is no whitespace.
              {
                range: {
                  "@timestamp": {
                    gte: `now-${passedDateRange}d/d`,
                    lt: "now/d",
                  },
                },
              },
            ],
          },
        },
      },
    });
    res.json(body.hits.hits);
  }
  sendESRequest();
});

/* --------------------- App --------------------- */
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
