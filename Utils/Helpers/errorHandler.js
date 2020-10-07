
const errorHandler = (error, fieldsArray) =>{
    let localizedErrors = []
console.log(fieldsArray);
    fieldsArray.forEach(field => {
        if (error.errors[field]) {
            localizedErrors.push(error.errors[field].message)
        }
    });

    return localizedErrors

}



module.exports = errorHandler