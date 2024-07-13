const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

const port = 3001;
const dbUri = "mongodb://localhost:27017/salesDatabase"; // Replace with your MongoDB connection string

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    });

// Define the SalesData model
const salesDataSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date,
});

const SalesData = mongoose.model("SalesData", salesDataSchema);

// API Endpoints

// Get sales with search and pagination
app.get("/sales", async (req, res) => {
    try {
        const { month = 1, search_q = "", page = 1 } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        const regex = new RegExp(search_q, "i");
        const monthStart = new Date(`2021-${month}-01T00:00:00Z`);
        const monthEnd = new Date(`2021-${Number(month) + 1}-01T00:00:00Z`);

        const query = {
            dateOfSale: { $gte: monthStart, $lt: monthEnd },
            $or: [
                { title: { $regex: regex } },
                { price: { $regex: regex } },
                { description: { $regex: regex } },
            ],
        };

        const sales = await SalesData.find(query).limit(limit).skip(skip);
        res.send(sales);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Get statistics
app.get("/statistics", async (req, res) => {
    try {
        const { month = 1 } = req.query;
        const monthStart = new Date(`2021-${month}-01T00:00:00Z`);
        const monthEnd = new Date(`2021-${Number(month) + 1}-01T00:00:00Z`);

        const statistics = await SalesData.aggregate([
            { $match: { dateOfSale: { $gte: monthStart, $lt: monthEnd } } },
            {
                $group: {
                    _id: null,
                    sales: { $sum: { $cond: [{ $eq: ["$sold", true] }, "$price", 0] } },
                    soldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
                    unSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } },
                },
            },
        ]);

        res.send(statistics[0]);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Get items price range
app.get("/items", async (req, res) => {
    try {
        const { month } = req.query;
        const monthStart = new Date(`2021-${month}-01T00:00:00Z`);
        const monthEnd = new Date(`2021-${Number(month) + 1}-01T00:00:00Z`);

        const items = await SalesData.aggregate([
            { $match: { dateOfSale: { $gte: monthStart, $lt: monthEnd } } },
            {
                $facet: {
                    "0-100": [{ $match: { price: { $gte: 0, $lte: 100 } } }, { $count: "count" }],
                    "101-200": [{ $match: { price: { $gte: 101, $lte: 200 } } }, { $count: "count" }],
                    "201-300": [{ $match: { price: { $gte: 201, $lte: 300 } } }, { $count: "count" }],
                    "301-400": [{ $match: { price: { $gte: 301, $lte: 400 } } }, { $count: "count" }],
                    "401-500": [{ $match: { price: { $gte: 401, $lte: 500 } } }, { $count: "count" }],
                    "501-600": [{ $match: { price: { $gte: 501, $lte: 600 } } }, { $count: "count" }],
                    "601-700": [{ $match: { price: { $gte: 601, $lte: 700 } } }, { $count: "count" }],
                    "701-800": [{ $match: { price: { $gte: 701, $lte: 800 } } }, { $count: "count" }],
                    "801-900": [{ $match: { price: { $gte: 801, $lte: 900 } } }, { $count: "count" }],
                    "901-above": [{ $match: { price: { $gte: 901 } } }, { $count: "count" }],
                },
            },
        ]);

        const response = {};
        items[0].forEach((item, key) => {
            response[key] = item[0] ? item[0].count : 0;
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Get categories
app.get("/categories", async (req, res) => {
    try {
        const { month = 1 } = req.query;
        const monthStart = new Date(`2021-${month}-01T00:00:00Z`);
        const monthEnd = new Date(`2021-${Number(month) + 1}-01T00:00:00Z`);

        const categories = await SalesData.aggregate([
            { $match: { dateOfSale: { $gte: monthStart, $lt: monthEnd } } },
            {
                $group: {
                    _id: "$category",
                    items: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    items: 1,
                },
            },
        ]);

        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json(error.message);
    }
});

// Get all statistics
const monthsData = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
};

app.get("/all-statistics", async (req, res) => {
    try {
        const { month = 3 } = req.query;

        const api1Response = await fetch(
            `http://localhost:3001/statistics?month=${month}`
        );
        const api1Data = await api1Response.json();

        const api2Response = await fetch(
            `http://localhost:3001/items?month=${month}`
        );
        const api2Data = await api2Response.json();

        const api3Response = await fetch(
            `http://localhost:3001/categories?month=${month}`
        );
        const api3Data = await api3Response.json();

        res.status(200).json({
            monthName: monthsData[month],
            statistics: api1Data,
            itemPriceRange: api2Data,
            categories: api3Data,
        });
    } catch (error) {
        res.status(400).json(error.message);
    }
});
