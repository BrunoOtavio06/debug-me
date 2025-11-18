import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { lessons } from '../components/lessons-view';
import { 
  Profile, 
  defaultCompetencies, 
  defaultCareers, 
  competencyLearningPaths,
  automationRiskData 
} from './career-data';

type Lesson = typeof lessons[number];

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LessonData {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: {
    explanation: string;
    example: string;
  };
}

/**
 * Builds context string from completed lessons
 */
function buildLessonContext(completedLessonIds: string[]): string {
  const completedLessons = lessons.filter(lesson => 
    completedLessonIds.includes(lesson.id)
  );

  if (completedLessons.length === 0) {
    return 'The user has not completed any lessons yet.';
  }

  let context = 'The user has completed the following lessons:\n\n';
  
  completedLessons.forEach((lesson: Lesson) => {
    context += `Lesson: ${lesson.title}\n`;
    context += `Topic: ${lesson.topic}\n`;
    context += `Difficulty: ${lesson.difficulty}\n`;
    context += `Description: ${lesson.description}\n`;
    context += `Explanation: ${lesson.content.explanation}\n`;
    context += `Example:\n${lesson.content.example}\n\n`;
  });

  return context;
}

/**
 * Builds career context string from user's profile
 */
function buildCareerContext(profile: Profile | null | undefined): string {
  if (!profile) {
    return '';
  }

  // Calculate compatibility scores for all careers
  const careerScores = defaultCareers.map(career => ({
    name: career.name,
    score: career.calculateCompatibilityScore(profile.competencies),
    requiredCompetencies: career.requiredCompetencies,
    learningPath: career.learningPath
  })).sort((a, b) => b.score - a.score);

  let context = `\n\n=== CAREER PROFILE CONTEXT ===
The user has a career profile named "${profile.name}" with the following competency levels (1-5 scale):

`;
  
  // List all competencies
  defaultCompetencies.forEach(comp => {
    const level = profile.competencies[comp.name] || 0;
    context += `- ${comp.name} (${comp.category}): Level ${level}/5 - ${comp.description}\n`;
  });

  context += `\nCareer Compatibility Scores (based on profile competencies):\n`;
  careerScores.forEach(({ name, score }) => {
    context += `- ${name}: ${score.toFixed(1)}% match\n`;
  });

  // Identify skills needing improvement (below level 3)
  const skillsNeedingImprovement = Object.entries(profile.competencies)
    .filter(([_, level]) => level < 3)
    .map(([name, level]) => ({ name, level }));

  if (skillsNeedingImprovement.length > 0) {
    context += `\nSkills needing improvement (below level 3):\n`;
    skillsNeedingImprovement.forEach(({ name, level }) => {
      context += `- ${name}: Current level ${level}/5\n`;
    });
  }

  return context;
}

/**
 * Creates the system prompt for the chatbot
 */
