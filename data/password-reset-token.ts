import { db } from "@/lib/db"

export const getPassswordResetTokenByToken  = async (token:string) =>{
    try {
        const passwordToken = await db.passwordResetToken.findFirst({
            where:{token}
        })

        return passwordToken
    } catch {
        return null
    }
}

export const getPassswordResetTokenByEmail  = async (email:string) =>{
    try {
        const passwordToken = await db.passwordResetToken.findFirst({
            where:{email}
        })

        return passwordToken
    } catch {
        return null
    }
}