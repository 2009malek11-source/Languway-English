// English First: cloud account settings.
// 1) Create a free project at https://supabase.com
// 2) Paste the Project URL and the "anon public" key below (Project Settings > API).
//    NEVER paste the service_role key here. The anon key is public by design; your data is protected by the rules in SUPABASE_SETUP.sql.
// 3) Turn on a provider here only after you enabled it in Supabase (Authentication > Providers).
// Leave url and anonKey empty to run in "this device only" mode.
window.SUPABASE_CONFIG = {
  url: 'https://lqetqsfhilepyclsnznu.supabase.co',
  anonKey: 'sb_publishable_hzasPPub8jmBkjxGZK26tw_37c02ntP',
  providers: { google: true, apple: false }
};
