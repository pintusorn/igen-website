import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must be in your .env file
)

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, profileData } = body
  


  try {
    console.log('[API] email:', email);
    console.log('[API] password:', password);
    console.log('SUPABASE SERVICE ROLE KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });
    console.log('[API] Supabase user creation result:', data);
    console.error('[API] createUser error:', error);  // <-- add this line

      

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const userId = data?.user?.id
    if (!userId) return NextResponse.json({ error: 'User ID not returned' }, { status: 500 })

    const { error: insertError } = await supabaseAdmin
      .from('user')
      .insert([{ ...profileData, user_id: userId }])

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
  
}
