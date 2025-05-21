const EcosystemConfig = {
  apps: [
    {
      name: "Objecture-Demonstrament",
      script: "dpm",
      args: "--config dpm.config.documents.js",
      watch: [
        "index.js",
        "package.json",
        "dpm.config.documents.js",
        "ecosystem.config.cjs",
        // "../node_modules/core-plex/distributement",
        "../node_modules/document-process-manager/development",
        "../distributement",
      ],
      ignore_watch: [
        // "!../node_modules/core-plex/distributement",
        "!../node_modules/document-process-manager/development",
      ],
      watch_options: {
        followSymLinks: true,
      },
      autorestart: false,
      execMode: "fork",
    },
  ]
}
module.exports = EcosystemConfig
