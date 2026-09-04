export const projects = [
  {
    id: 1,
    title: "Pluto — Full-Stack Social Media",
    category: "Full-Stack Web Platform",
    problem: "Real-time social networks require low-latency event synchronization, scalable media delivery, and responsive user interaction states.",
    description: "A production-style social media platform featuring real-time Socket.io interactions, Reels/Shorts-style vertical video feeds, optimistic-UI likes, nested comments, and Cloudinary media management.",
    architecture: "React + Redux Toolkit → Express REST API & Socket.io → MongoDB (Mongoose) → Cloudinary",
    features: [
      "Real-time notifications, likes, and comment sync powered by Socket.io rooms",
      "Reels/Shorts vertical video feed with IntersectionObserver autoplay & infinite scroll",
      "Secure JWT authentication, profile management, and Cloudinary image/video uploads",
      "Optimistic-UI updates, follow/unfollow system, and Redux Toolkit async thunks",
      "Custom dark-themed UI system with animated dialogs and skeleton loading states"
    ],
    techStack: ["React", "Redux Toolkit", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Socket.io", "Cloudinary", "JWT"],
    github: "https://github.com/ArpanBanik007/FullStack-Social-Media-MERN-",
    demo: "https://pluto-alpha-ochre.vercel.app/",
    image: "/pluto-ss.png"
  },
  {
    id: 2,
    title: "E-Commerce Platform — Backend",
    category: "Backend & Systems API",
    problem: "Scalable e-commerce infrastructure requires transactional reliability, secure payment gateway integrations, and optimized request routing.",
    description: "A robust backend system for e-commerce platforms featuring dynamic product cataloging, cart and order management, Razorpay payment processing, and an API Gateway architecture pattern.",
    architecture: "Client Request → API Gateway Pattern → Express Routers & Middleware → Controller/Service Layer → MongoDB",
    features: [
      "Razorpay payment gateway integration for secure online transactions",
      "JWT authentication with Role-Based Access Control (RBAC) for customers and admins",
      "API Gateway pattern implemented for enhanced performance and request routing",
      "Dynamic product catalog listing with advanced search and multi-criteria filtering",
      "Cart persistence, order lifecycle tracking, and Cloudinary asset management"
    ],
    techStack: ["Node.js", "Express.js", "MongoDB", "Cloudinary", "Razorpay", "API Gateway", "JWT"],
    github: "https://github.com/ArpanBanik007",
    demo: null,
    image: "https://placehold.co/600x400/1e1e1e/8b5cf6?text=Ecommerce+Backend+API"
  },
  {
    id: 3,
    title: "URL Shortener Application",
    category: "Full-Stack Utility Service",
    problem: "Web services require fast URL redirection, secure link generation, and real-time click tracking analytics without database bottlenecks.",
    description: "A secure URL shortening service with JWT authentication, role-based link administration, and an analytics dashboard for click tracking and performance monitoring.",
    architecture: "Client Request → Express API Middleware → URL Hash Controller → MongoDB",
    features: [
      "Secure URL shortening with JWT authentication and RBAC (Admin / User)",
      "Dedicated admin dashboard for link management and click analytics",
      "Optimized redirect endpoints for low-latency URL resolution",
      "Cloudinary asset support and sanitized input validation",
      "Structured error handling and API monitoring"
    ],
    techStack: ["Node.js", "Express.js", "MongoDB", "JWT", "Cloudinary", "REST API"],
    github: "https://github.com/ArpanBanik007",
    demo: null,
    image: "https://placehold.co/600x400/1e1e1e/0ea5e9?text=URL+Shortener+App"
  },
  {
    id: 4,
    title: "Map Marker API",
    category: "Geospatial RESTful API",
    problem: "Location-aware applications require performant geospatial queries, coordinate validation, and safe data persistence.",
    description: "A secure RESTful API built with Node.js, Express, and MongoDB for tagging, searching, and managing geolocation-based markers anywhere.",
    architecture: "Client Request → Express Geo Controller → MongoDB 2dsphere Geospatial Index",
    features: [
      "GeoJSON coordinate storage & spherical proximity queries",
      "Search by category & geographic keywords",
      "Full CRUD operations for personalized location markers",
      "JWT authentication & route protection",
      "Structured JSON error handling & input validation"
    ],
    techStack: ["Node.js", "Express.js", "MongoDB", "GeoJSON", "JWT", "REST API"],
    github: "https://github.com/ArpanBanik007",
    demo: null,
    image: "https://placehold.co/600x400/1e1e1e/ec4899?text=Map+Marker+API"
  }
];
