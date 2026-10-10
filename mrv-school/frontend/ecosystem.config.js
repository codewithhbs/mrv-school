module.exports = {
  apps: [
    {
      name: "mrv-school",
      script: "npm",
      args: "start",
      cwd: "/root/mrv-school/frontend",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
