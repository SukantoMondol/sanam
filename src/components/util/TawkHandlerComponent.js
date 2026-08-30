// "use client";
// import React, {useEffect} from 'react';
// import {setCookie} from "cookies-next";

// const TawkHandlerComponent = () => {

//     useEffect(() => {
//         const observer = new MutationObserver((mutationsList, observerInstance) => {
//             const elements = document.querySelectorAll('.widget-visible');
//             if (elements.length > 0) {
//                 observerInstance.disconnect();
//                 for (let i = 0; i < elements.length; i++) {
//                     const item = elements[i];
//                     setCookie('widget-visible', `#${item.id}.widget-visible`, {maxAge: 60 * 60 * 24 * 30});
//                     document.querySelector(`#${item.id}.widget-visible`).style.setProperty('display', 'none', 'important');
//                 }
//             }
//         });
// // Start observing the document for added elements
//         observer.observe(document.body, {
//             childList: true,
//             subtree: true
//         });
//     })

//     return (
//         <></>
//     );
// };

// export default TawkHandlerComponent;
