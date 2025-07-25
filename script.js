// =================================================================================
// Step 1: Import the functions you need from the Firebase SDKs
// =================================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// =================================================================================
// Step 2: IMPORTANT! PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
// Replace the placeholder values with the actual keys from your Firebase project.
// =================================================================================
  const firebaseConfig = {

    apiKey: "AIzaSyA-tPQctjzQuqrluRW808H1ZwDp8VJHHNk",

    authDomain: "dailydish-9e4b7.firebaseapp.com",

    projectId: "dailydish-9e4b7",

    storageBucket: "dailydish-9e4b7.firebasestorage.app",

    messagingSenderId: "8685672956",

    appId: "1:8685672956:web:b63ee3ffd589e9c3f9ba79",

    measurementId: "G-MQKMQPYGCG"

  };


// =================================================================================
// Step 3: The rest of your code, wrapped in a try/catch block for safety
// =================================================================================
try {
    // Initialize Firebase and Firestore
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase is initialized and connected!");

    // --- SELECT ELEMENTS FROM THE HTML ---
    const dealForm = document.getElementById('deal-form');
    const formMessage = document.getElementById('form-message');
    const dealList = document.getElementById('deal-list');

    // --- REAL-TIME DATA LISTENER ---
    const q = query(collection(db, "deals"));
    onSnapshot(q, (querySnapshot) => {
        dealList.innerHTML = ''; 
        if (querySnapshot.empty) {
            dealList.innerHTML = `<p class="text-center text-stone-500 col-span-full">No deals available right now. Be the first to post one!</p>`;
            return;
        }
        querySnapshot.forEach((doc) => {
            const deal = doc.data();
            const dealCardHTML = `
                <div class="perspective-container animate-on-scroll is-visible">
                    <div class="card-3d bg-white rounded-xl shadow-md flex flex-col border-t-4 border-emerald-400">
                        <div class="p-6 flex-grow">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-2xl font-bold text-stone-800">${deal.productName}</h3>
                                <span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">${deal.category}</span>
                            </div>
                            <p class="text-stone-600 mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                                ${deal.shopName}
                            </p>
                            <div class="flex justify-between items-center mb-4">
                                <div class="flex items-baseline">
                                    <p class="text-3xl font-bold text-emerald-500">₹${deal.discountedPrice}</p>
                                    <p class="text-lg text-stone-400 line-through ml-2">₹${deal.originalPrice}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-stone-50 px-6 py-3">
                             <p class="text-sm text-stone-500 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
                                Expires on: ${deal.expiryDate}
                             </p>
                        </div>
                    </div>
                </div>
            `;
            dealList.innerHTML += dealCardHTML;
        });
    });

    // --- FORM SUBMISSION LISTENER ---
    dealForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dealData = {
            productName: dealForm.productName.value, shopName: dealForm.shopName.value,
            originalPrice: Number(dealForm.originalPrice.value), discountedPrice: Number(dealForm.discountedPrice.value),
            category: dealForm.category.value, expiryDate: dealForm.expiryDate.value,
            createdAt: new Date()
        };
        try {
            const docRef = await addDoc(collection(db, "deals"), dealData);
            formMessage.textContent = "Your deal has been posted successfully!";
            formMessage.style.color = "green";
            dealForm.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            formMessage.textContent = "Error: Could not post deal. Please try again.";
            formMessage.style.color = "red";
        }
        setTimeout(() => { formMessage.textContent = ""; }, 5000);
    });

} catch (error) {
    console.error("Firebase initialization failed:", error);
    alert("Could not connect to the database. Please check your Firebase configuration in script.js.");
}


// --- Animation Logic (can stay at the bottom) ---
const scrollElements = document.querySelectorAll(".animate-on-scroll");
const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
};
const displayScrollElement = (element) => { element.classList.add("is-visible"); };
const handleScrollAnimation = () => {
    scrollElements.forEach((el) => { if (elementInView(el, 1.25)) { displayScrollElement(el); } })
}
window.addEventListener("scroll", handleScrollAnimation);
const heroSection = document.getElementById('hero-section');
const heroContent = document.getElementById('hero-content');
heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { offsetWidth, offsetHeight } = heroSection;
    const xPos = (clientX / offsetWidth - 0.5) * 30;
    const yPos = (clientY / offsetHeight - 0.5) * 30;
    heroContent.style.transform = `translate(${xPos}px, ${yPos}px)`;
});
handleScrollAnimation(); // Run once on load
