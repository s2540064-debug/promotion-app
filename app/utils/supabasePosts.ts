// Supabase投稿管理ユーティリティ

import { supabase } from "../../lib/supabase";

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  impact_amount: number;
  created_at?: string;
  updated_at?: string;
  // その他のカラム（必要に応じて）
  [key: string]: any;
}

export interface CreatePostData {
  content: string;
  image_url?: string;
  impact_amount: number;
}

// 投稿を作成
export async function createPost(data: CreatePostData): Promise<Post | null> {
  try {
    console.log("[Supabase] Creating post with data:", {
      content: data.content.substring(0, 50) + "...",
      image_url: data.image_url || "なし",
      impact_amount: data.impact_amount,
    });

    const { data: post, error } = await supabase
      .from("posts")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("[Supabase] Error creating post:");
      console.error("  Error code:", error.code);
      console.error("  Error message:", error.message);
      console.error("  Error details:", error.details);
      console.error("  Error hint:", error.hint);
      console.error("  Full error object:", JSON.stringify(error, null, 2));
      console.error("  Insert data:", JSON.stringify(data, null, 2));
      return null;
    }

    console.log("[Supabase] Post created successfully:", post);
    return post;
  } catch (error) {
    console.error("[Supabase] Exception while creating post:");
    console.error("  Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("  Error message:", error instanceof Error ? error.message : String(error));
    console.error("  Error stack:", error instanceof Error ? error.stack : "N/A");
    console.error("  Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error("  Insert data:", JSON.stringify(data, null, 2));
    return null;
  }
}

// 投稿一覧を取得（新しい順）
export async function getPosts(limit: number = 50): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[Supabase] Error fetching posts:");
      console.error("  Error code:", error.code);
      console.error("  Error message:", error.message);
      console.error("  Error details:", error.details);
      console.error("  Full error object:", JSON.stringify(error, null, 2));
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[Supabase] Exception while fetching posts:");
    console.error("  Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("  Error message:", error instanceof Error ? error.message : String(error));
    console.error("  Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return [];
  }
}

// セクターでフィルタリング（セクターカラムがない場合は全件取得）
export async function getPostsBySector(sector: string, limit: number = 50): Promise<Post[]> {
  try {
    // セクターカラムが存在しない場合は全件取得
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[Supabase] Error fetching posts by sector:");
      console.error("  Error code:", error.code);
      console.error("  Error message:", error.message);
      console.error("  Error details:", error.details);
      console.error("  Full error object:", JSON.stringify(error, null, 2));
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[Supabase] Exception while fetching posts by sector:");
    console.error("  Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("  Error message:", error instanceof Error ? error.message : String(error));
    console.error("  Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return [];
  }
}

// 投稿をIDで取得
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

