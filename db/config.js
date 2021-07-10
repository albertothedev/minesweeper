db.createUser({
  user: "minesweeper-user",
  pwd: "minesweeper-pwd",
  roles: [
    {
      role: "readWrite",
      db: "minesweeper",
    },
  ],
});
