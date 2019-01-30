const fs = require('fs');
var formidable = require('formidable');

module.exports.writeDataToDB = function (filename, data) {
    return new Promise((resolve) => {
        fs.writeFile(filename, JSON.stringify(data), (err) => {
            if (err) {
                Promise.reject();
            }
            else {
                resolve('Data is successfully added');
            }
        });

    })
}

module.exports.readDataFromDB = function (filename) {
    return new Promise((resolve) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                Promise.reject();
            }
            else {
                let parsedData = JSON.parse(data);
                resolve(parsedData);
            };

        });


    })

}

module.exports.uploadFileParamsPromise = function (req) {

    let form = new formidable.IncomingForm();

    try {
        return new Promise((resolve, reject) => {
            form.parse(req, function (err, fields, files) {

                if (err) {
                    console.log(err)
                }

                function removeEmptyStringElements(obj) {
                    for (var prop in obj) {
                        if (typeof obj[prop] === 'object') {// dive deeper in
                            removeEmptyStringElements(obj[prop]);
                        } else if (obj[prop] === '') {// delete elements that are empty strings
                            delete obj[prop];
                        }
                    }
                    return obj;
                }
                removeEmptyStringElements(fields);

                parsedFormData = {
                    fields: fields,
                    files: files
                }
                resolve(parsedFormData);
            })
        })
    }
    catch (err) {
        return Promise.reject(err)
    }
}