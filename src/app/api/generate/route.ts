import { NextRequest, NextResponse } from 'next/server';
import { researchAndGenerateGuide } from '@/lib/geminiResearchAgent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.query !== 'string' || !body.query.trim()) {
      return NextResponse.json(
        { error: 'Please provide an app name or website to research.' },
        { status: 400 }
      );
    }

    const { guide, cached, slug } = await researchAndGenerateGuide(body.query);

    return NextResponse.json({
      success: true,
      guide,
      cached,
      slug,
      url: `/guide/${slug}`,
    });
  } catch (error: any) {
    console.error('API /api/generate error:', error);

    const errorMessage = error?.message || 'This is busy, please try again in a minute.';

    // If it's the missing key error, return a 400 so the user gets clear config feedback
    if (errorMessage.includes('GEMINI_API_KEY is not configured')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Default rate limit or error message as required by instructions
    return NextResponse.json(
      { error: 'This is busy, please try again in a minute.' },
      { status: 429 }
    );
  }
}
