import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// Simple AI moderation simulation (replace with actual AI service)
async function moderateMessage(content: string): Promise<{ isAllowed: boolean; reason?: string }> {
  const lowerContent = content.toLowerCase();
  
  // Basic keyword filter (replace with actual AI moderation API)
  const blockedKeywords = ["spam", "scam", "harmful"];
  const containsBlocked = blockedKeywords.some(keyword => lowerContent.includes(keyword));
  
  if (containsBlocked) {
    return { isAllowed: false, reason: "Message contains inappropriate content" };
  }
  
  // Check for excessive caps or repeated characters
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.7 && content.length > 20) {
    return { isAllowed: false, reason: "Excessive use of capital letters" };
  }
  
  // Add more sophisticated AI moderation here
  // Example: Call OpenAI Moderation API, Perspective API, etc.
  
  return { isAllowed: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientUsername, content, vibe } = body;

    // Validate input
    if (!recipientUsername || !content || !vibe) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "Message too long (max 500 characters)" },
        { status: 400 }
      );
    }

    // Moderate message content
    const moderation = await moderateMessage(content);
    if (!moderation.isAllowed) {
      return NextResponse.json(
        { error: moderation.reason || "Message did not pass moderation" },
        { status: 400 }
      );
    }

    // Find recipient by username
    const usersRef = adminDb.collection("users");
    const userQuery = await usersRef.where("username", "==", recipientUsername).limit(1).get();

    if (userQuery.empty) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const recipientDoc = userQuery.docs[0];
    const recipientId = recipientDoc.id;

    // Save message to Firestore
    const messageData = {
      recipientId,
      recipientUsername,
      content,
      vibe,
      status: "pending", // pending, approved, rejected
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    const messageRef = await adminDb.collection("messages").add(messageData);

    return NextResponse.json(
      { 
        success: true, 
        messageId: messageRef.id,
        message: "Message sent successfully" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from auth token (implement proper auth)
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract user ID from token (implement proper JWT verification)
    // const userId = await verifyToken(authHeader);

    // For now, return empty array
    // Replace with actual query once auth is implemented
    return NextResponse.json({ messages: [] });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
