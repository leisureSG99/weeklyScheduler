import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;
  
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('schedule_entries')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = params;
  const body = await request.json();
  
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('schedule_entries')
    .update(body)
    .eq('id', id)
    .select();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data[0]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = params;
  
  const supabase = createClient();
  
  const { error } = await supabase
    .from('schedule_entries')
    .delete()
    .eq('id', id);
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
} 