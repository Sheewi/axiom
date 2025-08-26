# Axiom Technical Infrastructure - Java-JavaScript Unified Stack

## System Architecture

### Unified Technology Stack
- **Frontend**: Next.js 13+ with TypeScript, Tailwind CSS, Firebase SDK
- **Backend**: Java 21 with Spring Boot microservices + Firebase Functions bridge
- **Database**: Firebase Firestore with Java Firebase Admin SDK
- **AI Integration**: Google Gemini AI with Java and TypeScript SDKs
- **Development**: Project IDX with Maven and npm unified workflow

### Java Backend Core Implementation

```java
@SpringBootApplication
@EnableJpaRepositories
public class AxiomEcosystemApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(AxiomEcosystemApplication.class, args);
    }
    
    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        FileInputStream serviceAccount = new FileInputStream("firebase-adminsdk.json");
        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setDatabaseUrl("https://axiom-ecosystem.firebaseio.com")
            .build();
        return FirebaseApp.initializeApp(options);
    }
}
```

### Bot Framework Implementation

```java
public enum BotType {
    SCOUT("scout"),
    APPY("appy"), 
    PITCH("pitch"),
    CHAIN("chain"),
    CLICKER("clicker"),
    EARNIE("earnie"),
    POLYGLOT("polyglot"),
    ADVAULT("advault"),
    PIXEL("pixel"),
    ALEX("alex"),
    VAULT("vault"),
    MINER("miner"),
    CREATOR("creator"),
    SUBBIE("subbie"),
    ORCHESTRATOR("orchestrator");
    
    private final String name;
    BotType(String name) { this.name = name; }
}

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
### Firebase Integration Service

```java
@Service
public class FirebaseService {
    private final Firestore firestore;
    private final FirebaseAuth auth;
    private final FirebaseStorage storage;
    
    public FirebaseService() {
        this.firestore = FirestoreClient.getFirestore();
        this.auth = FirebaseAuth.getInstance();
        this.storage = StorageClient.getInstance().bucket();
    }
    
    public CompletableFuture<String> saveBotData(String botId, Object data) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                ApiFuture<WriteResult> result = firestore.collection("bots")
                    .document(botId)
                    .set(data);
                return result.get().getUpdateTime().toString();
            } catch (Exception e) {
                throw new RuntimeException("Failed to save bot data", e);
            }
        });
    }
    
    public CompletableFuture<List<Map<String, Object>>> getBotsByType(BotType botType) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                ApiFuture<QuerySnapshot> query = firestore.collection("bots")
                    .whereEqualTo("type", botType.name())
                    .get();
                
                return query.get().getDocuments().stream()
                    .map(DocumentSnapshot::getData)
                    .collect(Collectors.toList());
            } catch (Exception e) {
                throw new RuntimeException("Failed to get bots", e);
            }
        });
    }
}
```

### AI Integration with Gemini

```java
@Service
public class GeminiAIService {
    private final String apiKey;
    private final WebClient webClient;
    
    public GeminiAIService(@Value("${gemini.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta")
            .build();
    }
    
    public CompletableFuture<String> generateCode(String language, String description, List<String> requirements) {
        String prompt = String.format(
            "Generate %s code for: %s\nRequirements: %s\nProvide clean, documented code:",
            language, description, String.join(", ", requirements)
        );
        
        return generateContent(prompt);
    }
    
    public CompletableFuture<String> analyzeCode(String code, String language) {
        String prompt = String.format(
            "Analyze this %s code and provide improvements:\n%s\nAnalysis:",
            language, code
        );
        
        return generateContent(prompt);
    }
    
    private CompletableFuture<String> generateContent(String prompt) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, Object> request = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
                );
                
                return webClient.post()
                    .uri("/models/gemini-pro:generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate AI content", e);
            }
        });
    }
}
```
```

### TypeScript Frontend Bridge (Firebase Functions)

