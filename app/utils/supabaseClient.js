const { createClient } = require('@supabase/supabase-js');

// Récupérer les variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL || 'https://htxebvruzoabicaxhzak.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eGVidnJ1em9hYmljYXhoemFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NzY5ODgsImV4cCI6MjA1OTQ1Mjk4OH0.HEMM7Y1NUOdDyBTgdpNh8YrBDXSF9-rzAn71UfdudPM';

// Créer une instance du client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 