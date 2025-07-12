import { NextRequest, NextResponse } from 'next/server';

// Extend the global type to include activeSessions
declare global {
  // eslint-disable-next-line no-var
  var activeSessions: Map<string, {
    authenticated: boolean;
    token: string;
    refreshToken?: string;
    unitId?: string;
    expiresAt: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, token, refreshToken, unitId } = await request.json();

    if (!sessionId || !token) {
      return NextResponse.json({ 
        error: 'Session ID and token required' 
      }, { status: 400 });
    }

    // Initialize activeSessions if it doesn't exist
    if (!global.activeSessions) {
      global.activeSessions = new Map();
    }

    // Salvar sessão autenticada (expira em 1 hora)
    global.activeSessions.set(sessionId, {
      authenticated: true,
      token,
      refreshToken,
      unitId,
      expiresAt: Date.now() + (60 * 60 * 1000) // 1 hora
    });

    return NextResponse.json({ 
      success: true,
      message: 'Session authenticated successfully'
    });

  } catch (error) {
    console.error('Error authenticating session:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}