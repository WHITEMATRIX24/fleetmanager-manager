const mongoose = require('mongoose');
const Driver = require('./models/driver'); // Update this path

mongoose.connect("mongodb+srv://anulisba:aCZHjI8NyQLOHV2d@fleetmanager.mdvsoan.mongodb.net/?retryWrites=true&w=majority&appName=fleetmanager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        return Driver.collection.dropIndex('driverUsername_1');
    })
    .then(() => {
        console.log('Dropped legacy index on driverUsername');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error dropping index:', err);
        process.exit(1);
    });
