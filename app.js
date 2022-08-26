// Import
const express = require('express');

// Global variables
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});