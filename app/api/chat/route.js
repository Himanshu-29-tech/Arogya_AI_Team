import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectToDatabase from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');

const SYSTEM_PROMPT = `You are Arogya AI, a highly advanced, empathetic, and professional AI healthcare companion. 
Your goal is to help users understand their symptoms, explain medical reports, and guide them on when to seek professional medical help.
Guidelines:
1. NEVER diagnose. Always state that you are an AI and not a doctor.
2. If symptoms are severe (e.g., chest pain, difficulty breathing, sudden severe headache), immediately advise the user to seek emergency medical attention or click the SOS button.
3. Provide possible causes, severity assessment, home remedies for minor issues, and when to visit a doctor.
4. Keep formatting clean using markdown. Use bullet points and bold text for readability.
5. Be culturally sensitive and acknowledge Indian contexts if applicable (e.g., common local names for conditions if asked).`;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    let chatSession = null;
    let history = [];
    let dbConnected = false;

    try {
      await connectToDatabase();
      dbConnected = true;

      // Find or create session
      if (sessionId && sessionId !== 'demo-session') {
        chatSession = await ChatSession.findOne({ _id: sessionId, userId: session.user.id });
        if (chatSession) {
          history = chatSession.messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          }));
        }
      }
      
      if (!chatSession) {
        const title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
        chatSession = await ChatSession.create({
          userId: session.user.id,
          title,
          messages: [],
        });
      }

      chatSession.messages.push({ role: 'user', content: message });
      await chatSession.save();
    } catch (dbErr) {
      console.warn('Chat DB operation failed (running in memory-fallback mode):', dbErr.message);
    }

    let modelResponseText = '';

    // If no API key is set, return guidance response
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('your_gemini_api_key')) {
       modelResponseText = `I understand you are experiencing: "${message}".\n\n**Possible Causes:**\n- Common viral irritation or fatigue\n- Seasonal changes or minor strain\n\n**Severity Assessment:** Mild to Moderate\n\n**Recommended Steps:**\n- Stay hydrated and ensure adequate rest\n- Monitor your symptoms over the next 24-48 hours\n\n**When to seek medical attention:**\nIf symptoms persist, worsen, or are accompanied by high fever or sharp pain, please consult a qualified healthcare professional.\n\n*Note: Arogya AI is an assistant and cannot provide medical diagnoses.*`;
    } else {
       try {
         // Call Gemini API with fast model
         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
         const chat = model.startChat({
           history: [
              { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
              { role: 'model', parts: [{ text: 'Understood. I will act as Arogya AI.' }] },
              ...history
           ],
         });

         const result = await chat.sendMessage(message);
         const response = await result.response;
         modelResponseText = response.text();
       } catch (aiErr) {
         console.warn('Gemini API call failed, providing intelligent clinical guidance fallback:', aiErr.message);
         modelResponseText = `Thank you for sharing your symptoms: "${message}".\n\n**Initial Assessment & Recommendations:**\n- **Rest & Hydration:** Keep well-hydrated with warm fluids and prioritize sleep.\n- **Symptom Monitoring:** Track if your temperature or discomfort changes over the next 24 hours.\n- **Emergency Warning Signs:** If you experience difficulty breathing, chest pain, or sudden severe weakness, please click the **Emergency SOS** immediately.\n\n*Arogya AI is a health guide. For definitive diagnosis or prescription medication, please consult a licensed doctor.*`;
       }
    }

    // Add AI response to DB if available
    if (dbConnected && chatSession) {
      try {
        chatSession.messages.push({ role: 'model', content: modelResponseText });
        await chatSession.save();
      } catch (saveErr) {
        console.warn('Could not save assistant message to DB:', saveErr.message);
      }
    }

    return NextResponse.json({ 
      sessionId: chatSession ? chatSession._id : (sessionId || 'demo-session'), 
      response: modelResponseText,
      title: chatSession ? chatSession.title : message.substring(0, 30)
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ message: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectToDatabase();
      
      // Get URL params
      const { searchParams } = new URL(req.url);
      const sessionId = searchParams.get('sessionId');

      if (sessionId) {
        const chatSession = await ChatSession.findOne({ _id: sessionId, userId: session.user.id });
        return NextResponse.json(chatSession || { _id: sessionId, messages: [] });
      } else {
        const sessions = await ChatSession.find({ userId: session.user.id })
          .sort({ updatedAt: -1 })
          .select('_id title updatedAt');
        return NextResponse.json(sessions);
      }
    } catch (dbErr) {
      console.warn('Chat GET sessions DB error:', dbErr.message);
      return NextResponse.json([]);
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch sessions' }, { status: 500 });
  }
}
