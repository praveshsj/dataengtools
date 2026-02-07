// Theme Management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// Questionnaire Data
const questions = [
    {
        id: 1,
        text: "What is your latency requirement?",
        help: "How quickly do you need data to be available after it's generated?",
        options: [
            { 
                id: "realtime", 
                title: "Real-time (< 1 second)", 
                description: "Immediate processing required (e.g., fraud detection, real-time dashboards)",
                score: { streaming: 10, batch: 0, hybrid: 5 }
            },
            { 
                id: "near-realtime", 
                title: "Near real-time (< 5 minutes)", 
                description: "Quick processing acceptable (e.g., monitoring alerts, recent analytics)",
                score: { streaming: 8, batch: 2, hybrid: 9 }
            },
            { 
                id: "hourly", 
                title: "Hourly updates", 
                description: "Hourly refresh is sufficient (e.g., business dashboards)",
                score: { streaming: 3, batch: 7, hybrid: 8 }
            },
            { 
                id: "daily", 
                title: "Daily or longer", 
                description: "Daily batch processing is fine (e.g., reports, historical analysis)",
                score: { streaming: 0, batch: 10, hybrid: 3 }
            }
        ]
    },
    {
        id: 2,
        text: "What is your data volume?",
        help: "How much data are you processing per hour?",
        options: [
            { 
                id: "low", 
                title: "< 1 GB/hour", 
                description: "Small data volumes, simple infrastructure sufficient",
                score: { streaming: 5, batch: 8, hybrid: 3 }
            },
            { 
                id: "medium", 
                title: "1-100 GB/hour", 
                description: "Moderate volumes, scalable solution needed",
                score: { streaming: 7, batch: 7, hybrid: 8 }
            },
            { 
                id: "high", 
                title: "100 GB - 1 TB/hour", 
                description: "High throughput, distributed processing required",
                score: { streaming: 8, batch: 6, hybrid: 9 }
            },
            { 
                id: "very-high", 
                title: "> 1 TB/hour", 
                description: "Very large scale, enterprise-grade infrastructure",
                score: { streaming: 9, batch: 5, hybrid: 10 }
            }
        ]
    },
    {
        id: 3,
        text: "What is your data arrival pattern?",
        help: "How does data arrive at your system?",
        options: [
            { 
                id: "continuous", 
                title: "Continuous stream", 
                description: "Constant flow of events (e.g., IoT sensors, clickstreams)",
                score: { streaming: 10, batch: 2, hybrid: 8 }
            },
            { 
                id: "micro-batch", 
                title: "Micro-batches (every few minutes)", 
                description: "Small batches arriving frequently",
                score: { streaming: 7, batch: 5, hybrid: 10 }
            },
            { 
                id: "scheduled", 
                title: "Scheduled loads (hourly/daily)", 
                description: "Regular scheduled data dumps",
                score: { streaming: 2, batch: 10, hybrid: 6 }
            },
            { 
                id: "irregular", 
                title: "On-demand/irregular", 
                description: "Ad-hoc data loads, unpredictable timing",
                score: { streaming: 3, batch: 9, hybrid: 5 }
            }
        ]
    },
    {
        id: 4,
        text: "What is your processing complexity?",
        help: "How complex are your data transformations?",
        options: [
            { 
                id: "simple", 
                title: "Simple transformations", 
                description: "Basic filtering, mapping, aggregations",
                score: { streaming: 8, batch: 8, hybrid: 7 }
            },
            { 
                id: "joins", 
                title: "Joins across datasets", 
                description: "Combining multiple data sources",
                score: { streaming: 5, batch: 9, hybrid: 8 }
            },
            { 
                id: "complex", 
                title: "Complex aggregations/ML", 
                description: "Advanced analytics, machine learning models",
                score: { streaming: 4, batch: 10, hybrid: 7 }
            },
            { 
                id: "simple-etl", 
                title: "Just move data (ETL)", 
                description: "Minimal transformation, mainly data movement",
                score: { streaming: 7, batch: 9, hybrid: 6 }
            }
        ]
    },
    {
        id: 5,
        text: "What are your budget constraints?",
        help: "How important is cost optimization?",
        options: [
            { 
                id: "critical", 
                title: "Cost is critical", 
                description: "Need most cost-effective solution, startup budget",
                score: { streaming: 3, batch: 10, hybrid: 5 }
            },
            { 
                id: "moderate", 
                title: "Moderate budget", 
                description: "Balance between cost and performance",
                score: { streaming: 6, batch: 7, hybrid: 8 }
            },
            { 
                id: "performance", 
                title: "Performance over cost", 
                description: "Willing to pay for best performance",
                score: { streaming: 10, batch: 5, hybrid: 9 }
            }
        ]
    },
    {
        id: 6,
        text: "Do you need windowed operations?",
        help: "Do you need to aggregate data over time windows (e.g., last 5 minutes, hourly rollups)?",
        options: [
            { 
                id: "yes-small", 
                title: "Yes, small windows (seconds/minutes)", 
                description: "Real-time windowing, tumbling/sliding windows",
                score: { streaming: 10, batch: 0, hybrid: 7 }
            },
            { 
                id: "yes-large", 
                title: "Yes, large windows (hours/days)", 
                description: "Longer aggregation periods",
                score: { streaming: 5, batch: 8, hybrid: 9 }
            },
            { 
                id: "no", 
                title: "No windowing needed", 
                description: "Process each record independently",
                score: { streaming: 6, batch: 9, hybrid: 7 }
            }
        ]
    },
    {
        id: 7,
        text: "What are your fault tolerance needs?",
        help: "How critical is exactly-once processing and failure recovery?",
        options: [
            { 
                id: "critical", 
                title: "Mission critical", 
                description: "Financial transactions, no data loss acceptable",
                score: { streaming: 9, batch: 8, hybrid: 10 }
            },
            { 
                id: "important", 
                title: "Important but not critical", 
                description: "Some data loss acceptable, can reprocess",
                score: { streaming: 7, batch: 9, hybrid: 8 }
            },
            { 
                id: "best-effort", 
                title: "Best effort is fine", 
                description: "Analytics use case, approximate results okay",
                score: { streaming: 8, batch: 7, hybrid: 7 }
            }
        ]
    },
    {
        id: 8,
        text: "What is your team's expertise?",
        help: "What technologies is your team most comfortable with?",
        options: [
            { 
                id: "batch-expert", 
                title: "Strong in batch processing (Spark, Hadoop)", 
                description: "Team knows MapReduce, Spark batch jobs well",
                score: { streaming: 4, batch: 10, hybrid: 7 }
            },
            { 
                id: "streaming-expert", 
                title: "Strong in streaming (Kafka, Flink)", 
                description: "Team experienced with real-time systems",
                score: { streaming: 10, batch: 4, hybrid: 8 }
            },
            { 
                id: "both", 
                title: "Comfortable with both", 
                description: "Team can handle either approach",
                score: { streaming: 8, batch: 8, hybrid: 10 }
            },
            { 
                id: "neither", 
                title: "New to data engineering", 
                description: "Team is learning, prefer simpler solution",
                score: { streaming: 5, batch: 9, hybrid: 6 }
            }
        ]
    }
];

