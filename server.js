// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const blsRoutes = require("./routes/bls");
require("dotenv").config();

//SSL
/*const https = require("https");
const fs = require("fs");*/

const app = express();
app.use(
	cors({
		origin: "*", // Adjust according to your frontend URL
	})
);
app.use(express.json());

// MongoDB connection
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

// Use authentication routes
app.use("/api/auth", authRoutes);
// Use bls routes
app.use("/api/bls", blsRoutes);
// SSL options
/*const ssl_options = {
  key: fs.readFileSync('/etc/letsencrypt/live/vmi1929509.contaboserver.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/vmi1929509.contaboserver.net/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/vmi1929509.contaboserver.net/chain.pem'),
};*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Create HTTPS server
/*https.createServer(ssl_options, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});*/