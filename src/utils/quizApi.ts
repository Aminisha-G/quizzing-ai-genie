interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResponse {
  questions: QuizQuestion[];
}

const generateQuizPrompt = (topic: string, questionCount: number): string => {
  return `Generate ${questionCount} multiple choice quiz questions about "${topic}". 

Format your response as a valid JSON object with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Requirements:
- Questions should be engaging and educational
- Each question must have exactly 4 options
- correctAnswer should be the index (0-3) of the correct option
- Include brief explanations for each answer
- Questions should vary in difficulty
- Make questions specific and clear
- Avoid overly obvious or trick questions

Topic: ${topic}
Number of questions: ${questionCount}

Return ONLY the JSON object, no additional text.`;
};

export const generateQuiz = async (
  topic: string, 
  questionCount: number, 
  apiKey?: string
): Promise<QuizQuestion[]> => {
  if (!apiKey) {
    // Return mock data when no API key is provided
    return generateMockQuiz(topic, questionCount);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a quiz generator that creates educational multiple-choice questions. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: generateQuizPrompt(topic, questionCount)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    const quizData: QuizResponse = JSON.parse(content);
    
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid quiz format received');
    }

    return quizData.questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    // Fallback to mock data on error
    return generateMockQuiz(topic, questionCount);
  }
};

const generateMockQuiz = (topic: string, questionCount: number): QuizQuestion[] => {
  const mockQuestions: Record<string, QuizQuestion[]> = {
    javascript: [
      {
        id: 1,
        question: "Which of the following is used to declare a variable in JavaScript?",
        options: ["var", "let", "const", "All of the above"],
        correctAnswer: 3,
        explanation: "JavaScript has three ways to declare variables: var, let, and const, each with different scoping rules."
      },
      {
        id: 2,
        question: "What does the '===' operator do in JavaScript?",
        options: ["Assignment", "Loose equality", "Strict equality", "Not equal"],
        correctAnswer: 2,
        explanation: "The '===' operator checks for strict equality, meaning both value and type must be the same."
      },
      {
        id: 3,
        question: "Which method is used to add an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: 0,
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length."
      }
    ],
    science: [
      {
        id: 1,
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        explanation: "Gold's chemical symbol is Au, derived from the Latin word 'aurum' meaning gold."
      },
      {
        id: 2,
        question: "How many bones are in the adult human body?",
        options: ["206", "208", "210", "204"],
        correctAnswer: 0,
        explanation: "An adult human body has 206 bones, though babies are born with about 270 bones that fuse over time."
      }
    ]
  };

  // Get relevant questions or generate generic ones
  const topicKey = topic.toLowerCase();
  let questions = mockQuestions[topicKey] || mockQuestions.javascript;
  
  // If we need more questions than available, duplicate and modify
  while (questions.length < questionCount) {
    const extraQuestion: QuizQuestion = {
      id: questions.length + 1,
      question: `Sample question about ${topic}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `This is a sample explanation for a ${topic} question.`
    };
    questions = [...questions, extraQuestion];
  }

  return questions.slice(0, questionCount);
};