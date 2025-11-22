import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedAdmins = [
  "olivierkfrancois1@gmail.com",
  "webaigen3@gmail.com"
];

// Normalize emails for comparison (lowercase, trimmed)
const normalizedAllowedAdmins = allowedAdmins.map(email => email.toLowerCase().trim());

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ profile, account }) {
      // Get email from profile (Google OAuth provides this)
      const email = (profile?.email as string | undefined) || (account?.email as string | undefined);
      
      if (!email || typeof email !== 'string') {
        console.error("❌ Login denied: No email found in profile or account");
        return false; // Block login if no email
      }

      // Normalize email for comparison (lowercase, trimmed)
      const normalizedEmail = email.toLowerCase().trim();

      // Check if email is in allowed list
      const isAllowed = normalizedAllowedAdmins.includes(normalizedEmail);

      if (!isAllowed) {
        console.warn(`🚫 Login denied for unauthorized email: ${email}`);
        return false; // Block login
      }

      console.log(`✅ Login allowed for: ${email}`);
      return true; // Allow login
    },

    async jwt({ token, user }) {
      // Add user email to token
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      // Add email to session from token
      if (token?.email) {
        session.user = session.user || {};
        session.user.email = token.email as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // After successful login, redirect to admin-login page to set cookie
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/admin-login`;
      }
      return `${baseUrl}/admin-login`;
    },
  },

  pages: {
    signIn: "/admin-login",
  },
});

export { handler as GET, handler as POST };
