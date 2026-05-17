import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://eookxaxtfnjxounjsvmy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvb2t4YXh0Zm5qeG91bmpzdm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjgzNzksImV4cCI6MjA5NDI0NDM3OX0.Db4GocSu3zccjOBSKwBUCjwo6IF4lVOuiVA9kyjFY14";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);