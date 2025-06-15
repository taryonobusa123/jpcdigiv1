
-- Create table for storing OTP codes
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '5 minutes'),
  is_used BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE
);

-- Add index for faster lookups
CREATE INDEX idx_otp_codes_whatsapp_number ON public.otp_codes(whatsapp_number);
CREATE INDEX idx_otp_codes_expires_at ON public.otp_codes(expires_at);

-- Add verification status to profiles
ALTER TABLE public.profiles 
ADD COLUMN is_whatsapp_verified BOOLEAN DEFAULT false;

-- Function to clean up expired OTP codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  DELETE FROM public.otp_codes 
  WHERE expires_at < now() OR is_used = true;
END;
$function$;
