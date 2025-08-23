import axios from 'axios';
import httpStatus from 'http-status';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import ApiError from '../../../errors/ApiError';

interface GeneratedQuestion {
  type: 'mcq_single' | 'trueFalse' | 'shortAnswer';
  question: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
}

/**
 * Generate questions from uploaded document
 */
const generateQuestionsFromDocument = async (
  file: any
): Promise<GeneratedQuestion[]> => {
  let text = '';

  // Extract text based on file type
  if (file.mimetype === 'application/pdf') {
    const pdfData = await pdfParse(file.buffer);
    text = pdfData.text;
  } else if (
    file.mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    text = result.value;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Unsupported file type. Only PDF and DOCX are supported.'
    );
  }

  return generateQuestionsFromText(text);
};

/**
 * Generate questions from extracted text
 */
const generateQuestionsFromText = (text: string): GeneratedQuestion[] => {
  const questions: GeneratedQuestion[] = [];

  // Split text into paragraphs and then sentences
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  const allSentences: string[] = [];

  // Extract sentences from paragraphs
  for (const paragraph of paragraphs) {
    const sentences = paragraph
      .split(/[.!?][\s\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 15);

    allSentences.push(...sentences);
  }

  // Shuffle sentences for variety
  for (let i = allSentences.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSentences[i], allSentences[j]] = [allSentences[j], allSentences[i]];
  }

  // Select a limited number of sentences
  const selectedSentences = allSentences.slice(0, 30);

  // Create an even distribution of question types
  for (let i = 0; i < selectedSentences.length && questions.length < 15; i++) {
    const sentence = selectedSentences[i];

    if (i % 3 === 0) {
      const mcq = createMCQQuestion(sentence);
      if (mcq) questions.push(mcq);
    } else if (i % 3 === 1) {
      const tf = createTrueFalseQuestion(sentence);
      if (tf) questions.push(tf);
    } else {
      const sa = createShortAnswerQuestion(sentence);
      if (sa) questions.push(sa);
    }
  }

  return questions;
};

/**
 * Create MCQ question from a sentence
 */
const createMCQQuestion = (sentence: string): GeneratedQuestion | null => {
  // Find important nouns (likely to be capitalized or longer words)
  const words = sentence.split(' ').map(w => w.replace(/[.,;:?!()]/, ''));

  // Look for content words (longer than 4 chars)
  const contentWords = words.filter(w => w.length > 4);
  if (contentWords.length === 0) return null;

  // Select a random content word
  const keyTerm = contentWords[Math.floor(Math.random() * contentWords.length)];

  // Create simple question
  let question = '';

  // Different question formats
  const formats = [
    `What is ${keyTerm}?`,
    `Define ${keyTerm}.`,
    `Explain ${keyTerm}.`,
    `What does ${keyTerm} mean?`,
  ];

  question = formats[Math.floor(Math.random() * formats.length)];

  // Extract a concise answer (30-60 chars) from the sentence
  let correctAnswer = '';
  if (sentence.length > 100) {
    // For long sentences, extract a relevant portion
    const keywordPos = sentence.toLowerCase().indexOf(keyTerm.toLowerCase());
    if (keywordPos >= 0) {
      // Extract text around the keyword
      const startPos = Math.max(0, keywordPos - 20);
      const endPos = Math.min(
        sentence.length,
        keywordPos + keyTerm.length + 40
      );
      correctAnswer = sentence.substring(startPos, endPos).trim();

      // Make sure it starts with a complete word
      if (startPos > 0 && /[a-zA-Z]/.test(sentence.charAt(startPos - 1))) {
        correctAnswer = correctAnswer.substring(correctAnswer.indexOf(' ') + 1);
      }

      // Add ellipsis if truncated
      if (startPos > 0) correctAnswer = '...' + correctAnswer;
      if (endPos < sentence.length) correctAnswer = correctAnswer + '...';
    } else {
      correctAnswer = sentence.substring(0, 80) + '...';
    }
  } else {
    correctAnswer = sentence;
  }

  // Create clear, distinct options
  const options = [correctAnswer];

  // Generate three wrong but plausible answers
  const wrongAnswers = [
    `${keyTerm} is a concept unrelated to this topic.`,
    `${keyTerm} refers to something else entirely.`,
    `This term has no specific definition in this context.`,
  ];

  // Use other content words if available
  const otherWords = contentWords.filter(w => w !== keyTerm && w.length > 4);
  if (otherWords.length > 0) {
    const otherWord = otherWords[Math.floor(Math.random() * otherWords.length)];
    wrongAnswers[0] = `${keyTerm} is the same as ${otherWord}.`;
  }

  options.push(...wrongAnswers);

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    type: 'mcq_single',
    question,
    options,
    correctAnswer,
  };
};