```typescript
// Firebase Functions API Gateway
import { onRequest } from 'firebase-functions/v2/https';
import { defineString } from 'firebase-functions/params';

const JAVA_SERVICE_URL = defineString('JAVA_SERVICE_URL');

export const javaServiceProxy = onRequest(async (req, res) => {
  try {
    const response = await fetch(`${JAVA_SERVICE_URL.value()}${req.path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Java service proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const createBot = onRequest(async (req, res) => {
  const { botType, configuration } = req.body;
  
  try {
    const response = await fetch(`${JAVA_SERVICE_URL.value()}/api/bots/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botType, configuration })
    });
    
    const bot = await response.json();
    res.json(bot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bot' });
  }
});
```

### Next.js Frontend Integration

```typescript
// lib/api/bots.ts
interface BotRequest {
  botType: string;
  configuration: Record<string, any>;
}

interface Bot {
  id: string;
  type: string;
  status: string;
  configuration: Record<string, any>;
  createdAt: string;
}

export class BotAPI {
  private readonly baseUrl = '/api';
  
  async createBot(request: BotRequest): Promise<Bot> {
    const response = await fetch(`${this.baseUrl}/bots/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create bot');
    }
    
    return response.json();
  }
  
  async getBots(): Promise<Bot[]> {
    const response = await fetch(`${this.baseUrl}/bots`);
    if (!response.ok) {
      throw new Error('Failed to fetch bots');
    }
    return response.json();
  }
  
  async executeWorkflow(botId: string, workflowName: string, parameters: Record<string, any>) {
    const response = await fetch(`${this.baseUrl}/bots/${botId}/workflows/${workflowName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parameters)
    });
    
    if (!response.ok) {
      throw new Error('Failed to execute workflow');
    }
    
    return response.json();
  }
}
```

## Error Handling & Resilience

### Java Exception Management

```java
@Component
public class ErrorManager {
    private final Map<String, RetryConfig> retryConfigs;
    private final Map<String, CircuitBreaker> circuitBreakers;
    
    public ErrorManager() {
        this.retryConfigs = Map.of(
            "api_failure", new RetryConfig(3, 2.0),
            "processing_error", new RetryConfig(2, 1.5),
            "firebase_error", new RetryConfig(5, 3.0)
        );
        this.circuitBreakers = new ConcurrentHashMap<>();
    }
    
    @Retryable(value = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public CompletableFuture<BotResponse> executeWithRetry(Supplier<BotResponse> operation, String operationType) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return operation.get();
            } catch (Exception e) {
                handleError(e, operationType);
                throw new RuntimeException("Operation failed after retries", e);
            }
        });
    }
    
    private void handleError(Exception error, String operationType) {
        // Log error for monitoring
        log.error("Error in operation: {} - {}", operationType, error.getMessage());
        
        // Update circuit breaker state
        CircuitBreaker breaker = circuitBreakers.computeIfAbsent(operationType, 
            k -> new CircuitBreaker(operationType));
        breaker.recordFailure();
    }
}
```

## Monitoring & Analytics

### Spring Boot Actuator Integration

```java
@Component
public class BotMetricsCollector {
    private final MeterRegistry meterRegistry;
    private final Map<String, Timer> timers;
    private final Map<String, Counter> counters;
    
    public BotMetricsCollector(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.timers = new ConcurrentHashMap<>();
        this.counters = new ConcurrentHashMap<>();
    }
    
    public void recordBotExecution(String botType, String workflow, Duration duration, boolean success) {
        // Record execution time
        Timer timer = timers.computeIfAbsent(
            String.format("bot.execution.%s.%s", botType, workflow),
            name -> Timer.builder(name)
                .description("Bot workflow execution time")
                .register(meterRegistry)
        );
        timer.record(duration);
        
        // Record success/failure count
        Counter counter = counters.computeIfAbsent(
            String.format("bot.%s.%s.%s", botType, workflow, success ? "success" : "failure"),
            name -> Counter.builder(name)
                .description("Bot workflow execution count")
                .register(meterRegistry)
        );
        counter.increment();
    }
    
    @EventListener
    public void handleBotEvent(BotExecutionEvent event) {
        recordBotExecution(
            event.getBotType(),
            event.getWorkflow(),
            event.getDuration(),
            event.isSuccess()
        );
        
        // Send to Firebase for real-time dashboard
        firebaseService.saveMetrics(event.toMap());
    }
}
```

## Security & Compliance

### Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder()))
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }
    
    @Bean
    public JwtDecoder jwtDecoder() {
        // Firebase JWT decoder configuration
        return NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
            .build();
    }
}
```

This technical infrastructure provides a solid foundation for the Axiom ecosystem using modern Java and TypeScript technologies with Firebase integration.
