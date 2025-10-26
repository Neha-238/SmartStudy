// let prompt = document.querySelector("#prompt");
// let chatContainer = document.querySelector(".chat-container");
// let imagebtn = document.querySelector("#image");
// let imageinput = document.querySelector("#image input");

// let user = {
//   message: null,
//   file: {
//     mime_type: "null",
//     data: "null",
//   },
// };

// function createChatBox(html, classes) {
//   let div = document.createElement("div");
//   div.innerHTML = html;
//   div.classList.add(classes);
//   return div;
// }

// function handlechatResponse(message) {
//   user.message = message;
//   let html = ` <div class="user-chat-area">
//          ${user.message}
//          ${
//            user.file.data
//              ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimage" />`
//              : ""
//          }
//         </div>`;
//   prompt.value = "";
//   let userChatBox = createChatBox(html, "user-chat-box");
//   chatContainer.appendChild(userChatBox);

//   setTimeout(() => {
//     let html = ` <div class="ai-chat-area">
//          <img src="images/loading.gif" alt="loading..." class="loading-gif" />
//         </div>`;
//     let aiChatBox = createChatBox(html, "ai-chat-box");
//     chatContainer.appendChild(aiChatBox);
//     generateResponse(message, aiChatBox);
//   }, 600);
// }

// async function generateResponse(promptText, aiChatBox) {
//   user.message = promptText;
//   const res = await fetch("http://localhost:3000/api/generate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             { text: promptText },
//             //Include user-uploaded image if present
//             ...(user.file?.data && user.file.data !== "null"
//               ? [{ inline_data: user.file }]
//               : []),
//           ],
//         },
//       ],
//     }),
//   });

//   const data = await res.json();
//   console.log(data);
//   const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";
//   aiChatBox.innerHTML = `<div class="ai-chat-area">${aiText}</div>`;
// }

// //******EVENTS************ */

// prompt.addEventListener("keydown", (e) => {
//   if (e.key == "Enter") {
//     handlechatResponse(prompt.value);
//   }
// });

// imageinput.addEventListener("change", () => {
//   const file = imageinput.files[0];
//   if (!file) {
//     return;
//   }
//   let reader = new FileReader();
//   reader.onload = (e) => {
//     console.log(e);
//     let base64str = e.target.result.split(",")[1];

//     user.file = {
//       mime_type: file.type,
//       data: base64str,
//     };
//   };
//   reader.readAsDataURL(file);
// });

// imagebtn.addEventListener("click", () => {
//   imagebtn.querySelector("input").click();
// });

let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let imageinput = document.querySelector("#image input");
let submitbtn = document.querySelector("#submit");

let user = {
  message: null,
  file: {
    mime_type: "null",
    data: "null",
  },
};

// Create chat box element
function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Handle user input
function handlechatResponse(message) {
  if (!message.trim()) return;

  user.message = message;
  let html = `
    <div class="user-chat-area">
      ${user.message}
      ${
        user.file.data && user.file.data !== "null"
          ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimage" />`
          : ""
      }
    </div>`;

  prompt.value = "";
  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);

  setTimeout(() => {
    let html = `
      <div class="ai-chat-area">
        <img src="images/loading.gif" alt="loading..." class="loading-gif" />
      </div>`;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(message, aiChatBox);
  }, 600);
}

async function generateResponse(promptText, aiChatBox) {
  try {
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptText },
              ...(user.file?.data && user.file.data !== "null"
                ? [{ inline_data: user.file }]
                : []),
            ],
          },
        ],
      }),
    });

    const data = await res.json();
    console.log(data);

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a reply.";
    aiChatBox.innerHTML = `<div class="ai-chat-area">${aiText}</div>`;
  } catch (error) {
    console.error(error);
    aiChatBox.innerHTML =
      "<div class='ai-chat-area error'>Error: Could not connect to server.</div>";
  }
}

// ****** EVENTS ************

// Press Enter to send message
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handlechatResponse(prompt.value);
  }
});

// Click send button
submitbtn.addEventListener("click", () => {
  handlechatResponse(prompt.value);
});

// Upload image
imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = (e) => {
    let base64str = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64str,
    };
  };
  reader.readAsDataURL(file);
});

// Click image button triggers file input
imagebtn.addEventListener("click", () => {
  imageinput.click();
});
