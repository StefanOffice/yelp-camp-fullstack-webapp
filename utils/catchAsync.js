//wrapper function to avoid having to write try catch blocks on each route that calls an async function
module.exports = func => {
    return(req, res, next) => {
        //executes the function but it also catches the error(if there is one) and passes it to next
        func(req, res, next).catch(next);
    }
}