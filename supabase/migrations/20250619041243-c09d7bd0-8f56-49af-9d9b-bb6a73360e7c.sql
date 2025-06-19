
-- Insert the Premier Multi-Trade Services business record (with corrected cap_rate value)
INSERT INTO public.businesses (
  business_name,
  sector,
  location,
  asking_price,
  annual_revenue,
  annual_net_profit,
  automation_opportunity_score,
  composite_score,
  description,
  cap_rate,
  payback_years,
  government_contracts,
  seller_financing,
  strategic_flags,
  resilience_factors,
  source,
  is_active,
  last_analyzed_at
) VALUES (
  'Premier Multi-Trade Services',
  'Multi-Trade Services',
  'Raleigh, NC',
  2800000,
  3600000,
  1000000,
  0.8500,
  0.9200,
  'Well-established residential and commercial services company offering HVAC, electrical, and plumbing services. 15+ years in operation with strong local presence and existing customer base.',
  0.1790,
  2.8,
  true,
  true,
  '["multi_trade_portfolio", "government_contract_ready", "automation_opportunity", "recession_resistant"]'::jsonb,
  '["essential_services", "established_customer_base", "multi_revenue_streams", "experienced_workforce"]'::jsonb,
  'manual',
  true,
  NOW()
);

-- Insert enrichment data for Premier Multi-Trade Services
INSERT INTO public.enrichment_data (
  business_id,
  ai_summary,
  market_analysis,
  automation_assessment,
  financial_projections,
  growth_opportunities,
  risk_factors,
  competitor_analysis,
  confidence_score
) VALUES (
  (SELECT id FROM public.businesses WHERE business_name = 'Premier Multi-Trade Services' LIMIT 1),
  'Premier Multi-Trade Services represents a compelling acquisition opportunity in the multi-trade services sector. This Raleigh, NC-based business demonstrates strong fundamentals with $3.6M in annual revenue, $1M in seller discretionary earnings, and significant automation opportunities. The company serves both residential and commercial markets with HVAC, electrical, and plumbing services, providing recession-resistant revenue streams. With strategic implementation of field service management software, cross-selling initiatives, and government contract certification, projected EBITDA growth from $500K to $1.04M within 24 months creates exceptional value creation potential.',
  '{
    "market_size": "$31.9B government contracts opportunity",
    "location_advantages": ["Fort Bragg proximity", "Seymour Johnson AFB", "Camp Lejeune access"],
    "economic_outlook": "Top 10 state for economy and growth",
    "q1_2025_investment": "$1.1B capital investment, 2,693 new jobs",
    "competitive_position": "Strong local presence with multi-trade licensing"
  }'::jsonb,
  '{
    "fsm_implementation": {
      "cost": 20000,
      "revenue_increase_pct": 21,
      "productivity_boost_pct": 47,
      "ebitda_impact_year1": 75000,
      "timeline_months": 18
    },
    "cross_selling_potential": {
      "customer_ltv_plumbing": 8000,
      "customer_ltv_electrical": 8250,
      "target_close_rate_pct": 47.5,
      "projected_revenue_24mo": 350000
    }
  }'::jsonb,
  '{
    "year_1": {
      "revenue": 3800000,
      "gross_margin_pct": 50.5,
      "base_ebitda": 520000,
      "fsm_efficiency_gains": 75000,
      "cross_selling_impact": 80000,
      "adjusted_ebitda": 675000,
      "ebitda_margin_pct": 13.7
    },
    "year_2": {
      "revenue": 4250000,
      "gross_margin_pct": 51.0,
      "base_ebitda": 767500,
      "fsm_efficiency_gains": 25000,
      "cross_selling_impact": 150000,
      "govcon_arbitrage": 100000,
      "adjusted_ebitda": 1042500,
      "ebitda_margin_pct": 18.1
    }
  }'::jsonb,
  '{
    "pillar_1_ai_optimization": {
      "platform": "ServiceTitan or Jobber FSM",
      "implementation_cost": 20000,
      "timeline": "12-18 months",
      "impact": "21% revenue increase, 47% productivity boost"
    },
    "pillar_2_cross_selling": {
      "strategy": "Bundle HVAC, electrical, plumbing services",
      "projected_revenue": 350000,
      "timeline": "24 months"
    },
    "pillar_3_government_contracts": {
      "certifications": ["SDVOSB", "MBE", "HUBZone"],
      "market_opportunity": "31.9B annual",
      "timeline": "12-18 months for certification"
    }
  }'::jsonb,
  '{
    "key_person_dependency": {
      "risk_level": "medium",
      "mitigation": "12-month transition agreement + FSM systematization"
    },
    "technology_integration": {
      "risk_level": "low",
      "mitigation": "Phased rollout + comprehensive training"
    },
    "market_downturn": {
      "risk_level": "low",
      "mitigation": "Essential services + government contracts focus"
    },
    "capital_sourcing": {
      "risk_level": "low",
      "mitigation": "Point.com HEI vs traditional HELOC options"
    }
  }'::jsonb,
  '{
    "local_competitors": "Fragmented market with modernization gaps",
    "competitive_advantages": ["Multi-trade licensing", "Government contract access", "Technology modernization upside"],
    "market_position": "Well-positioned for consolidation and growth"
  }'::jsonb,
  0.9500
);

-- Add a few more Raleigh-area businesses to build out the portfolio
INSERT INTO public.businesses (
  business_name,
  sector,
  location,
  asking_price,
  annual_revenue,
  annual_net_profit,
  automation_opportunity_score,
  composite_score,
  description,
  strategic_flags,
  resilience_factors,
  source,
  is_active,
  last_analyzed_at
) VALUES 
(
  'Triangle Tech Solutions',
  'IT Services',
  'Raleigh, NC',
  1200000,
  1800000,
  400000,
  0.7800,
  0.8400,
  'Managed IT services provider serving small to medium businesses in the Research Triangle area.',
  '["recurring_revenue", "high_margins", "growth_market"]'::jsonb,
  '["essential_services", "recurring_contracts", "skilled_workforce"]'::jsonb,
  'manual',
  true,
  NOW()
),
(
  'Carolina Manufacturing Services',
  'Manufacturing',
  'Raleigh, NC',
  3500000,
  5200000,
  1200000,
  0.7200,
  0.8800,
  'Precision manufacturing and assembly services for automotive and aerospace industries.',
  '["government_contracts", "high_barriers_to_entry", "specialized_equipment"]'::jsonb,
  '["long_term_contracts", "specialized_capabilities", "regulatory_compliance"]'::jsonb,
  'manual',
  true,
  NOW()
);
