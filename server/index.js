const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler.js");
require('dotenv').config()

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(    // Allow access from anywhere for now
    cors({
        origin: "*",
    })
);

//MongoDB database connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

//Routes
const userRoutes = require("./routes/user.routes.js");
const postRoutes = require("./routes/post.routes.js")


app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.get('/ping', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

app.use(errorHandler);


if (require.main === module) {
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`)
    });
}

module.exports = { app, mongoose };