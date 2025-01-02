import { CookieOptions, Request as expressRequest, Response as expressResponse} from 'express';


export const logout = (req: expressRequest, res: expressResponse)=>{
      const cookieOptions:CookieOptions = {httpOnly:true,
                        sameSite:'strict',
                        secure:process.env.ENV==='PROD',}
    console.log("logging out",cookieOptions)
    res.clearCookie('expires',cookieOptions)
    res.clearCookie('access_token', cookieOptions)
    res.clearCookie('refresh_token', cookieOptions)
    res.redirect('/')

}