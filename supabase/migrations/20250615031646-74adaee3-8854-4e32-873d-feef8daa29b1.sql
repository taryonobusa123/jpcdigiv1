
-- Add whatsapp_number column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN whatsapp_number TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_profiles_whatsapp_number ON public.profiles(whatsapp_number);

-- Update the handle_new_user function to include whatsapp_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, whatsapp_number)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'whatsapp_number'
  );
  RETURN NEW;
END;
$function$;
