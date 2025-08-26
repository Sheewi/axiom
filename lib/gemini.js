// lib/gemini.js - Gemini AI Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export class GeminiAI {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  }

  // Generate text response
  async generateText(prompt, context = '') {
    try {
      const fullPrompt = context ? `${context}\n\nUser: ${prompt}` : prompt;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  // Generate code with Gemini
  async generateCode(language, description, requirements = []) {
    const prompt = `
Generate ${language} code for the following requirements:

Description: ${description}

Requirements:
${requirements.map(req => `- ${req}`).join('\n')}

Please provide clean, well-commented code with proper error handling.
Include any necessary imports or dependencies.

Code:
`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Code generation error:', error);
      throw new Error('Failed to generate code');
    }
  }

  // Analyze and improve existing code
  async analyzeCode(code, language) {
    const prompt = `
Analyze the following ${language} code and provide:
1. Code quality assessment
2. Potential improvements
3. Security considerations
4. Performance optimizations
5. Best practices recommendations

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Analysis:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Code analysis error:', error);
      throw new Error('Failed to analyze code');
    }
  }

  // Firebase integration helper
  async generateFirebaseFunction(functionName, description) {
    const prompt = `
Create a Firebase Cloud Function with the following specifications:

Function Name: ${functionName}
Description: ${description}

Requirements:
- Use Firebase Functions v2 syntax
- Include proper error handling
- Add appropriate logging
- Include input validation
- Follow Firebase best practices
- Return appropriate HTTP responses

Generate the complete function code:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Firebase function generation error:', error);
      throw new Error('Failed to generate Firebase function');
    }
  }

  // Java code generation for Advanced Java Scripting
  async generateJavaCode(className, description, features = []) {
    const prompt = `
Generate Advanced Java code for a class named "${className}":

Description: ${description}

Features to implement:
${features.map(feature => `- ${feature}`).join('\n')}

Requirements:
- Use Java 21 features where appropriate
- Include proper JavaDoc comments
- Implement appropriate design patterns
- Add error handling and validation
- Include unit test examples
- Follow clean code principles

Generate the complete Java class:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Java code generation error:', error);
      throw new Error('Failed to generate Java code');
    }
  }

  // Chat with context for continuous conversation
  async chat(message, conversationHistory = []) {
    const context = conversationHistory.length > 0 
      ? 'Previous conversation:\n' + conversationHistory.map(msg => msg.role + ': ' + msg.content).join('\n') + '\n\n'
      : '';
    
    const prompt = context + 'User: ' + message;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error('Failed to process chat message');
    }
  }

  // Advanced Project Builder - Generate complete project structure from prompts
  async generateProjectPlan(prompt, projectType = 'web', requirements = [], buildContext = {}) {
    const systemPrompt = `
You are an expert software architect and project builder. Based on the user's prompt, generate a comprehensive project plan including:

1. PROJECT ANALYSIS
   - Understanding of requirements
   - Technology recommendations
   - Architecture decisions

2. FILE STRUCTURE
   - Complete directory structure
   - File organization
   - Naming conventions

3. CODE GENERATION
   - Component files with complete code
   - Configuration files
   - Package dependencies

4. IMPLEMENTATION STEPS
   - Step-by-step build process
   - Command sequences
   - Deployment instructions

5. FIREBASE INTEGRATION
   - Database schema
   - Cloud functions
   - Security rules
   - Authentication setup

6. JAVA INTEGRATION (if applicable)
   - Java class structure
   - Maven/Gradle configuration
   - Spring Boot setup (if needed)
   - Integration patterns

Project Type: ${projectType}
Build Context: ${JSON.stringify(buildContext, null, 2)}
Additional Requirements: ${requirements.join(', ')}

User Prompt: ${prompt}

Generate a detailed project plan in JSON format with the following structure:
{
  "analysis": "Project understanding and recommendations",
  "architecture": "System architecture overview",
  "fileStructure": {
    "directories": ["list of directories to create"],
    "files": [
      {
        "path": "relative/path/to/file",
        "type": "javascript|java|json|markdown|css|html",
        "content": "complete file content",
        "description": "purpose of this file"
      }
    ]
  },
  "dependencies": {
    "npm": ["list of npm packages"],
    "maven": ["list of maven dependencies"],
    "firebase": ["list of firebase services needed"]
  },
  "commands": {
    "setup": ["initialization commands"],
    "development": ["development commands"],
    "deployment": ["deployment commands"]
  },
  "features": ["list of implemented features"],
  "nextSteps": ["suggested next development steps"]
}

Ensure all code is production-ready, follows best practices, and includes proper error handling.
`;

    try {
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        return {
          analysis: text,
          error: "Could not parse structured project plan"
        };
      }
    } catch (error) {
      console.error('Project plan generation error:', error);
      throw new Error('Failed to generate project plan');
    }
  }

  // Generate specific component code
  async generateComponent(componentName, description, framework = 'react', props = []) {
    const prompt = `
Create a ${framework} component named "${componentName}":

Description: ${description}
Props: ${props.join(', ')}

Requirements:
- Use modern ${framework} patterns
- Include TypeScript if applicable
- Add proper prop validation
- Include responsive design with Tailwind CSS
- Add error boundaries and loading states
- Follow accessibility best practices
- Include comprehensive JSDoc comments

Generate the complete component code:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Component generation error:', error);
      throw new Error('Failed to generate component');
    }
  }

  // Generate database schema and Firebase rules
  async generateDatabaseSchema(description, collections = []) {
    const prompt = `
Design a Firebase Firestore database schema for:

Description: ${description}
Collections: ${collections.join(', ')}

Generate:
1. Complete Firestore data structure
2. Security rules
3. Indexes configuration
4. Data validation rules
5. Example queries
6. CRUD operations

Provide a comprehensive database design with proper relationships and security.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Database schema generation error:', error);
      throw new Error('Failed to generate database schema');
    }
  }

  // Generate API endpoints
  async generateAPI(endpoints, authentication = true) {
    const prompt = `
Generate complete API endpoints for:

Endpoints: ${endpoints.map(ep => `${ep.method} ${ep.path} - ${ep.description}`).join('\n')}

Requirements:
- Use Next.js API routes
- Include authentication: ${authentication}
- Add input validation with Zod
- Implement proper error handling
- Add rate limiting
- Include CORS configuration
- Add comprehensive logging
- Follow REST best practices
- Include OpenAPI documentation

Generate complete API implementation:
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('API generation error:', error);
      throw new Error('Failed to generate API');
    }
  }

  // Generate Java application structure
  async generateJavaApp(appName, description, features = [], springBoot = true) {
    const prompt = `
Generate a complete Java application:

Application: ${appName}
Description: ${description}
Features: ${features.join(', ')}
Use Spring Boot: ${springBoot}

Generate:
1. Project structure (Maven/Gradle)
2. Main application class
3. Configuration files
4. Entity classes
5. Repository interfaces
6. Service classes
7. Controller classes (if web app)
8. Test classes
9. Docker configuration
10. README with setup instructions

Include modern Java patterns, dependency injection, and best practices.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Java app generation error:', error);
      throw new Error('Failed to generate Java application');
    }
  }
}

export default new GeminiAI();
