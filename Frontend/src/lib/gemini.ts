import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

function isMedicalQuestion(prompt: string): boolean {
  const medicalKeywords = [
    'health', 'medical', 'doctor', 'hospital', 'symptom', 'diagnosis',
    'treatment', 'medicine', 'drug', 'illness', 'disease', 'pain',
    'injury', 'prescription', 'pharmacy', 'vaccine', 'covid', 'fever',
    'headache', 'allergy', 'blood pressure', 'diabetes', 'heart', 'lung',
    'cancer', 'mental health', 'depression', 'anxiety', 'pregnancy',
    'childbirth', 'surgery', 'physical therapy', 'exercise', 'diet',
    'nutrition', 'vitamin', 'supplement', 'first aid', 'emergency' , "cough"
  ];

  const lowerPrompt = prompt.toLowerCase();
  return medicalKeywords.some(keyword => lowerPrompt.includes(keyword));
}

export async function generateResponse(prompt: string) {
  try {
    if (!isMedicalQuestion(prompt)) {
      return "I specialize only in medical and health-related questions. Please ask me about health, symptoms, treatments, or other medical topics.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const medicalInstruction = `
      You are a medical AI assistant that provides concise, point-form responses to health questions.
      Follow these guidelines strictly:
      
      1. Respond ONLY to medical/health-related questions
      2. Format answers in clear bullet points
      3. Keep responses brief but informative (max 6 points)
      4. Use simple language anyone can understand
      5. Always include this disclaimer at the end:
         "Note: This is general information, not medical advice. For personal concerns, please consult a healthcare professional."
      
      Example response format:
      • Point 1
      • Point 2
      • Point 3
      Note: This is general information...
      
      Now answer this medical question: "${prompt}"
    `;
    
    const result = await model.generateContent(medicalInstruction);
    const response = await result.response;
    const text = response.text();
    
    // Ensure the response is properly formatted
    if (!text.startsWith('•') && !text.startsWith('*')) {
      return `• ${text.replace(/\n/g, '\n• ')}\nNote: This is general information, not medical advice. For personal concerns, please consult a healthcare professional.`;
    }
    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm having trouble responding right now. Please try again later.";
  }
}