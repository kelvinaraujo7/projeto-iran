import { NextRequest, NextResponse } from 'next/server';

const activeSessions = new Map<string, {
  authenticated: boolean;
  token?: string;
  refreshToken?: string;
  unitId?: string;
  expiresAt: number;
}>();

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const sessionId = params.sessionId;

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  const session = activeSessions.get(sessionId);

  if (!session) {
    return NextResponse.json({ 
      authenticated: false,
      message: 'Session not found'
    });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return NextResponse.json({ 
      authenticated: false,
      message: 'Session expired'
    });
  }

  return NextResponse.json({
    authenticated: session.authenticated,
    token: session.token,
    refreshToken: session.refreshToken,
    unitId: session.unitId
  });
}