function createSystemPrompt(
  completedLessonIds: string[], 
  profile: Profile | null | undefined
): string {
  const lessonContext = buildLessonContext(completedLessonIds);
  const careerContext = buildCareerContext(profile);
  
  // Build competencies information
  const competenciesInfo = defaultCompetencies.map(comp => 
    `- ${comp.name} (${comp.category}): ${comp.description}`
  ).join('\n');

  // Build careers information
  const careersInfo = defaultCareers.map(career => {
    const comps = Object.entries(career.requiredCompetencies)
      .map(([name, weight]) => `${name} (${(weight * 100).toFixed(0)}%)`)
      .join(', ');
    return `- ${career.name}: Requires ${comps}. Learning path: ${career.learningPath.join('; ')}`;
  }).join('\n');

  // Build automation risk information
  const automationRiskInfo = Object.entries(automationRiskData).map(([careerName, risk]) => {
    const taskBreakdown = risk.taskBreakdown.map(t => 
    `    - ${t.task}: ${t.riskLevel} risk (${t.automationLikelihood})`
    ).join('\n');
    return `- ${careerName}: ${risk.level} risk (${risk.percentage}% automation risk)
  Task breakdown:
${taskBreakdown}
  Adaptation strategies: ${risk.adaptationStrategies.join('; ')}
  Complementary skills: ${risk.complementarySkills.join(', ')}`;
  }).join('\n\n');

  return `You are BuggyChat, a friendly and helpful AI tutor for DebugMe. You have TWO main roles:

=== ROLE 1: PROGRAMMING TUTOR ===
1. Answer questions about the programming lessons the user has already completed. Use the lesson content provided below as your reference.
2. Teach new programming concepts and topics that the user asks about, even if they haven't covered them in lessons yet.
3. Provide clear, beginner-friendly explanations with code examples when appropriate.
4. Be encouraging and supportive, helping users understand programming concepts step by step.

=== ROLE 2: CAREER GUIDANCE ADVISOR ===
You can also help with career guidance, upskilling, reskilling, job interviews, and automation risk analysis. You automatically detect when users ask career-related questions based on keywords like: career, job, interview, automation, upskill, reskilling, skill development, career path, etc.

When providing career guidance:
1. **Career Path Recommendations**: Use the compatibility scoring algorithm (same as in the career-view):
   - For each career, calculate: sum((competency_level / 5) * weight) / sum(weights) * 100
   - Recommend careers with highest compatibility scores
   - Explain why each career is a good fit based on their competencies

2. **Upskilling**: Identify skills below level 3 and suggest specific learning paths from the competency learning paths data.

3. **Reskilling**: When user wants to transition between careers:
   - Identify skill gaps between current profile and target career
   - Provide a roadmap with specific learning paths
   - Suggest which competencies to focus on first

4. **Job Interview Preparation**: Provide tips for:
   - Technical questions relevant to the career
   - Behavioral questions using STAR method
   - Common interview questions for the specific role
   - How to highlight relevant competencies

5. **Automation Risk Analysis**: 
   - Provide HIGH-LEVEL overview first: risk level (low/medium/high), percentage, and general explanation
   - When user asks for more detail, provide DETAILED breakdown:
     * Task-by-task analysis with risk levels
     * Specific automation likelihood for each task
     * Detailed adaptation strategies
     * Complementary skills to develop
     * Career pivot suggestions within tech industry
   - Reference specific competencies that help reduce automation risk
   - Be encouraging and focus on how to adapt and thrive alongside automation

${lessonContext}${careerContext}

=== AVAILABLE DATA ===

Competencies (used for career matching):
${competenciesInfo}

Available Careers:
${careersInfo}

Automation Risk Data:
${automationRiskInfo}

Competency Learning Paths:
${Object.entries(competencyLearningPaths).map(([comp, paths]) => 
  `- ${comp}: ${paths.join('; ')}`
).join('\n')}

=== INSTRUCTIONS ===

When answering questions:
- **Automatic Intent Detection**: Detect if question is about programming or career guidance
- If programming-related: Use lesson context and provide code examples (JavaScript by default)
- If career-related: Use career profile context if available, otherwise provide general guidance
- When profile exists: Provide personalized recommendations based on their competencies
- When profile doesn't exist: Still answer career questions but mention they can create a profile for personalized advice
- For automation risk: Start with high-level overview, provide detailed breakdown when requested
- Be encouraging, supportive, and actionable
- Keep explanations clear and well-structured
- Use markdown formatting for better readability`;
}

/**
 * Initialize the chatbot with OpenAI
 */
export function initializeChatbot() {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }

  return new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: apiKey,
  });
}

/**
 * Send a message to the chatbot and get a response
 */
export async function sendMessage(
  message: string,
  conversationHistory: ChatMessage[],
  completedLessonIds: string[],
  profile?: Profile | null
): Promise<string> {
  try {
    const chatModel = initializeChatbot();
    const systemPrompt = createSystemPrompt(completedLessonIds, profile || null);

    // Convert conversation history to Langchain messages
    const messages = [
      new SystemMessage(systemPrompt),
      ...conversationHistory.map(msg => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content);
        } else {
          return new AIMessage(msg.content);
        }
      }),
      new HumanMessage(message),
    ];

    // Get response from OpenAI
    const response = await chatModel.invoke(messages);
    
    return response.content as string;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is missing or invalid. Please check your .env file.');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
    }
    throw new Error('Failed to get response from AI. Please try again.');
  }
}

