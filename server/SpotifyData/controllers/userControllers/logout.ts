import { Request as expressRequest, Response as expressResponse} from 'express';


export const logout = (req: expressRequest, res: expressResponse)=>{
    console.log("logging out")
    res.clearCookie('expires')
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.redirect('/')

}