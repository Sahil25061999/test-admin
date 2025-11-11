// import axios from "axios";

// // interface numbers {
// //   number: "00countrycodePhonenumber";
// // }

// const productToken = "";
// const cmUrl = "";

// export async function sendMessage(numbers, content = "", countryCode = 91) {
//   try {
//     const cmRes = await axios.post(cmUrl, {
//       messages: {
//         authentication: { producttoken: productToken },
//         msg: [
//           {
//             allowedChannels: ["SMS"],
//             from: "AURAPP",
//             to: [{number:'00917507139592'}],
//             minimumNumberOfMessageParts: 1,
//             maximumNumberOfMessageParts: 8,
//             body: {
//               type: "auto",
//               content:
//                 "Hello, Your OTP for authentication is {otp} Please do not share it with anyone. -Aura Gold",
//             },
//           },
//         ],
//       },
//     });
//     console.log(cmRes)
//   } catch (e) {
//     console.log(e);
//   }
// }

// sendMessage()