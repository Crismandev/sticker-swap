import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrmlitsvwqpvahetvzaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybWxpdHN2d3FwdmFoZXR2emF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDMzNzEsImV4cCI6MjA5NDc3OTM3MX0.useg95joCX2nOsqWsCWo4qCBRcxZzF-O5_zOml9TBcY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('stickers').select('*').limit(1);
  console.log('Stickers:', data, error);
}
run();
