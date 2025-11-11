import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Authorized phone numbers list
const AUTHORIZED_PHONE_NUMBERS = [
  "+917010935074",
  "+917401592702",
  "+917507139592",
  "+919450628820",
  "+918144127115",
  "+918248399262",
  "+918144127115",
  "+919841432183",
  // Add more authorized phone numbers as needed
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP Login",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        try {
          // Check if phone number is in authorized list
          const phoneWithCountryCode = `+91${credentials.phone}`;
          if (!AUTHORIZED_PHONE_NUMBERS.includes(phoneWithCountryCode)) {
            console.log(`Unauthorized phone number attempt: ${phoneWithCountryCode}`);
            return null;
          }

          const resp = await axios.post(`${process.env.NEXT_PUBLIC_CHRYSUS_URI}auth/v1/verify-otp`, {
            phone: credentials.phone,
            country_code: "91",
            otp: credentials.otp,
            is_admin: false,
          });
          //
          const user = resp.data?.data;
          console.log("USER==>", user);
          if (user?.access_token) {
            return {
              id: credentials.phone,
              phone: credentials.phone,
              accessToken: user.access_token,
              refreshToken: user.refresh_token,
            };
          }
          return null;
        } catch (err) {
          console.error("OTP Verification Failed", err.response?.data || err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT==>", token, user);
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("SESSION==>", session, token);
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.token = token;
      session.phone = token.phone;
      return session;
    },
  },
  pages: {
    signIn: "/login", // your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
