import {Request, Response, NextFunction} from 'express';

// Wrapper function to automatically catch errors in asynchrounous function
const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export = catchAsync
