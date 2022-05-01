"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const utils_1 = __importDefault(require("../utils"));
const checkResource = (Model, identifier) => __awaiter(void 0, void 0, void 0, function* () {
    const resource = yield Model.exists({ _id: identifier });
    if (!resource) {
        return false;
    }
    return true;
});
// Common callback function to get all resources in order to adhere to DRY principle
const getAll = (Model) => (0, utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Quering DB for all the data associated to this model
    const data = yield Model.find().lean();
    // Returning the data in the response
    return res.status(200).json({
        status: 'success',
        data
    });
}));
// Common callback function to get one resource in order to adhere to DRY principle
const getOne = (Model) => (0, utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = req.params.Id;
    // Quering the DB to find data associated with this model
    const data = yield Model.findById(Id).lean();
    // Return a 404 reponse if data is null
    if (!data) {
        return res.status(404).json({
            status: 'failed',
            message: 'No resource found with that Id'
        });
    }
    // Returning the data in the response
    return res.status(200).json({
        status: 'success',
        data
    });
}));
// Callback function to delete a resource from the DB
const deleteOne = (Model) => (0, utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = req.params.Id;
    // Checking if the resource exists in the DB
    const resource = yield checkResource(Model, Id);
    // Return a 404 if resource is not found
    if (!resource) {
        return res.status(404).json({
            status: 'success',
            message: 'No resource found with this Id'
        });
    }
    yield Model.findByIdAndDelete(Id);
    // Returning a response
    return res.status(204).json();
}));
// Callback function to update a resource 
const update = (Model, fields) => (0, utils_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = req.params.Id;
    // Getting the fields in the request body
    const reqBodyKeys = Object.keys(req.body);
    // Getiing common fields
    const newFields = fields.filter(field => reqBodyKeys.includes(field));
    // Setting new object for updates
    let updObj = {};
    // setting the values of the new object based on filtered values
    newFields.map((field) => {
        updObj[field] = req.body[field];
    });
    // Checking if the resource exists in the DB
    const resource = yield checkResource(Model, Id);
    // Return a 404 if resource is not found
    if (!resource) {
        return res.status(404).json({
            status: 'success',
            message: 'No resource found with this Id'
        });
    }
    // Updating the resource in the DB with the fields provided
    const data = yield Model.findByIdAndUpdate(Id, updObj, { new: true, runValidators: true });
    return res.status(201).json({
        status: 'success',
        message: 'Updated successfully',
        data
    });
}));
module.exports = {
    getAll,
    getOne,
    deleteOne,
    checkResource,
    update
};
