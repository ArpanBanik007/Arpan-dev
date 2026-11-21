export const projects = [
  {
    id: 1,
    title: "Near It... — Smart Service Booking",
    category: "Full-Stack Service Marketplace",
    domain: "fullstack",
    problem: "Connecting consumers with verified local service providers requires real-time booking coordination, geospatial discovery, and secure digital escrow transactions.",
    description: "A production-grade, 3-role service marketplace connecting customers with nearby providers, featuring a 5-stage booking lifecycle, real-time Socket.IO status alerts, and server-side verified Razorpay payments.",
    architecture: "React + Redux Toolkit → Express REST API (/api/v1) & Socket.IO → MongoDB & Mongoose (15 Models) → Razorpay / Leaflet",
    features: [
      "3-Role RBAC (Customer, Provider, Admin) with HTTP-only cookies, refresh tokens & email OTP verification",
      "Nearby provider search via MongoDB $geoNear (1–200 km radius) and Leaflet / OpenStreetMap maps",
      "5-stage booking lifecycle (PENDING → ACCEPTED → ON_THE_WAY → STARTED → COMPLETED) with provider accept/reject",
      "Razorpay integration with server-side amount calculation, signature verification, and duplicate-protected refund flow",
      "Socket.IO rooms for real-time notification dispatch, provider location updates, and booking status alerts"
    ],
    techStack: ["React", "Redux Toolkit", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Mongoose", "Razorpay", "Socket.IO", "Leaflet", "JWT"],
    github: "https://github.com/ArpanBanik007/Smart-Service-Booking-RBS",
    demo: "https://nearit.vercel.app/",
    image: "/nearit-ss.png"
  },
  {
    id: 2,
    title: "YouTube Video AI Knowledge Assistant",
    category: "Multilingual Multimodal RAG",
    domain: "ai",
    problem: "Extracting precise answers from hours of technical video lectures and playlists across English, Hindi, and Hinglish explanations is slow and inefficient.",
    description: "A multilingual YouTube RAG application that ingests videos and playlists using Faster-Whisper and yt-dlp, indexes transcript embeddings in Qdrant Vector DB, and provides semantic search with clickable timestamp citations.",
    architecture: "React + Vite Frontend → FastAPI Python Backend → Faster-Whisper + yt-dlp → Qdrant Vector DB → Groq / LLMs",
    features: [
      "Multilingual Q&A supporting English, Hindi, and Hinglish queries with context-aware semantic retrieval",
      "Automated audio extraction and transcription pipeline using Faster-Whisper and yt-dlp",
      "Vector embedding generation and semantic similarity search powered by Qdrant Vector DB",
      "Clickable timestamp citations that jump directly to the exact video moment answering the prompt",
      "Interactive modern split-screen chat interface with synchronized transcript excerpt viewer"
    ],
    techStack: ["Python", "FastAPI", "React", "Vite", "Qdrant", "Faster-Whisper", "yt-dlp", "Groq / LLMs", "Tailwind CSS"],
    github: "https://github.com/ArpanBanik007/YouTube-Video-AI-Knowledge-Assistant",
    demo: null,
    image: "/yt-rag-ss.png"
  },
  {
    id: 3,
    title: "Restaurant Assistant Agent",
    category: "LangGraph Agentic Workflow",
    domain: "ai",
    problem: "Traditional rule-based ordering bots lack stateful multi-step orchestration, inventory checks, and graceful handling of partial or out-of-stock orders.",
    description: "A stateful conversational AI ordering agent built with LangGraph that extracts structured food items and quantities, validates restaurant inventory, handles out-of-stock items, and simulates the multi-stage cooking and serving lifecycle.",
    architecture: "User Input → LangGraph StateGraph → Extraction Node → Inventory Check Tool → Order State Machine → Kitchen Simulation",
    features: [
      "Stateful LangGraph workflow modeling multi-step order flow from intent to kitchen execution",
      "Automated entity extraction for food items, quantities, and customized customer preferences",
      "Dynamic inventory validation with graceful handling of partial orders and unavailable items",
      "Simulated cooking, preparation, and serving status transitions with interactive responses",
      "Deterministic state management, tool calling, and structured output parsing using Python & LangChain"
    ],
    techStack: ["Python", "LangGraph", "LangChain", "LLMs", "Pydantic", "Stateful Agents", "Prompt Engineering"],
    github: "https://github.com/ArpanBanik007/Restaurant-Assistant-Agent",
    demo: null,
    image: "https://placehold.co/600x400/0f172a/8b5cf6?text=LangGraph+Restaurant+Agent"
  },
  {
    id: 4,
    title: "RAG Project: LLM Resume Screening & Embeddings",
    category: "Python RAG & Embeddings Pipeline",
    domain: "ai",
    problem: "Evaluating technical resumes against complex job requirements manually is time-consuming, inconsistent, and prone to subjective omissions.",
    description: "A modular Python application on the Groq API (11 modules) featuring a resume-screening pipeline that parses PDF/DOCX resumes, scores candidates on skills and education into structured Pydantic JSON, and generates 384-dimensional embeddings (all-MiniLM-L6-v2) for semantic retrieval.",
    architecture: "PDF/DOCX Documents → Text Extraction → all-MiniLM-L6-v2 Embeddings → Groq LLM + Pydantic → Structured Scoring",
    features: [
      "Automated PDF/DOCX resume and job description parsing into validated structured JSON",
      "Candidate scoring pipeline assessing technical skills, domain experience, and education matches",
      "Dense 384-dimensional vector embedding generation using all-MiniLM-L6-v2 as the foundation for semantic retrieval",
      "Fine-tuned generation parameters (temperature, max_tokens, finish_reason) with exact token cost tracking",
      "Modular 11-module architecture with uv virtual environment and secure environment variable handling"
    ],
    techStack: ["Python", "Groq API", "SentenceTransformers", "all-MiniLM-L6-v2", "Pydantic", "uv", "python-dotenv", "Git"],
    github: "https://github.com/ArpanBanik007/Rag-Project-",
    demo: null,
    image: "https://placehold.co/600x400/0b132b/0ea5e9?text=Python+RAG+Pipeline"
  },
  {
    id: 5,
    title: "Pluto — Full-Stack Social Network",
    category: "Full-Stack Web Platform",
    domain: "fullstack",
    problem: "Real-time social networks require low-latency event synchronization, scalable media delivery, and responsive user interaction states.",
    description: "A full-featured MERN social network (Facebook/Instagram-style) with 60+ REST APIs, 19 MongoDB models, real-time Socket.io interactions, Reels/Shorts-style vertical video feeds, and Cloudinary media management.",
    architecture: "React + Redux Toolkit → Express REST API & Socket.io → MongoDB (Mongoose) → Cloudinary",
    features: [
      "Real-time notifications, likes, and comment sync powered by Socket.io rooms (25+ events)",
      "Reels/Shorts vertical video feed with IntersectionObserver autoplay & infinite scroll",
      "Secure JWT authentication, profile management, and Cloudinary image uploads with automatic cleanup",
      "Optimistic-UI updates, nested comments, follow/unfollow, saved posts, and watch history",
      "11 Redux Toolkit slices handling async state via thunks with polished dark-themed UI"
    ],
    techStack: ["React", "Redux Toolkit", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Socket.io", "Cloudinary", "JWT"],
    github: "https://github.com/ArpanBanik007/FullStack-Social-Media-MERN-",
    demo: "https://pluto-alpha-ochre.vercel.app/",
    image: "/pluto-ss.png"
  }
];
