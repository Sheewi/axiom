# Axiom Unified Technology Stack - Java Integration Guide

## Overview
This document ensures all prompts 1-13 follow a consistent technology infrastructure with Java integration for Advanced Java Scripting coursework.

## Core Technology Stack

### Frontend (Web Application)
- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand + React Query
- **UI Components**: Radix UI + Custom components
- **Authentication**: NextAuth.js integrated with Firebase Auth
- **Real-time**: Firebase SDK for live data synchronization

### Backend Services
- **Primary**: Java 21 with Spring Boot microservices
- **API Gateway**: Firebase Functions (Node.js/TypeScript)
- **Authentication**: Firebase Auth + Spring Security
- **Database Integration**: Java Firebase Admin SDK
- **AI Services**: Google Gemini AI (Java + TypeScript SDKs)

### Database & Storage
- **Primary Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **Real-time Database**: Firebase Realtime Database
- **Caching**: Redis (when needed)
- **Vector Database**: Weaviate (for AI embeddings)

### Development Environment
- **Cloud IDE**: Project IDX (Google)
- **Build Tools**: Maven (Java) + npm (Frontend)
- **Version Control**: GitHub with Actions CI/CD
- **Hosting**: Firebase Hosting
- **Functions**: Firebase Functions

## Java Integration Architecture

### Bot Framework Structure
```java
// All bots extend this base class
@Component
public abstract class BaseBot {
    @Autowired
    protected FirebaseService firebaseService;
    
    @Autowired 
    protected GeminiAIService geminiService;
    
    protected BotType botType;
    protected Map<String, WorkflowHandler> workflows;
    
    public BaseBot(BotType botType) {
        this.botType = botType;
        this.workflows = new HashMap<>();
        initializeWorkflows();
    }
    
    protected abstract void initializeWorkflows();
    
    public CompletableFuture<BotResponse> executeWorkflow(String workflowName, Map<String, Object> parameters) {
        WorkflowHandler handler = workflows.get(workflowName);
        if (handler == null) {
            throw new IllegalArgumentException("Workflow not found: " + workflowName);
        }
        return handler.execute(parameters);
    }
}
```

### Firebase Integration Pattern
```java
@Service
public class FirebaseService {
    private final Firestore firestore = FirestoreClient.getFirestore();
    private final FirebaseAuth auth = FirebaseAuth.getInstance();
    
    public CompletableFuture<String> saveBotData(String collection, Object data) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                ApiFuture<WriteResult> result = firestore.collection(collection)
                    .document()
                    .set(data);
                return result.get().getUpdateTime().toString();
            } catch (Exception e) {
                throw new RuntimeException("Failed to save data", e);
            }
        });
    }
}
```

## Bot Implementation Consistency

### All 15 Bots Follow This Pattern:
1. **Scout Bot**: Market intelligence (Java + web scraping)
2. **Appy Bot**: App development (Java + Firebase)
3. **Pitch Bot**: Content creation (Java + Gemini AI)
4. **Chain Bot**: Blockchain operations (Java + Web3j)
5. **Clicker Bot**: Click automation (Java + Selenium)
6. **Earnie Bot**: Revenue optimization (Java + Analytics)
7. **Polyglot Bot**: Translation services (Java + Translation APIs)
8. **AdVault Bot**: Ad management (Java + Ad platforms)
9. **Pixel Bot**: Image processing (Java + ImageIO)
10. **Alex Bot**: Customer service (Java + NLP)
11. **Vault Bot**: Security management (Java + Security)
12. **Miner Bot**: Data mining (Java + Analytics)
13. **Creator Bot**: Content generation (Java + AI)
14. **Subbie Bot**: Subscription management (Java + Payment APIs)
15. **Orchestrator Bot**: System coordination (Java + All services)

## Frontend-Backend Communication

### API Flow
```typescript
// Frontend (Next.js/TypeScript)
const response = await fetch('/api/bots/execute', {
  method: 'POST',
  body: JSON.stringify({ botType: 'SCOUT', workflow: 'discover_trends', parameters })
});

// Firebase Function (TypeScript Bridge)
export const executeBotWorkflow = onRequest(async (req, res) => {
  const javaServiceUrl = process.env.JAVA_SERVICE_URL;
  const response = await fetch(`${javaServiceUrl}/api/bots/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.json(await response.json());
});

// Java Backend (Spring Boot)
@PostMapping("/api/bots/execute")
public ResponseEntity<BotResponse> executeBotWorkflow(@RequestBody WorkflowRequest request) {
    Bot bot = botRegistry.getBot(request.getBotType());
    CompletableFuture<BotResponse> result = bot.executeWorkflow(request.getWorkflow(), request.getParameters());
    return ResponseEntity.ok(result.join());
}
```

## Project Structure
```
axiom/
├── frontend/                 # Next.js application
│   ├── pages/               # Page components
│   ├── components/          # Reusable components  
│   ├── lib/                 # Utilities and API clients
│   └── styles/              # Tailwind CSS
├── functions/               # Firebase Functions (TypeScript)
│   ├── src/                 # Function implementations
│   └── package.json         # Node.js dependencies
├── axiom-java/              # Java backend services
│   ├── src/main/java/       # Java source code
│   ├── src/main/resources/  # Configuration files
│   └── pom.xml              # Maven dependencies
├── firebase.json            # Firebase configuration
└── .idx/                    # Project IDX configuration
```

## Educational Integration

### Advanced Java Scripting Course Alignment
- **Design Patterns**: Factory, Singleton, Observer, Strategy patterns in bot implementations
- **Concurrency**: CompletableFuture and reactive programming
- **Enterprise Integration**: Spring Boot, dependency injection, RESTful APIs
- **Database Integration**: Firebase Admin SDK, ORM patterns
- **Testing**: JUnit 5, Mockito, integration testing
- **Security**: Spring Security, JWT tokens, HTTPS
- **Monitoring**: Spring Actuator, metrics collection
- **Deployment**: Docker containers, cloud deployment

## Updated Prompt Guidelines

When updating prompts 4-13, ensure:
1. Replace Python code with Java implementations
2. Use Firebase services instead of multiple databases
3. Integrate Spring Boot framework patterns
4. Include Firebase Admin SDK usage
5. Use Gemini AI for intelligence features
6. Follow the BaseBot inheritance pattern
7. Implement proper error handling and logging
8. Include TypeScript frontend integration examples

## Next Steps
1. Update remaining prompts (4-13) with Java implementations
2. Create Maven project structure for axiom-java module
3. Implement base classes and shared services
4. Set up Firebase configuration and credentials
5. Create Next.js pages for bot management
6. Deploy to Project IDX for cloud development
