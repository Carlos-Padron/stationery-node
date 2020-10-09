
const errorHandler = (error) => {
    let localizedErrors = []
    for (const key in error.errors) {
        let err = error.errors[key].message
        localizedErrors.push(err)
    }
    return localizedErrors

}


module.exports = errorHandler