

import { integer, varchar, pgTable, serial, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";




export const Users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 10 }),
    address: varchar('address', { length: 200 }),
    password: varchar('password',{length:255}).notNull(),
    role: varchar('role', { length: 200 }).default('USER').notNull(),
    createAt: timestamp('created_at').defaultNow().notNull()

})
export const Reports = pgTable('reports', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    location: text('location').notNull(),
    wasteType: varchar('waste_type', { length: 255 }).notNull(),
    amount: varchar('amount', { length: 255 }).notNull(),
    imageUrl: text('image_url'),
    verificationResult: jsonb('verification_result'),
    status: varchar('status', { length: 255 }).notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    collectorId: integer('collector_id').references(() => Users.id)

})
export const Rewards = pgTable('rewards', {
    id: serial('id').primaryKey(),
    useId: integer('user_id').references(() => Users.id).notNull(),
    points: integer('points').notNull().default(0),
    level: integer("level").notNull().default(1),
    createAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('update_at').defaultNow().notNull(),
    isAvailable: boolean('is_available').notNull().default(true),
    description: text('description'),
    name: varchar('name', { length: 255 }).notNull(),
    collectionInfo: text('collection_info').notNull()

})
export const collectedWaste = pgTable('collected_waste', {
    id: serial('id').primaryKey(),
    reportId: integer('report_id').references(() => Reports.id).notNull(),
    collectorId: integer('collector_id').references(() => Users.id).notNull(),
    collectionDate: timestamp('collection_date').notNull(),
    amount: varchar('amount', { length: 255 }).notNull(),
    status: varchar('status', { length: 255 }).notNull().default('collected'),


})
export const Notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    message: text('message').notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    isRead: boolean('is_read').notNull().default(false),
    createAt: timestamp('create_at').defaultNow().notNull(),
})
export const Transaction = pgTable('transaction', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    type: varchar('type', { length: 20 }).notNull(),
    amount: integer('amount').notNull(),
    description: text('description').notNull(),
    date: timestamp('date').defaultNow().notNull()


})
export const News = pgTable('news', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id).notNull(),
    imageUrl: text('image_url'),
    description: varchar('description', { length: 255 }).notNull(),
    createAt: timestamp('created_at').defaultNow().notNull(),
    content: text('content').notNull(),
    author: varchar('author', { length: 255 }).notNull(),


})
export const Voucher = pgTable('voucher', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => Users.id),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    content: text('content').notNull(),
    point: integer('point').notNull(),
    cardCode: varchar('card_code', { length: 20 }),
    type: varchar('type', { length: 255 }).notNull(),
    createAt: timestamp('created_at').defaultNow().notNull(),
    status: varchar('status', { length: 255 }).notNull().default('not_used'),


})
