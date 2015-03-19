/**
 * Created by u0151000 on 3/19/2015.
 */


var dirwatch = require("./modules/DirectoryWatcher.js");
var simMonitor = new dirwatch.DirectoryWatcher("C:\\sim", true);
var csv = require('ya-csv');
var fs = require('fs');


simMonitor.start(500);

// Log to the console when a file is removed
simMonitor.on("fileRemoved", function (filePath) {
    console.log("File Deleted: " + filePath);
});

// Log to the console when a folder is removed
simMonitor.on("folderRemoved", function (folderPath) {
    console.log("Folder Removed: " + folderPath);
});

// log to the console when a folder is added
simMonitor.on("folderAdded", function (folderPath) {
    console.log(folderPath);
});

// Log to the console when a file is changed.
simMonitor.on("fileChanged", function (fileDetail, changes) {
    console.log("File Changed: " + fileDetail.fullPath);
    for (var key in changes) {
        console.log("  + " + key + " changed...");
        console.log("    - From: " + ((changes[key].baseValue instanceof Date) ? changes[key].baseValue.toISOString() : changes[key].baseValue));
        console.log("    - To  : " + ((changes[key].comparedValue instanceof Date) ? changes[key].comparedValue.toISOString() : changes[key].comparedValue));
    }
});

// log to the console when a file is added.
simMonitor.on("fileAdded", function (fileDetail) {
    console.log("File Added: " + fileDetail.fullPath);
    var CSV_path =  fileDetail.fullPath;
/**************************************************************/
    console.log('CSV loading....');
    //load csv file
    var loadCsv = function() {
        var reader = csv.createCsvFileReader(CSV_path, {
            'separator': ',',
            'quote': '"',
            'escape': '"',
            'comment': ''   });
        var allEntries = new Array();
        reader.columnsFromHeader =true;
        reader.addListener('data', function(data) {
            //this gets called on every row load
            allEntries.push(data);
        });

        reader.addListener('end', function(callback){
            fs.writeFile("Tmp/RAW.json", JSON.stringify(allEntries), function(err) {

                if(err) {
                    return console.log(err);
                }

                console.log("The JSON file was saved!");

            });

        });

    };

    var writer = new csv.CsvWriter(process.stdout);

    var myUsers = loadCsv();

/**********************************************************/








});

// Let us know that directory monitoring is happening and where.
console.log("Directory Monitoring of " + simMonitor.root + " has started");