// State
let currentQuestionIndex = 0;
let answers = {};

// DOM Elements
const elements = {
    startQuiz: document.getElementById('startQuiz'),
    questionnaireSection: document.getElementById('questionnaireSection'),
    resultsSection: document.getElementById('resultsSection'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    questionNumber: document.getElementById('questionNumber'),
    questionText: document.getElementById('questionText'),
    questionHelp: document.getElementById('questionHelp'),
    optionsContainer: document.getElementById('optionsContainer'),
    prevButton: document.getElementById('prevButton'),
    nextButton: document.getElementById('nextButton'),
    restartButton: document.getElementById('restartButton'),
    shareLinkedIn: document.getElementById('shareLinkedIn'),
    shareTwitter: document.getElementById('shareTwitter'),
    copyLink: document.getElementById('copyLink')
};

// Event Listeners
elements.startQuiz.addEventListener('click', startQuiz);
elements.prevButton.addEventListener('click', previousQuestion);
elements.nextButton.addEventListener('click', nextQuestion);
elements.restartButton.addEventListener('click', restartQuiz);
elements.shareLinkedIn.addEventListener('click', shareLinkedIn);
elements.shareTwitter.addEventListener('click', shareTwitter);
elements.copyLink.addEventListener('click', copyLink);

// Functions
function startQuiz() {
    elements.questionnaireSection.style.display = 'block';
    document.querySelector('.hero').style.display = 'none';
    currentQuestionIndex = 0;
    answers = {};
    showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
    const question = questions[index];
    
    // Update progress
    const progress = ((index + 1) / questions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.progressText.textContent = `Question ${index + 1} of ${questions.length}`;
    
    // Update question
    elements.questionNumber.textContent = `Question ${index + 1}`;
    elements.questionText.textContent = question.text;
    elements.questionHelp.textContent = question.help;
    
    // Render options
    elements.optionsContainer.innerHTML = question.options.map(option => `
        <div class="option-card ${answers[question.id] === option.id ? 'selected' : ''}" 
             data-option-id="${option.id}">
            <div class="option-title">${option.title}</div>
            <div class="option-description">${option.description}</div>
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => selectOption(question.id, card.dataset.optionId));
    });
    
    // Update navigation buttons
    elements.prevButton.style.display = index > 0 ? 'flex' : 'none';
    elements.nextButton.disabled = !answers[question.id];
    elements.nextButton.innerHTML = index === questions.length - 1 
        ? 'See Results <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
        : 'Next <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

function selectOption(questionId, optionId) {
    answers[questionId] = optionId;
    
    // Update UI
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-option-id="${optionId}"]`).classList.add('selected');
    
    elements.nextButton.disabled = false;
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

function restartQuiz() {
    elements.resultsSection.style.display = 'none';
    document.querySelector('.hero').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateRecommendation() {
    const scores = { streaming: 0, batch: 0, hybrid: 0 };
    
    // Calculate total scores
    questions.forEach(question => {
        const answerId = answers[question.id];
        const option = question.options.find(opt => opt.id === answerId);
        if (option) {
            scores.streaming += option.score.streaming;
            scores.batch += option.score.batch;
            scores.hybrid += option.score.hybrid;
        }
    });
    
    // Determine recommendation
    const maxScore = Math.max(scores.streaming, scores.batch, scores.hybrid);
    let recommendation;
    
    if (scores.hybrid === maxScore) {
        recommendation = 'hybrid';
    } else if (scores.streaming === maxScore) {
        recommendation = 'streaming';
    } else {
        recommendation = 'batch';
    }
    
    return { type: recommendation, scores };
}

function getRecommendationDetails(type, userAnswers) {
    const latency = userAnswers[1];
    const volume = userAnswers[2];
    const budget = userAnswers[5];
    
    const details = {
        streaming: {
            title: "Stream Processing Architecture",
            summary: "A pure streaming architecture processes data continuously as it arrives, providing real-time insights and immediate response to events.",
            architecture: `┌─────────────┐
│ Data Sources│
└──────┬──────┘
       │
┌──────▼───────┐     ┌──────────────┐
│ Apache Kafka │────▶│ Apache Flink │
└──────────────┘     └──────┬───────┘
                            │
                     ┌──────▼────────┐
                     │ Data Storage  │
                     │ (Real-time DB)│
                     └───────────────┘`,
            techStack: [
                { category: "Ingestion", name: "Apache Kafka" },
                { category: "Processing", name: "Apache Flink / Spark Streaming" },
                { category: "Storage", name: "Apache Cassandra / ScyllaDB" },
                { category: "Orchestration", name: "Kubernetes" }
            ],
            costBreakdown: [
                { label: "Kafka Cluster", value: "₹25,000" },
                { label: "Flink Processing", value: "₹35,000" },
                { label: "Storage (Cassandra)", value: "₹20,000" },
                { label: "Infrastructure", value: "₹15,000" },
                { label: "Total Monthly", value: "₹95,000" }
            ],
            reasons: [
                "Your latency requirements demand real-time processing",
                "Continuous data streams are best handled by streaming systems",
                "Event-driven architecture fits your use case",
                "Real-time analytics and monitoring are priorities"
            ],
            pros: [
                "Immediate insights and real-time dashboards",
                "Low latency processing (milliseconds to seconds)",
                "Event-driven architecture enables reactive systems",
                "Better for time-sensitive applications"
            ],
            cons: [
                "Higher operational complexity and monitoring needs",
                "More expensive infrastructure costs",
                "Requires specialized expertise in streaming systems",
                "Complex state management and fault tolerance"
            ],
            alternatives: [
                { 
                    type: "Batch Processing", 
                    reason: "Not recommended - Cannot meet your real-time latency requirements. Would introduce delays of hours or days." 
                },
                { 
                    type: "Hybrid (Lambda)", 
                    reason: "Consider if you also need historical reprocessing or batch analytics alongside real-time processing." 
                }
            ]
        },
        batch: {
            title: "Batch Processing Architecture",
            summary: "A batch processing architecture processes data in scheduled intervals, optimized for high throughput and cost efficiency when real-time processing isn't required.",
            architecture: `┌─────────────┐
│ Data Sources│
└──────┬──────┘
       │ (Scheduled)
┌──────▼────────┐     ┌─────────────┐
│ Data Landing  │────▶│ Apache Spark│
│ (S3/HDFS)     │     │ Batch Jobs  │
└───────────────┘     └──────┬──────┘
                             │
                      ┌──────▼────────┐
                      │  Data Warehouse│
                      │  (Redshift)    │
                      └────────────────┘`,
            techStack: [
                { category: "Storage", name: "AWS S3 / Azure Blob / HDFS" },
                { category: "Processing", name: "Apache Spark" },
                { category: "Warehouse", name: "Snowflake / Redshift / BigQuery" },
                { category: "Orchestration", name: "Apache Airflow" }
            ],
            costBreakdown: [
                { label: "S3 Storage", value: "₹8,000" },
                { label: "Spark Cluster (On-demand)", value: "₹20,000" },
                { label: "Data Warehouse", value: "₹30,000" },
                { label: "Airflow", value: "₹5,000" },
                { label: "Total Monthly", value: "₹63,000" }
            ],
            reasons: [
                "Your latency requirements allow for scheduled processing",
                "Cost efficiency is important for your budget constraints",
                "Data arrives in scheduled batches, not continuous streams",
                "Complex transformations are easier in batch processing"
            ],
            pros: [
                "More cost-effective - 30-40% cheaper than streaming",
                "Simpler to develop and maintain",
                "Better for complex transformations and joins",
                "Easier to reprocess historical data",
                "Mature ecosystem with extensive tooling"
            ],
            cons: [
                "Higher latency - data not immediately available",
                "Not suitable for real-time use cases",
                "Less responsive to changing business needs",
                "Delayed detection of data quality issues"
            ],
            alternatives: [
                { 
                    type: "Stream Processing", 
                    reason: "Not recommended - Adds unnecessary complexity and cost given your latency requirements allow for batch processing." 
                },
                { 
                    type: "Hybrid (Lambda)", 
                    reason: "Consider if you have mixed requirements - some use cases need real-time while others can be batch." 
                }
            ]
        },
        hybrid: {
            title: "Hybrid Architecture (Lambda)",
            summary: "A Lambda architecture combines batch and streaming processing, providing both real-time insights and comprehensive batch analytics. Best for organizations with diverse latency requirements.",
            architecture: `                    ┌─────────────┐
                    │Data Sources │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
  ┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
  │Speed Layer   │  │Batch Layer  │  │Serving     │
  │(Kafka+Flink) │  │(Spark)      │  │Layer       │
  └───────┬──────┘  └──────┬──────┘  │(Combined)  │
          │                │          └─────┬──────┘
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Storage   │
                    │(RT + Batch) │
                    └─────────────┘`,
            techStack: [
                { category: "Speed Layer", name: "Kafka + Flink" },
                { category: "Batch Layer", name: "Spark + Airflow" },
                { category: "Serving", name: "Unified Query Layer" },
                { category: "Storage", name: "Delta Lake / Iceberg" }
            ],
            costBreakdown: [
                { label: "Streaming (Kafka+Flink)", value: "₹45,000" },
                { label: "Batch (Spark)", value: "₹25,000" },
                { label: "Unified Storage", value: "₹20,000" },
                { label: "Orchestration", value: "₹8,000" },
                { label: "Total Monthly", value: "₹98,000" }
            ],
            reasons: [
                "You have mixed latency requirements across use cases",
                "Need both real-time dashboards AND historical analysis",
                "Want flexibility to handle both streaming and batch workloads",
                "Business needs combine immediate insights with deep analytics"
            ],
            pros: [
                "Flexibility to handle both real-time and batch use cases",
                "Real-time view for recent data, comprehensive batch view for historical",
                "Can reprocess historical data while maintaining real-time feed",
                "Best of both worlds for diverse requirements",
                "Future-proof as requirements evolve"
            ],
            cons: [
                "Most complex to build and maintain",
                "Higher infrastructure costs (running both systems)",
                "Requires expertise in both streaming and batch processing",
                "Potential data consistency challenges between layers",
                "Operational overhead of managing two parallel systems"
            ],
            alternatives: [
                { 
                    type: "Pure Streaming", 
                    reason: "Consider if you can consolidate all requirements to streaming and use state stores for historical queries." 
                },
                { 
                    type: "Pure Batch", 
                    reason: "Consider if you can relax real-time requirements and use near-real-time batch processing (micro-batches)." 
                }
            ]
        }
    };
    
    return details[type];
}

function showResults() {
    const { type, scores } = calculateRecommendation();
    const details = getRecommendationDetails(type, answers);
    
    // Hide questionnaire, show results
    elements.questionnaireSection.style.display = 'none';
    elements.resultsSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update recommendation
    document.getElementById('recommendationType').textContent = details.title;
    document.getElementById('recommendationSummary').textContent = details.summary;
    
    // Update architecture diagram
    document.getElementById('architectureDiagram').textContent = details.architecture;
    
    // Update tech stack
    document.getElementById('techStackList').innerHTML = details.techStack.map(tech => `
        <div class="tech-item">
            <span class="tech-category">${tech.category}</span>
            <span class="tech-name">${tech.name}</span>
        </div>
    `).join('');
    
    // Update cost estimate
    document.getElementById('costEstimate').innerHTML = details.costBreakdown.map(item => `
        <div class="cost-item">
            <span class="cost-label">${item.label}</span>
            <span class="cost-value">${item.value}</span>
        </div>
    `).join('');
    
    // Update reasons
    document.getElementById('reasonsList').innerHTML = details.reasons.map(reason => `
        <div class="reason-item">
            <span class="reason-icon">▸</span>
            <span class="reason-text">${reason}</span>
        </div>
    `).join('');
    
    // Update pros
    document.getElementById('prosList').innerHTML = details.pros.map(pro => `<li>${pro}</li>`).join('');
    
    // Update cons
    document.getElementById('consList').innerHTML = details.cons.map(con => `<li>${con}</li>`).join('');
    
    // Update alternatives
    document.getElementById('alternativesGrid').innerHTML = details.alternatives.map(alt => `
        <div class="alternative-card">
            <div class="alternative-type">${alt.type}</div>
            <div class="alternative-reason">${alt.reason}</div>
        </div>
    `).join('');
}

function shareLinkedIn() {
    const { type } = calculateRecommendation();
    const details = getRecommendationDetails(type, answers);
    const url = window.location.href;
    const text = `I just used DataEngTools' Streaming vs Batch Decision Tool and got recommended: ${details.title}! Check it out:`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank');
}

function shareTwitter() {
    const { type } = calculateRecommendation();
    const details = getRecommendationDetails(type, answers);
    const url = window.location.href;
    const text = `I got recommended ${details.title} for my data pipeline using @DataEngTools. Try it yourself:`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        const btn = elements.copyLink;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 13L9 17L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
