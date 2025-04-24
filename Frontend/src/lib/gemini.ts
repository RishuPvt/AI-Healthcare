import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Detect language using Devanagari script characters
function detectLanguage(prompt: string): 'hindi' | 'english' {
  return /[\u0900-\u097F]/.test(prompt) ? 'hindi' : 'english';
}

// Medical keywords in both English and Hindi
const medicalKeywords = [
  // English
  'health', 'medical', 'doctor', 'hospital', 'symptom', 'diagnosis',
  'treatment', 'medicine', 'drug', 'illness', 'disease', 'pain',
  'injury', 'prescription', 'pharmacy', 'vaccine', 'covid', 'fever',
  'headache', 'allergy', 'blood pressure', 'diabetes', 'heart', 'lung',
  'cancer', 'mental health', 'depression', 'anxiety', 'pregnancy',
  'childbirth', 'surgery', 'physical therapy', 'exercise', 'diet',
  'nutrition', 'vitamin', 'supplement', 'first aid', 'emergency', 'cough' ,'feeling weak','brain',"ears","nose",'vomiting',"cardio","neuro","hepato", "pulmo","renal","mri","surgery",
  
  // Hindi (Transliterated)
  'स्वास्थ्य', 'चिकित्सा', 'डॉक्टर', 'अस्पताल', 'लक्षण', 'निदान',
  'उपचार', 'दवा', 'दवाई', 'बीमारी', 'रोग', 'दर्द', 'चोट', 'पर्चे',
  'फार्मेसी', 'टीका', 'कोविड', 'बुखार', 'सिरदर्द', 'एलर्जी', 'रक्तचाप',
  'मधुमेह', 'दिल', 'फेफड़े', 'कैंसर', 'मानसिक स्वास्थ्य', 'अवसाद',
  'चिंता', 'गर्भावस्था', 'प्रसव', 'सर्जरी', 'फिजियोथेरेपी', 'व्यायाम',
  'आहार', 'पोषण', 'विटामिन', 'पूरक', 'प्राथमिक चिकित्सा', 'आपातकाल', 'खांसी'
];

function isMedicalQuestion(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return medicalKeywords.some(keyword => lowerPrompt.includes(keyword.toLowerCase()));
}

// Hindi disclaimer text
const HINDI_DISCLAIMER = '\nनोट: यह सामान्य जानकारी है, चिकित्सकीय सलाह नहीं। व्यक्तिगत चिंताओं के लिए कृपया किसी स्वास्थ्य सेवा पेशेवर से सलाह लें।';
const ENGLISH_DISCLAIMER = '\nNote: This is general information, not medical advice. For personal concerns, please consult a healthcare professional.';

export async function generateResponse(prompt: string) {
  try {
    const lang = detectLanguage(prompt);
    
    if (!isMedicalQuestion(prompt)) {
      return lang === 'hindi' 
        ? "मैं केवल चिकित्सा और स्वास्थ्य संबंधी प्रश्नों में विशेषज्ञ हूं। कृपया मुझे स्वास्थ्य, लक्षण, उपचार या अन्य चिकित्सा विषयों के बारे में पूछें।"
        : "I specialize only in medical and health-related questions. Please ask me about health, symptoms, treatments, or other medical topics.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const medicalInstruction = `
      You are a bilingual medical AI assistant. Follow these rules strictly:
      1. Respond in SAME LANGUAGE as the question (Hindi/English)
      2. Use bullet points (•) for responses
      3. Keep answers concise (max 6 points)
      4. Use simple ${lang === 'hindi' ? 'Hindi' : 'English'}
      5. Format: 
         ${lang === 'hindi' 
           ? '• उत्तर बिंदु 1\n• उत्तर बिंदु 2\nनोट: यह सामान्य जानकारी...' 
           : '• Point 1\n• Point 2\nNote: This is general information...'}
      
      Always include the appropriate language disclaimer at the end.
      Question: "${prompt}"
    `;

    const result = await model.generateContent(medicalInstruction);
    const response = await result.response;
    let text = response.text();

    // Ensure disclaimer exists
    const properDisclaimer = lang === 'hindi' ? HINDI_DISCLAIMER : ENGLISH_DISCLAIMER;
    if (!text.includes(properDisclaimer)) {
      text += properDisclaimer;
    }

    // Format bullets if missing
    if (!text.startsWith('•')) {
      text = text.split('\n').map(line => line.startsWith('•') ? line : `• ${line}`).join('\n');
    }

    return text;

  } catch (error) {
    console.error("Error generating response:", error);
    return detectLanguage(prompt) === 'hindi' 
      ? "कुछ त्रुटि हुई है। कृपया बाद में पुनः प्रयास करें।" 
      : "I'm having trouble responding right now. Please try again later.";
  }
}