const client = require('./elasticsearch/client');

async function generateApiKey(opts) {
    const body = await client.security.createApiKey({
        body: {
            name: 'earthquake_app',
            role_descriptors: {
                earthquake_example_writer: {
                    cluster: ['monitor'],
                    index: [
                        {
                            names: ['earthquakes'],
                            privileges: ['create_index', 'write', 'read', 'manage'],
                        }
                    ]
                }
            }
        }
    });
    return Buffer.from(`${body.id}:${body.api_key}`).toString('base64');
}

generateApiKey()
    .then(console.log)
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });