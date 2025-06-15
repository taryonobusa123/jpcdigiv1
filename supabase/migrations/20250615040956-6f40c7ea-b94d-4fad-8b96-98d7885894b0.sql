
-- Add RLS policies for topup_requests table to ensure users can only see their own requests
ALTER TABLE public.topup_requests ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own topup requests
CREATE POLICY "Users can view their own topup requests" 
  ON public.topup_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to create their own topup requests
CREATE POLICY "Users can create their own topup requests" 
  ON public.topup_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own topup requests (in case they need to add proof later)
CREATE POLICY "Users can update their own topup requests" 
  ON public.topup_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);
