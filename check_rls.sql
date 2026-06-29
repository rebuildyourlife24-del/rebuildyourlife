SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('hermes_agents', 'hermes_memory');
