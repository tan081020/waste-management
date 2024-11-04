
import { db } from "./dbConfig";
import { Notifications, Transaction, Users,Reports,Rewards } from "./schema";
import { eq,sql,and,desc, max } from "drizzle-orm";

export async function createUser(email:string,name:String) {
    try {
        const [user] = await db.insert(Users).values({email,name}).returning().execute()
        return user
    } catch (error) {
        console.error('error')
        return null
        
    }
}

export async function getUserByEmail(email:string) {
    try {
        const[user] = await db.select().from(Users).where(eq(Users.email,email)).execute()
        return user
    } catch (error) {
        console.error("loi kay du lieu qua email",error);
        return null
        
    }
}

export async function getUnreadNotifications(userId:number) {
    try {
        return await db.select().from(Notifications).where(and(eq(Notifications.userId,userId),eq(Notifications.isRead,false))).execute()
    } catch (error) {
        console.error("loi kay du lieu qua email",error);
        return null
        
    }
}
export async function getUserBalance(userId:number):Promise<number> {
    const transactions = await getRewardTransactions(userId) || []

    if(!transactions) return 0

    const balance = transactions.reduce((acc:number,transaction:any)=>{
        return transaction.type.startsWith('earned') ? acc + transaction.amount : acc - transaction.amount  
    },0)
    return Math.max(balance,0)
}
export async function getRewardTransactions(userId:number) {
    try {
        const transactions = await db.select({
            id:Transaction.id,
            type:Transaction.type,
            amount : Transaction.amount,
            description : Transaction.description,
            date : Transaction.date
        }).from(Transaction).where(eq(Transaction.userId,userId)).orderBy(desc(Transaction.date)).limit(10).execute()
        const formattedTranstions = transactions.map(t=>({
            ...t,
            date : t.date.toISOString().split('T')[0]
        }))
        return formattedTranstions
    } catch (error) {
        console.error("loi kay du lieu qua email",error);
        return null
        
    }
}
export async function markNotificationAsRead(notificationId:number) {
    try {
        await db.update(Notifications).set({isRead:true}).where(eq(Notifications.id,notificationId)).execute()
    } catch (error) {
        console.error("error marking notification read",error);
        return null
    }
}
export async function createReport(
    userId:number,
    location:string,
    wasteType:string,
    amount:string,
    imageUrl?:string,
    verificationResult?:any
) {
    try {
        const [reports] = await db.insert(Reports).values({
            userId,location,wasteType,amount,imageUrl,verificationResult,status:'pending'
        }).returning().execute()
        const pointEarned = 10  

        await updateRewardPoints(userId,pointEarned)
        await createTransaction(userId,'earned_report',pointEarned,'point earned for reporting')
        await creatNotification(userId,`ban da nhan duoc ${pointEarned} ponit`,'reward')
        return reports
    } catch (error) {
        console.error('loi tao report',error);
        return null
    }
}

export async function updateRewardPoints (userId:number,pointsToAdd:number){
    try {
        const [updateReward] = await db.update(Rewards).set({
            points: sql`${Rewards.points}+${pointsToAdd}`
        }).where(eq(Rewards.useId,userId)).returning().execute()
        return updateReward
    } catch (error) {
        console.error("loi update phan thuong",error);
        return null
    }
}
export async function createTransaction (userId:number,type:'earned_report'|'earned_collect'|'redeemed',amount:number,description:string){
    try {
        const [transaction] = await db.insert(Transaction).values({userId,type,amount,description}).returning().execute()
        return transaction
    } catch (error) {
        console.error('loi tao transaction',error)
        throw error
        
    }
}

export async function creatNotification(userId:number,message:string,type:string) {
    try {
        const [notification] = await db.insert(Notifications).values({userId,message,type}).returning().execute()
        return notification
    } catch (error) {
        console.error('loi tao notification',error);
        
    }
}