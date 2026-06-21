import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

# Initialize the Supabase client
if SUPABASE_URL and SUPABASE_ANON_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
else:
    supabase = None

def upload_evidence_image(local_file_path: str, filename: str) -> str:
    """
    Uploads a local image file to the Supabase Storage bucket "evidence-images"
    and returns its public URL.
    """
    if not supabase:
        print("Warning: Supabase credentials not found. Falling back to local URL.")
        return f"/static/evidence/{filename}"
        
    bucket_name = "evidence-images"
    
    try:
        # Check if bucket exists, if not attempt to create it
        try:
            supabase.storage.get_bucket(bucket_name)
        except Exception:
            try:
                supabase.storage.create_bucket(bucket_name, options={"public": True})
            except Exception as e:
                print(f"Warning: Could not create bucket: {e}")

        # Upload the file to Supabase
        res = supabase.storage.from_(bucket_name).upload(
            path=filename,
            file=local_file_path,
            file_options={"content-type": "image/jpeg"}
        )
        
        # Retrieve the public URL for the uploaded file
        public_url = supabase.storage.from_(bucket_name).get_public_url(filename)
        return public_url
    except Exception as e:
        import traceback
        print(f"Supabase Upload Failed: {traceback.format_exc()}")
        print("Falling back to local static URL.")
        return f"/static/evidence/{filename}"
