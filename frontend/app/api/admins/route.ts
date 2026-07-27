import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userProfiles } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const adminEmailsRaw = process.env.ADMIN_EMAILS || 'www.srijankumar@gmail.com,www.ksingh144@gmail.com';
    const adminEmails = adminEmailsRaw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // Default agency editorial board & partner profiles
    const defaultAdmins: Record<string, { email: string; name: string; role: string; avatar: string }> = {
      "www.srijankumar@gmail.com": {
        email: "www.srijankumar@gmail.com",
        name: "Srijan Kumar",
        role: "Founding Partner & Strategy",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      "www.ksingh144@gmail.com": {
        email: "www.ksingh144@gmail.com",
        name: "K Singh",
        role: "Partner, Technology & Architecture",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      },
      "amelie@visionwings.com": {
        email: "amelie@visionwings.com",
        name: "Amélie Laurent",
        role: "Partner, Brand Architecture",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      "oliva@visionwings.com": {
        email: "oliva@visionwings.com",
        name: "Oliva Nacelle",
        role: "Content, Strategy+Curiosity",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
      },
      "mia@visionwings.com": {
        email: "mia@visionwings.com",
        name: "Mia di Silva",
        role: "Art Direction, Design Engineering",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
      },
      "julian@visionwings.com": {
        email: "julian@visionwings.com",
        name: "Julian Vance",
        role: "Lead Engineering & Systems",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
      }
    };

    // Try to fetch real user profiles from Neon DB to enrich the list
    try {
      const dbUsers = await db.select().from(userProfiles);
      for (const u of dbUsers) {
        const email = (u.userId || "").toLowerCase();
        if (email) {
          defaultAdmins[email] = {
            email,
            name: u.name || defaultAdmins[email]?.name || email.split("@")[0],
            role: (u.companyName as string) || defaultAdmins[email]?.role || "Team Member",
            avatar: defaultAdmins[email]?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
          };
        }
      }
    } catch (dbErr) {
      console.warn("Could not fetch userProfiles from DB in /api/admins:", dbErr);
    }

    // Ensure all emails in ADMIN_EMAILS allowlist are included
    for (const email of adminEmails) {
      if (!defaultAdmins[email]) {
        defaultAdmins[email] = {
          email,
          name: email.split("@")[0].replace(/[\._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          role: "Executive Admin",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        };
      }
    }

    return NextResponse.json(Object.values(defaultAdmins));
  } catch (err: any) {
    console.error("Failed in GET /api/admins:", err);
    return NextResponse.json({ error: "Failed to fetch admin profiles" }, { status: 500 });
  }
}
