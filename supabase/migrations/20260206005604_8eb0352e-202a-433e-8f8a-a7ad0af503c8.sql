-- Fix user_preferences RLS: Restrict access to own preferences only
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;

CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own preferences" 
ON public.user_preferences 
FOR DELETE 
USING (user_id = auth.uid());

-- Fix enrichment_data RLS: Remove public read access
DROP POLICY IF EXISTS "Allow public read access to enrichment data" ON public.enrichment_data;