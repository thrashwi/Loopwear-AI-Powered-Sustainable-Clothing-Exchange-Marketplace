// Data Store compatibility layer for Loopwear
import { db } from './db.js';

export const users = db.getUsers();
export const items = db.getItems();
export const swaps = db.getSwaps();
export const conversations = db.getConversations();
export { db };
