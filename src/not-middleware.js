// import { NextResponse } from "next/server";
// import { cookies } from 'next/headers'
// import * as jose from 'jose'



// export default async function middleware(req) {
//   const publicRoute = req.nextUrl.pathname.includes("/login");
//   const token = req.cookies.get("token")?.value || "";
//   if (!publicRoute && !token) {
//     return NextResponse.redirect(new URL("/login", req.nextUrl));
//   }

//   if (publicRoute && token) {
//     return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
//   }

//   if(req.nextUrl.pathname.includes("/api")){
//     const cookieStore = cookies()

//     if(cookieStore.has('token')){
//       const {value} = cookieStore.get("token");
//       if(!value){
//         return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
//       }
//       try{
//         const secret = new TextEncoder().encode(process.env.JWT_SECRET)
//         const { payload, protectedHeader } = await jose.jwtVerify(value, secret )
//       }catch(e){
//         return NextResponse.redirect(new URL("/login", req.nextUrl));
//       }
//     }
//   }

//   NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*","/block/:path*","/users/:path*","/mandates/:path*", "/login", "/transactions/:path*",'/api/:path*'],
// };
