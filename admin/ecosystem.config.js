module.exports = {
  apps: [
    {
      name: "mrv-school",
      script: "npm",
      args: "start",
      cwd: "/root/mrv-school/admin",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
