// Supabase Investment (Respect) Management Utility

import { supabase } from "../../lib/supabase";

export interface Respect {
  id: string;
  from_user_id: string;
  to_user_id: string;
  post_id?: string;
  amount: number;
  created_at: string;
}

export interface CreateRespectData {
  from_user_id: string;
  to_user_id: string;
  post_id?: string;
  amount: number;
}

// Record investment
export async function createRespect(data: CreateRespectData): Promise<Respect | null> {
  try {
    const { data: respect, error } = await supabase
      .from("respects")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error creating respect:", error);
      return null;
    }

    // Update recipient's market_cap
    await updateUserMarketCap(data.to_user_id, data.amount);

    return respect;
  } catch (error) {
    console.error("Error creating respect:", error);
    return null;
  }
}

// Update user's market_cap
export async function updateUserMarketCap(userId: string, increment: number): Promise<boolean> {
  try {
    // Get current market_cap
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("market_cap")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError);
      return false;
    }

    const newMarketCap = (user.market_cap || 0) + increment;

    // Update market_cap
    const { error: updateError } = await supabase
      .from("users")
      .update({ market_cap: newMarketCap })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating market cap:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating market cap:", error);
    return false;
  }
}

// Check if user has invested in specific post
export async function hasRespectedPost(fromUserId: string, postId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("respects")
      .select("id")
      .eq("from_user_id", fromUserId)
      .eq("post_id", postId)
      .limit(1);

    if (error) {
      console.error("Error checking respect:", error);
      return false;
    }

    return (data && data.length > 0) || false;
  } catch (error) {
    console.error("Error checking respect:", error);
    return false;
  }
}

// Get investment count for post
export async function getRespectCount(postId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("respects")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);

    if (error) {
      console.error("Error counting respects:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error counting respects:", error);
    return 0;
  }
}

