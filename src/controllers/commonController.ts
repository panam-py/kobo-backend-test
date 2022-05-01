import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils';

const checkResource = async(Model: any, identifier: string): Promise<boolean> => {
    const resource: boolean = await Model.exists({ _id: identifier })
    if (!resource) {
        return false
    }
    return true
}

// Common callback function to get all resources in order to adhere to DRY principle
const getAll = (Model: any) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // Quering DB for all the data associated to this model
    const data: Array<Object> = await Model.find().lean();
    
    // Returning the data in the response
    return res.status(200).json({
        status: 'success',
        data 
    })
})

// Common callback function to get one resource in order to adhere to DRY principle
const getOne = (Model: any) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    

    const Id: string = req.params.Id;

    // Quering the DB to find data associated with this model
    const data: Object | null = await Model.findById(Id).lean();
    
    // Return a 404 reponse if data is null
    if (!data) {
        return res.status(404).json({
            status: 'failed',
            message: 'No resource found with that Id'
        })
    }

    // Returning the data in the response
    return res.status(200).json({
        status: 'success',
        data
    })
})

// Callback function to delete a resource from the DB
const deleteOne = (Model: any) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const Id: string = req.params.Id;

    // Checking if the resource exists in the DB
    const resource: boolean = await checkResource(Model, Id)

    // Return a 404 if resource is not found
    if (!resource) {
        return res.status(404).json({
            status: 'success',
            message: 'No resource found with this Id'
        })
    }
    await Model.findByIdAndDelete(Id)
    
    // Returning a response
    return res.status(204).json()
})

// Callback function to update a resource 
const update = (Model: any, fields: Array<string>) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const Id: string = req.params.Id;
    
    // Getting the fields in the request body
    const reqBodyKeys: Array<string> = Object.keys(req.body)

    // Getiing common fields
    const newFields: Array<string> = fields.filter(field => reqBodyKeys.includes(field))
    
    // Setting new object for updates
    let updObj: any = {}
    
    // setting the values of the new object based on filtered values
    newFields.map((field) => {
        updObj[field] = req.body[field]
    })

    // Checking if the resource exists in the DB
    const resource: boolean = await checkResource(Model, Id)

    // Return a 404 if resource is not found
    if (!resource) {
        return res.status(404).json({
            status: 'success',
            message: 'No resource found with this Id'
        })
    }

    // Updating the resource in the DB with the fields provided
    const data = await Model.findByIdAndUpdate(Id, updObj, { new: true, runValidators: true })
    
    return res.status(201).json({
        status: 'success',
        message: 'Updated successfully',
        data
    })
})


export = {
    getAll,
    getOne,
    deleteOne,
    checkResource,
    update
}