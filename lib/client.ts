import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPA_URL!,
    process.env.NEXT_PUBLIC_SUPA_ANON_KEY!
  );
};

const supabase = createClient();
