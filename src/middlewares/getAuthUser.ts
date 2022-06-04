import {NextFunction} from 'express'

const getAuthUser = (req: any, next: NextFunction) =>  {
    req.user = req.body.user;
    return next()
}

export default getAuthUser