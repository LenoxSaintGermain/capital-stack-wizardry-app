
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'investor', 'viewer')),
  organization TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'professional', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user_id to businesses table if not exists
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);

-- Add user_id to enrichment_data table if not exists  
ALTER TABLE public.enrichment_data ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);

-- Add user_id to analysis_runs table if not exists
ALTER TABLE public.analysis_runs ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id);

-- Enable RLS on all tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrichment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_sources ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for businesses table
CREATE POLICY "Anyone can view businesses" ON public.businesses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Analysts and admins can insert businesses" ON public.businesses
  FOR INSERT TO authenticated 
  WITH CHECK (public.get_user_role() IN ('admin', 'analyst'));

CREATE POLICY "Analysts and admins can update businesses" ON public.businesses
  FOR UPDATE TO authenticated 
  USING (public.get_user_role() IN ('admin', 'analyst'));

-- RLS Policies for enrichment_data table
CREATE POLICY "Users can view enrichment data based on subscription" ON public.enrichment_data
  FOR SELECT TO authenticated USING (
    public.get_user_role() IN ('admin', 'analyst') OR
    (SELECT subscription_tier FROM public.profiles WHERE id = auth.uid()) IN ('professional', 'enterprise')
  );

CREATE POLICY "Analysts and admins can manage enrichment data" ON public.enrichment_data
  FOR ALL TO authenticated 
  USING (public.get_user_role() IN ('admin', 'analyst'))
  WITH CHECK (public.get_user_role() IN ('admin', 'analyst'));

-- RLS Policies for analysis_runs table
CREATE POLICY "Users can view their own analysis runs" ON public.analysis_runs
  FOR SELECT TO authenticated USING (
    created_by = auth.uid() OR public.get_user_role() = 'admin'
  );

CREATE POLICY "Users can create analysis runs" ON public.analysis_runs
  FOR INSERT TO authenticated 
  WITH CHECK (created_by = auth.uid());

-- RLS Policies for business_sources table (admin only)
CREATE POLICY "Admins can manage business sources" ON public.business_sources
  FOR ALL TO authenticated 
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "Users can view business sources" ON public.business_sources
  FOR SELECT TO authenticated USING (true);
