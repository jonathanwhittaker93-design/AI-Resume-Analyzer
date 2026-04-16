from supabase import create_client, Client
from config import settings

# Standard client (respects Row Level Security)
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)

# Admin client (bypasses RLS for server-side operations)
supabase_admin: Client = create_client(settings.supabase_url, settings.supabase_service_key)