/* --------------------- imports --------------------- */
const { Client } = require('@elastic/elasticsearch');
const config = require('config');

/* --------------------- variables --------------------- */
const elasticConfig = config.get('elastic');

const client = new Client({
    cloud: {
        id: elasticConfig.cloudID,
    },
    auth: {
        // username: elasticConfig.username,
        // password: elasticConfig.password
        apiKey: elasticConfig.apiKey
    },
})


/* --------------------- Client --------------------- */
client.ping()
    .then(response => console.log(`You are connected to Elasticsearch...`))
    .catch(error => console.error(`Elasticsearch is not connected!`))

module.exports = client;