/**
 * Create True/False question from a sentence
 */
const createTrueFalseQuestion = (sentence: string): GeneratedQuestion => {
  // Create a simple true/false question
  const makeItFalse = Math.random() > 0.5;

  // Format the original sentence to be cleaner and more concise
  let cleanSentence = sentence.trim();
  if (cleanSentence.length > 100) {
    cleanSentence = cleanSentence.substring(0, 97) + '...';
  }

  // Make sure sentence starts with capital letter and ends with period
  cleanSentence =
    cleanSentence.charAt(0).toUpperCase() + cleanSentence.slice(1);
  if (!cleanSentence.match(/[.!?]$/)) {
    cleanSentence += '.';
  }

  let statement = cleanSentence;
  let correctAnswer = 'True';

  if (makeItFalse) {
    // Create a false statement by modifying the original sentence
    const words = cleanSentence.split(' ');

    // Find key verbs or modals to negate
    const verbPositions = words.findIndex(w =>
      [
        'is',
        'are',
        'was',
        'were',
        'has',
        'have',
        'had',
        'can',
        'will',
        'should',
        'must',
        'may',
      ].includes(w.toLowerCase())
    );

    // Choose how to negate the sentence
    if (verbPositions > 0) {
      // Insert negation after verb
      words.splice(verbPositions + 1, 0, 'not');
      statement = words.join(' ');
    } else if (words.length > 3) {
      // Opposite meaning (swap a key word)
      const opposites: Record<string, string> = {
        increase: 'decrease',
        more: 'less',
        high: 'low',
        large: 'small',
        good: 'bad',
        positive: 'negative',
        important: 'insignificant',
        always: 'never',
        all: 'none',
      };

      let modified = false;
      for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase();
        if (opposites[word]) {
          words[i] = opposites[word];
          modified = true;
          break;
        }
      }

      if (!modified) {
        // If no opposite found, just add "not" at a reasonable position
        words.splice(Math.min(2, words.length - 1), 0, 'not');
      }

      statement = words.join(' ');
    } else {
      // Simple negation for short sentences
      statement = `It is not true that ${cleanSentence}`;
    }

    correctAnswer = 'False';
  }

  return {
    type: 'trueFalse',
    question: statement,
    options: ['True', 'False'],
    correctAnswer,
  };
};

/**
 * Create short answer question from a sentence
 */
const createShortAnswerQuestion = (sentence: string): GeneratedQuestion => {
  // Find potential key concepts - longer words that might be important
  const words = sentence.split(' ').map(w => w.replace(/[.,;:?!()]/, ''));
  const keyWords = words.filter(word => word.length > 5);

  if (keyWords.length === 0) {
    // No good keywords, create a simple general question
    return {
      type: 'shortAnswer',
      question: `Explain this concept in your own words.`,
      correctAnswer: formatAnswer(sentence),
    };
  }

  // Pick a keyword to build the question around
  const keyword = keyWords[Math.floor(Math.random() * keyWords.length)];

  // Create different question formats
  const questionFormats = [
    `What is ${keyword}?`,
    `Explain ${keyword}.`,
    `Define ${keyword}.`,
    `Describe ${keyword} in your own words.`,
  ];

  const question =
    questionFormats[Math.floor(Math.random() * questionFormats.length)];

  // Create a concise, readable answer
  let answer = '';

  // Try to find a definition or explanation in the text
  if (
    sentence.includes(`${keyword} is`) ||
    sentence.includes(`${keyword} are`)
  ) {
    // Extract definition pattern: "X is/are Y"
    const regex = new RegExp(`${keyword} (is|are) [^.!?;]*`, 'i');
    const match = sentence.match(regex);
    if (match) {
      answer = match[0];
    }
  }

  // If no specific definition found, use the whole sentence
  if (!answer) {
    answer = sentence;
  }

  return {
    type: 'shortAnswer',
    question,
    correctAnswer: formatAnswer(answer),
  };
};

/**
 * Format answer to be clean and readable
 */
const formatAnswer = (text: string): string => {
  let answer = text.trim();

  // Limit length
  if (answer.length > 150) {
    answer = answer.substring(0, 147) + '...';
  }

  // Make sure it starts with capital letter
  answer = answer.charAt(0).toUpperCase() + answer.slice(1);

  // Make sure it ends with proper punctuation
  if (!answer.match(/[.!?]$/)) {
    answer += '.';
  }

  return answer;
};

/**
 * Generate questions using OpenAI API
 */
