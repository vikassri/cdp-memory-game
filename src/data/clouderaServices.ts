export interface ClouderaService {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const clouderaServices: ClouderaService[] = [
{
    id: "1",
    name: "Cloudera Open Data Lakehouse Powered by Apache Iceberg",
    description: "Unified analytics powered by Apache Iceberg with REST Catalog and Lakehouse Optimizer",
    category: "Data Lakehouse"
  },
  {
    id: "2",
    name: "Spark and Airflow Orchestration for Data Pipelines",
    description: "Scalable Spark pipelines with autoscaling and Airflow-native orchestration",
    category: "Data Engineering"
  },
  {
    id: "3",
    name: "Cloudera DataFlow 2.0 with GenAI-Enabled Processors",
    description: "NiFi 2.0 with GenAI processors for low-code streaming and migration tooling",
    category: "Streaming & Integration"
  },
  {
    id: "4",
    name: "Cloudera AI Everywhere for Data Anywhere",
    description: "Safely use all data anywhere to build models and agents everywhere",
    category: "Private AI"
  },
  {
    id: "5",
    name: "Cloudera AI Studios - Agent Studio, RAG Studio, and AI App Builder",
    description: "Build task-oriented AI agents and RAG apps with low-code templates",
    category: "AI Development"
  },
  {
    id: "6",
    name: "Shared Data Experience (SDX) for Enterprise Security & Governance Anywhere",
    description: "Cross-platform security, lineage, and Octopai-powered data governance",
    category: "Governance & Security"
  },
  {
    id: "7",
    name: "Cloudera AI Platform for GenAI and Machine Learning at Scale",
    description: "Accelerate building and delivery of AI for growth, optimization, and security",
    category: "Accelerate Enterprise AI"
  },
  {
    id: "8",
    name: "Private AI Turnkey Infrastructure Solution (Cloudera + Dell + NVIDIA)",
    description: "Turnkey private AI: Dell servers + NVIDIA GPUs + Cloudera platform for secure, on-prem AI",
    category: "AI in a Box"
  }
];
