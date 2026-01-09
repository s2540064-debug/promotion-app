// Supabase User Management Utility

import { supabase } from "../../lib/supabase";

export interface User {
  id: string;
  user_name: string;
  market_cap: number;
  received_respects: number;
  rank?: string;
  created_at: string;
  updated_at: string;
}

// Get user information
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Update user information
export async function updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.error("Error updating user:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}

// Create or get user
export async function getOrCreateUser(userId: string, userName: string): Promise<User | null> {
  try {
    // Get existing user
    const existingUser = await getUserById(userId);
    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          user_name: userName,
          market_cap: 0,
          received_respects: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting or creating user:", error);
    return null;
  }
}