const generateQuestionsFromOpenAI = async (
  text: string
): Promise<GeneratedQuestion[]> => {
  // First try the rule-based approach as a fallback
  let questions = generateQuestionsFromText(text);

  // If we need to skip the API call due to rate limiting, return the rule-based questions
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      'OPENAI_API_KEY not set, using rule-based question generation'
    );
    return questions;
  }

  try {
    // Limit text length to avoid token limits
    const maxChars = 1000; // Drastically reduce content to avoid rate limits
    const truncatedText =
      text.length > maxChars ? text.substring(0, maxChars) + '...' : text;

    // OpenAI API call using the chat completions API with retry logic
    const maxRetries = 3;
    let retries = 0;
    let success = false;
    let response;

    while (!success && retries < maxRetries) {
      try {
        response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert at creating multiple-choice exam questions.',
              },
              {
                role: 'user',
                content: `Generate 3 multiple-choice questions based on this text: ${truncatedText}`,
              },
            ],
            max_tokens: 350, // Reduce token count
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          }
        );
        success = true;
      } catch (err: any) {
        retries++;
        // If it's a rate limit error (429), wait and retry
        if (err.response && err.response.status === 429) {
          console.log(`Rate limited, retrying in ${retries * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retries * 2000));
        } else {
          // For other errors, throw immediately
          throw err;
        }
      }
    }

    if (!success || !response) {
      console.warn(
        'Failed to generate questions with OpenAI after retries, using rule-based generation'
      );
      return questions;
    }

    // Parse the response - for chat completions the format is different
    const aiText = response.data.choices[0].message.content.trim();
    const aiQuestions = parseOpenAIResponse(aiText);

    // If we got AI-generated questions, return them; otherwise, fall back to rule-based
    return aiQuestions.length > 0 ? aiQuestions : questions;
  } catch (error) {
    console.error('OpenAI API error:', error);
    console.warn('Falling back to rule-based question generation');
    return questions; // Return rule-based questions as fallback
  }
};

/**
 * Parse OpenAI response into structured question format
 */
const parseOpenAIResponse = (aiText: string): GeneratedQuestion[] => {
  const questions: GeneratedQuestion[] = [];
  console.log('Parsing AI response:', aiText);

  try {
    // Try to parse responses in various formats that the AI might return

    // Method 1: Split by numbered questions (1. 2. etc.)
    let questionBlocks = aiText
      .split(/\n\s*\d+\./)
      .filter(block => block.trim().length > 0);

    // If that didn't work, try alternative splitters
    if (questionBlocks.length <= 1) {
      questionBlocks = aiText
        .split(/\n\s*Question \d+:/i)
        .filter(block => block.trim().length > 0);
    }

    for (const block of questionBlocks) {
      try {
        // Skip if not an actual question
        if (!block.includes('?')) continue;

        // Extract the question text
        const questionParts = block.split('?');
        const questionText = questionParts[0] + '?';

        // First try to look for a), b), c) pattern
        let options: string[] = [];
        let correctAnswer = '';

        // Try to find options marked with a), b), c)
        const optionsText = questionParts.slice(1).join('?');
        const optionsMatch = optionsText.match(/([a-d])[).]\s+([^\n]+)/gi);

        if (optionsMatch && optionsMatch.length >= 2) {
          options = optionsMatch.map(opt =>
            opt.replace(/^[a-d][).]\s+/i, '').trim()
          );

          // Try multiple formats for correct answer
          const answerPatterns = [
            /(?:answer|correct|answer:)\s*([a-d])[).]/i,
            /(?:answer|correct|answer is):?\s*["']?([a-d])["']?/i,
            /(?:answer|correct|answer is):?\s*([a-d])[).]/i,
            /(?:answer|correct|answer is):?\s*option\s*([a-d])/i,
          ];

          let answerLetter = '';
          for (const pattern of answerPatterns) {
            const match = optionsText.match(pattern);
            if (match) {
              answerLetter = match[1].toLowerCase();
              break;
            }
          }

          if (answerLetter) {
            const answerIndex = answerLetter.charCodeAt(0) - 'a'.charCodeAt(0);
            if (answerIndex >= 0 && answerIndex < options.length) {
              correctAnswer = options[answerIndex];
            }
          }

          // If we couldn't determine the answer but have options, use the first one
          if (!correctAnswer && options.length > 0) {
            correctAnswer = options[0];
            console.warn(
              'Could not determine correct answer, using first option'
            );
          }

          // Only add the question if we have options and a correct answer
          if (options.length >= 2 && correctAnswer) {
            questions.push({
              type: 'mcq_single',
              question: questionText.trim(),
              options,
              correctAnswer,
            });
          }
        }
      } catch (error) {
        console.error('Error parsing question block:', error);
        // Skip this block and continue
      }
    }
  } catch (error) {
    console.error('Error during AI response parsing:', error);
  }

  return questions;
};

export const UploadService = {
  generateQuestionsFromDocument,
  generateQuestionsFromOpenAI,
};
