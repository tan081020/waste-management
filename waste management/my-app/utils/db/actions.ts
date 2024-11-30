
import { User } from "lucide-react";
import { db } from "./dbConfig";
import { Notifications, Transaction, Users, Reports, Rewards,collectedWaste } from "./schema";
import { eq, sql, and, desc, max, name, gt } from "drizzle-orm";

export async function createUser(email: string, name: String) {
    try {
        const [user] = await db.insert(Users).values({ email, name }).returning().execute()
        return user
    } catch (error) {
        console.error('error')
        return null

    }
}

export async function getUserByEmail(email: string) {
    try {
        const [user] = await db.select().from(Users).where(eq(Users.email, email)).execute()
        return user
    } catch (error) {
        console.error("loi kay du lieu qua email", error);
        return null

    }
}

export async function getUnreadNotifications(userId: number) {
    try {
        return await db.select().from(Notifications).where(and(eq(Notifications.userId, userId), eq(Notifications.isRead, false))).execute()
    } catch (error) {
        console.error("loi kay du lieu qua email", error);
        return null

    }
}
export async function getUserBalance(userId: number): Promise<number> {
    const transactions = await getRewardTransactions(userId) || []

    if (!transactions) return 0

    const balance = transactions.reduce((acc: number, transaction: any) => {
        return transaction.type.startsWith('earned') ? acc + transaction.amount : acc - transaction.amount
    }, 0)
    return Math.max(balance, 0)
}
export async function getRewardTransactions(userId: number) {
    try {
        const transactions = await db.select({
            id: Transaction.id,
            type: Transaction.type,
            amount: Transaction.amount,
            description: Transaction.description,
            date: Transaction.date
        }).from(Transaction).where(eq(Transaction.userId, userId)).orderBy(desc(Transaction.date)).limit(10).execute()
        const formattedTranstions = transactions.map(t => ({
            ...t,
            date: t.date.toISOString().split('T')[0]
        }))
        return formattedTranstions
    } catch (error) {
        console.error("loi kay du lieu qua email", error);
        return null

    }
}
export async function markNotificationAsRead(notificationId: number) {
    try {
        await db.update(Notifications).set({ isRead: true }).where(eq(Notifications.id, notificationId)).execute()
    } catch (error) {
        console.error("error marking notification read", error);
        return null
    }
}
export async function createReport(
    userId: number,
    location: string,
    wasteType: string,
    amount: string,
    imageUrl?: string,
    verificationResult?: any
) {
    try {
        const [reports] = await db.insert(Reports).values({
            userId, location, wasteType, amount, imageUrl, verificationResult, status: 'pending'
        }).returning().execute()
        const pointEarned = 10

        await updateRewardPoints(userId, pointEarned)
        await createTransaction(userId, 'earned_report', pointEarned, 'point earned for reporting')
        await creatNotification(userId, `ban da nhan duoc ${pointEarned} ponit`, 'reward')
        return reports
    } catch (error) {
        console.error('loi tao report', error);
        return null
    }
}

export async function updateRewardPoints(userId: number, pointsToAdd: number) {
    try {
        const [updateReward] = await db.update(Rewards).set({
            points: sql`${Rewards.points}+${pointsToAdd}`
        }).where(eq(Rewards.useId, userId)).returning().execute()
        return updateReward
    } catch (error) {
        console.error("loi update phan thuong", error);
        return null
    }
}
export async function createTransaction(userId: number, type: 'earned_report' | 'earned_collect' | 'redeemed', amount: number, description: string) {
    try {
        const [transaction] = await db.insert(Transaction).values({ userId, type, amount, description }).returning().execute()
        return transaction
    } catch (error) {
        console.error('loi tao transaction', error)
        throw error

    }
}

