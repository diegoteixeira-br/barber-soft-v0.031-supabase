-- Step 1: Clean up duplicate companies per user
-- Keep the company that has units associated, or the oldest one

-- First, identify the "keeper" company for each user with duplicates
WITH ranked_companies AS (
  SELECT 
    c.id,
    c.owner_user_id,
    c.created_at,
    -- Prioritize companies that have units
    CASE WHEN EXISTS (SELECT 1 FROM public.units u WHERE u.company_id = c.id) THEN 0 ELSE 1 END as has_units_priority,
    ROW_NUMBER() OVER (
      PARTITION BY c.owner_user_id 
      ORDER BY 
        CASE WHEN EXISTS (SELECT 1 FROM public.units u WHERE u.company_id = c.id) THEN 0 ELSE 1 END,
        c.created_at ASC
    ) as rn
  FROM public.companies c
),
companies_to_keep AS (
  SELECT id, owner_user_id FROM ranked_companies WHERE rn = 1
),
companies_to_delete AS (
  SELECT id FROM ranked_companies WHERE rn > 1
)
-- Delete the duplicate companies
DELETE FROM public.companies 
WHERE id IN (SELECT id FROM companies_to_delete);

-- Step 2: Add unique constraint to prevent future duplicates
CREATE UNIQUE INDEX IF NOT EXISTS companies_owner_user_id_unique 
ON public.companies (owner_user_id);