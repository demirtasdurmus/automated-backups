const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const { exec } = require('child_process');
const CronJob = require('cron').CronJob;

// function to backup the database
const backupDatabase = () => {
    // extract credentials from .env
    const dbName = process.env.DB_NAME;
    const dbPass = process.env.DB_PASS;
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPort = process.env.DB_PORT;

    const format = "sql";

    // create a custom backup file name with date info
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
    const backupFilePath = `/Users/durmusdemirtas/Documents/backups/${dbName}-${currentDate}.${format}`;

    // execute node child process(exec)
    exec(`sh ./backup.sh ${dbPass} ${dbHost} ${dbUser} ${dbPort} ${dbName} ${backupFilePath}`,
        (error, stdout, stderr) => {
            if (error) {
                return console.error(`exec error: ${error}`);
            };
            if (stderr) {
                return console.error(`stderr: ${stderr}`);
            };
            console.log(`Created a backup of ${dbName} at ${date.toLocaleString()} successfully: ${stdout}`);
        })
};

// scheduling the backup job
var job = new CronJob('59 23 * * *',
    function () {
        console.log('-------Running cron job-------');
        backupDatabase();
    },
    null,
    true);


// set up server
app.listen(process.env.PORT, () => {
    console.log(`Server is awake on port ${process.env.PORT}:${process.env.NODE_ENV}`)
});