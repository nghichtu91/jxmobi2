module.exports = {
  apps: [{
    name: "jxweb-api",
    script: "dist/src/main.js",
    env_production: {
      NODE_ENV: "production",
    }
  }]
}