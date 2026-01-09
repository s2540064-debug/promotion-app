// Supabase投資（Respect）管理ユーティリティ

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

// 投資を記録
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

    // 相手のmarket_capを更新
    await updateUserMarketCap(data.to_user_id, data.amount);

    return respect;
  } catch (error) {
    console.error("Error creating respect:", error);
    return null;
  }
}

// ユーザーのmarket_capを更新
export async function updateUserMarketCap(userId: string, increment: number): Promise<boolean> {
  try {
    // 現在のmarket_capを取得
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

    // market_capを更新
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

// ユーザーが特定の投稿に投資したかチェック
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

// 投稿に対する投資数を取得
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

