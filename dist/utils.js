"use strict";
// Wrapper function to automatically catch errors in asynchrounous function
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
module.exports = catchAsync;
