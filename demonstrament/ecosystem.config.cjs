const EcosystemConfig = {
  apps: [
    {
      name: "Objecture-Demonstrament",
      script: "dpm",
      watch: [
        "index.js",
        "package.json",
        "dpm.config.documents.js",
        "ecosystem.config.cjs",
        "../Core-Plex/development/",
        "../Document-Process-Manager/development/",
      ],
      args: "--config dpm.config.documents.js",
      autorestart: false,
      execMode: "fork",
    },
  ]
}
module.exports = EcosystemConfig
