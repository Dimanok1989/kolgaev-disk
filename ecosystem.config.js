module.exports = {
    apps: [
        {
            name: 'kolgaev-disk',
            script: 'node_modules/next/dist/bin/next',
            args: '-p 3006',
            exec_mode: 'cluster',
            instances: 'max'
        },
    ],
};
