// import { useState } from "react";
// import codeImg from "../../Assets/Code.webp";
// import { CheckCircle2, Copy } from "lucide-react";
// import { notifySuccess } from "../../Utils/Toasts.jsx";
// import { checklistItems, features } from "../../Utils/Constants.jsx";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { atomDark, coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// const Developers = () => {
//   const [activeTab, setActiveTab] = useState("python");
//   const [copiedApiKey, setCopiedApiKey] = useState({ apiKey: null, index: null });
//   const [copiedCode, setCopiedCode] = useState(false);

//   const copyToClipboard = (text, index, isCode = false) => {
//     navigator.clipboard.writeText(text).then(() => {
//       if (isCode) {
//         setCopiedCode(true);
//         notifySuccess("Code Copied to Clipboard!");
//         setTimeout(() => setCopiedCode(false), 2000);
//       } else {
//         setCopiedApiKey({ apiKey: text, index });
//         setTimeout(() => setCopiedApiKey({ apiKey: null, index: null }), 2000);
//       }
//     });
//   };

//   return (
//     <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
      
//       <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-6 tracking-wide" data-aos="fade-up" data-aos-delay="300">
//         Transform Your Development with{" "}
//         <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
//           Digi-Karshakan AI Solutions.
//         </span>
//       </h2>

//       <div className="flex flex-wrap justify-center mt-8 lg:mt-16">
//         <div className="p-2 w-full lg:w-1/2" data-aos="zoom-in" data-aos-delay="300">
//           <img src={codeImg} alt="Coding" loading="lazy"/>
//         </div>
//         <div className="p-2 w-full lg:w-1/2">
//           {checklistItems.map((item, index) => (
//             <div key={index} className="flex mb-12" data-aos="fade-up" data-aos-delay={300 + index * 100} >
//               <div className="text-[#6bc83f] mx-6 bg-neutral-200 dark:bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
//                 <CheckCircle2 />
//               </div>
//               <div>
//                 <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
//                 <p className="text-md text-neutral-500">{item.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-6 sm:mt-6 md:mt-12 lg:mt-20 tracking-wide" data-aos="fade-up" data-aos-delay="300">
//         Explore and Implement with Ou
//         <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
//         r Code Snippets
//         </span>
//       </h2>

//       <div className="flex flex-wrap justify-center mt-0 sm:mt-0 md:mt-3 lg:mt-6 px-4 lg:px-0">
//         <div className="pt-5 w-full">
//           {features.map((item, index) => (
//             <div
//               key={index}
//               className={`flex flex-col lg:flex-row mb-2 sm:mb-2 md:mb-6 lg:mb-20 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
//               data-aos="fade-up"
//               data-aos-delay={300 + index * 100}
//             >
//               <div className="w-full lg:w-3/6 p-4 lg:p-10 order-1 lg:order-1 flex flex-col justify-center md:items-start">
//                 <div className="flex items-center space-x-4 mx-2 lg:mx-6">
//                   <div className="text-[#6bc83f] bg-neutral-200 dark:bg-neutral-900 h-10 w-10 p-2 flex items-center justify-center rounded-full">
//                     {item.icon}
//                   </div>
//                   <h5 className="text-lg lg:text-xl mt-1 mb-2">{item.text}</h5>
//                 </div>
                
//                 <p className="text-md lg:text-md text-neutral-500 mx-2 lg:mx-6 mt-4">{item.description}</p>
                
//                 <div className="flex items-center space-x-2 mt-4 mx-2 lg:mx-6">
//                   <button
//                     onClick={() => copyToClipboard(item.apiKey, index)}
//                     className="flex px-2 py-1 rounded-md text-sm bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200"
//                   >
//                     {copiedApiKey.apiKey === item.apiKey && copiedApiKey.index === index ? "Copied!" : "Copy API Key"}
//                     {copiedApiKey.apiKey !== item.apiKey && <Copy size={16} className="ml-2" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="p-2 w-full lg:w-3/6 order-2 lg:order-2">
//                 <div className="mb-4">
//                   <div className="flex flex-wrap items-center justify-between space-x-2 mb-4">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => setActiveTab("python")}
//                         className={`text-sm px-2 py-1 rounded-md bg-neutral-200 dark:bg-neutral-900 ${activeTab === "python" ? "text-[#6bc83f]" : "text-neutral-900 dark:text-neutral-200"}`}
//                       >
//                         Python
//                       </button>
//                       <button
//                         onClick={() => setActiveTab("nodejs")}
//                         className={`text-sm px-2 py-1 rounded-md bg-neutral-200 dark:bg-neutral-900 ${activeTab === "nodejs" ? "text-[#6bc83f]" : "text-neutral-900 dark:text-neutral-200"}`}
//                       >
//                         Node.js 
//                       </button>
//                     </div>

//                     <button
//                       onClick={() =>
//                         copyToClipboard(
//                           activeTab === "nodejs" ? item.code.nodejs : item.code.python,
//                           null,
//                           true
//                         )
//                       }
//                       className="flex items-center bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 px-2 py-1 rounded-md text-sm mt-2 lg:mt-0"
//                     >
//                       {copiedCode ? "Copied!" : "Copy Code"}
//                       {!copiedCode && <Copy size={16} className="ml-2" />}
//                     </button>
//                   </div>

//                   <div className="syntax-highlighter-wrapper overflow-x-auto">
//                     {activeTab === "nodejs" && item.code.nodejs && (
//                       <SyntaxHighlighter language="javascript" style={coldarkDark}>
//                         {item.code.nodejs}
//                       </SyntaxHighlighter>
//                     )}
//                     {activeTab === "python" && item.code.python && (
//                       <SyntaxHighlighter language="python" style={atomDark}>
//                         {item.code.python}
//                       </SyntaxHighlighter>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Developers;