export async function creatNotification(userId: number, message: string, type: string) {
    try {
        const [notification] = await db.insert(Notifications).values({ userId, message, type }).returning().execute()
        return notification
    } catch (error) {
        console.error('loi tao notification', error);

    }
}
export async function getRecentReports(limit: number = 10) {
    try {
        const reports = await db.select().from(Reports).orderBy(desc(Reports.createdAt)).limit(limit).execute()
        return reports
    } catch (error) {
        console.error("loi recent reports", error);
        return []
    }
}
export async function getAvailableRewards(userId: number) {
    try {


        // Get user's total points
        const userTransactions = await getRewardTransactions(userId) as any;
        const userPoints = userTransactions.reduce((total: any, transaction: any) => {
            return transaction.type.startsWith('earned') ? total + transaction.amount : total - transaction.amount;
        }, 0);



        // Get available rewards from the database
        const dbRewards = await db
            .select({

                id: Rewards.id,
                name: Rewards.name,
                cost: Rewards.points,
                description: Rewards.description,
                collectionInfo: Rewards.collectionInfo,
            })
            .from(Rewards)
            .where(eq(Rewards.isAvailable, true))
            .execute();

        console.log("dbRewards", dbRewards);


        // Combine user points and database rewards
        const allRewards = [
            {
                id: 0, // Use a special ID for user's points
                name: "Your Points",
                cost: userPoints,
                description: "Redeem your earned points",
                collectionInfo: "Points earned from reporting and collecting waste"
            },
            ...dbRewards
        ];


        return allRewards;
    } catch (error) {
        console.error("Error fetching available rewards:", error);
        return [];
    }
}
export async function getWasteCollectionTalk(limit: number = 20) {
    try {
        const tasks = await db
            .select({
                id: Reports.id,
                location: Reports.location,
                wasteType: Reports.wasteType,
                amount: Reports.amount,
                status: Reports.status,
                date: Reports.createdAt,
                collectorId: Reports.collectorId,
            })
            .from(Reports)
            .limit(limit)
            .execute();

        return tasks.map(task => ({
            ...task,
            date: task.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }))
    } catch (error) {
        console.error("Error fetching waste collection tasks:", error);
        return [];
    }
}
export async function updateTaskStatus(reportId: number, newStatus: string, collectorId?: number) {
    try {
      const updateData: any = { status: newStatus };
      if (collectorId !== undefined) {
        updateData.collectorId = collectorId;
      }
      const [updatedReport] = await db
        .update(Reports)
        .set(updateData)
        .where(eq(Reports.id, reportId))
        .returning()
        .execute();
      return updatedReport;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }
  export async function saveReward(useId: number, amount: number) {
    try {
      const [reward] = await db
        .insert(Rewards)
        .values({
          useId,
          name: 'Waste Collection Reward',
          collectionInfo: 'Points earned from waste collection',
          points: amount,
          level: 1,
          isAvailable: true,
        })
        .returning()
        .execute();
      
      // Create a transaction for this reward
      await createTransaction(useId, 'earned_collect', amount, 'Points earned for collecting waste');
  
      return reward;
    } catch (error) {
      console.error("Error saving reward:", error);
      throw error;
    }
  }
  export async function saveCollectedWaste(reportId: number, collectorId: number, verificationResult: any,amount:string) {
    try {
      const [collectedWastes] = await db
        .insert(collectedWaste)
        .values({
          reportId,
          collectorId,
          collectionDate: new Date(),
          amount,
          status: 'verified',
        })
        .returning()
        .execute();
      return collectedWastes;
    } catch (error) {
      console.error("Error saving collected waste:", error);
      throw error;
    }
  }
  export async function getAllRewards() {
    try {
      const rewards = await db
        .select({
          id: Rewards.id,
          userId: Rewards.useId,
          points: Rewards.points,
          level: Rewards.level,
          createdAt: Rewards.createAt,
          userName: Users.name,
        })
        .from(Rewards)
        .leftJoin(Users, eq(Rewards.useId, Users.id))
        .orderBy(desc(Rewards.points))
        .execute();
  
      return rewards;
    } catch (error) {
      console.error("Error fetching all rewards:", error);
      return [];
    }
  }
  export async function getAllUser(limit: number = 20) {
    try {
        const user = await db
            .select({
                id: Users.id,
                email:Users.email,
                name: Users.name,
                phone:Users.phone,
                address:Users.address,
                role:Users.role,
                date:Users.createAt

            })
            .from(Users)
            .limit(limit)
            .execute();

            return user.map(task => ({
                ...task,
                date: task.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            }))
       
    } catch (error) {
        console.error("loi kay du lieu qua email", error);
        return []

    }
}
export async function checkUser (email:string){
    try {
        const [user] = await db.select().from(Users).where(eq(Users.email, email)).execute()
        if(user){
            return true
        }else{
            return false
        }

    } catch (error) {
        console.error("loi check user", error);
        return false

    }
}
export async function getAmountWaste (limit: number = 20){
    try {
        const amountWaste = await db.select({
            amount:Reports.amount
        }).from(Reports).limit(limit).execute()
        return amountWaste
    } catch (error) {
        console.error("loi recent reports", error);
        return null
    }
}
export async function getAmountbyMoth (year:string){
    try {
        const amountWaste = await db
            .select({
                amount: Reports.amount,
                date: Reports.createdAt
            })
            .from(Reports)
            .where(sql`TO_CHAR(${Reports.createdAt}, 'YYYY-MM') = ${year}`)
            .execute();
        return amountWaste
    } catch (error) {
        console.error("loi recent reports", error);
        return null
    }
}
export async function getAmountbyyear (year:string){
    try {
        const amountWaste = await db
            .select({
                amount: Reports.amount,
                date: Reports.createdAt
            })
            .from(Reports)
            .where(sql`TO_CHAR(${Reports.createdAt}, 'YYYY') = ${year}`)
            .execute();
        return amountWaste
    } catch (error) {
        console.error("loi recent reports", error);
        return null
    }
}
export async function updateUserByEmail (email:string,name:string,phone:string,address:string){
    try {
        const updateUser = await db.update(Users).set({name,phone,address}).where(eq(Users.email,email))
        return updateUser
    } catch (error) {
        console.error("loi update user", error);
        return null
    }
}
export async function deleteUser (email:string ){
    try {
       return  await db.delete(Users).where(eq(Users.email, email)).execute()
    } catch (error) {
        console.error("loi delete user", error);
        
    }
}
export async function updateUserByEmailAdmin (email:string,name:string,phone:string,address:string,role:string){
    try {
        const updateUser = await db.update(Users).set({name,phone,address,role}).where(eq(Users.email,email))
        return updateUser
    } catch (error) {
        console.error("loi update user", error);
        return null
    }
}
export async function getAmountWasteById (id:number){
    try {
        const [amountWaste] = await db.select({
            amount:Reports.amount
        }).from(Reports).where(eq(Reports.id,id)).execute()
        return amountWaste
    } catch (error) {
        console.error("loi recent reports", error);
        
    }
}
export async function getAmoutCollect (){
    try {
        const amountCollect = await db.select({amount:collectedWaste.amount}).from(collectedWaste).execute()
        return amountCollect
    } catch (error) {
        console.error("loi  amount", error);
        return null
    }
}
export async function getPoint (){
    try {
        const point = await db.select({point:Transaction.amount}).from(Transaction).execute()
        return point
    } catch (error) {
        console.error("loi  amount", error);
        return null
    }
}