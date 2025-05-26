const EcosystemConfig = {
  apps: [
    {
      name: "Objecture-Development",
      autorestart: false,
      script: "npx",
      watch: [
        "index.js",
        "package.json",
        "**/*.js",
        "../node_modules/recourse/distributement",
        "../node_modules/core-plex/distributement",
      ],
      ignore_watch: [
        "!../node_modules/recourse/distributement",
        "!../node_modules/core-plex/distributement",
      ],
      watch_options: {
        followSymLinks: true,
        interval: 500,
      },
      args: "rollup --config rollup.config.js",
      execMode: "fork"
    },
  ]
}
module.exports = EcosystemConfig
