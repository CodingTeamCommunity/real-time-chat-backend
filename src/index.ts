import app from "./app";

// Set the port of the server in either dev or production
const PORT = process.env.PORT || 3000;

// Spin up the server to begin listening on the server port
app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});
