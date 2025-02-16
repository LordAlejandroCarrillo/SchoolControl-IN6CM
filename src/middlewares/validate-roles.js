export const hasRole = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(500).json({
                succes: false,
                msg: "Is wanted to verify a role without verifying the token first."
            })
        }

        if(!roles.includes(req.user.roles)){
            return res. status(401).json({
                succes: false,
                msg: `User not authorized, you have a role ${req.user.role}, the roles authorized are ${roles}`
            })
        }

        next()
    }
}