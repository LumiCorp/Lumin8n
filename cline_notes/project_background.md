# Project Overview: White-labeling n8n as Lumiflow

## Context:

We’re leveraging n8n, an open-source workflow automation tool, as the foundational platform for our new AI-driven business workflow product, Lumiflow. The goal is to rapidly provide a robust, reliable, and extensible workflow automation solution to our customers under the Lumi brand, without investing heavily in developing the workflow engine from scratch.

## Why n8n?

- Open-source and extendable: Allows us to customize functionality specifically tailored for Lumi’s AI-focused features and business requirements.
- Rich integrations: n8n comes with a large library of existing integrations, reducing our time-to-market significantly.
- Strong community support: Ensures sustainability and continuous improvement without excessive resource commitment from our side.

## What We’re Doing:

1. Branding & Customization:
    - Rebranding n8n’s frontend with Lumi’s brand guidelines (logo, colors, typography).
    - Customizing user experience (dashboard, templates, help content) to align with Lumi’s identity and tone.
2.	AI Integration:
    - Extending n8n workflows to integrate with Lumi’s AI platforms (Ascend, LumiX, Redrocks).
	- Providing AI-driven workflow automation scenarios out-of-the-box to differentiate Lumiflow from standard workflow automation solutions.
3.	Deployment & Infrastructure:
    - Delivering Lumiflow in cloud-based (Terraform-managed LumiX environments) and potentially on-premises deployments for enterprise flexibility.

## Benefits of this Approach:

- Rapid Time-to-Market: Leveraging existing capabilities significantly shortens our development cycles.
- Cost-Effective: Reduces development overhead while still enabling extensive customization and innovation.
- Customer Value: Combines powerful workflow automation capabilities with specialized Lumi AI integrations, enhancing customer productivity and operational efficiency.


## Technical Overview of n8n:

1. Core Technology Stack:
	•	Backend: Node.js, TypeScript
	•	Frontend: Vue.js
	•	Database: SQLite (default for local/dev), with robust support for PostgreSQL, MySQL, MariaDB
	•	Deployment: Docker-ready, easily containerized, highly scalable via Kubernetes or Terraform-managed deployments (aligning with LumiX infrastructure).

2. Architecture Highlights:
	•	Node-Based Workflow Automation:
n8n uses an intuitive drag-and-drop, node-based interface for workflow creation, defining workflows as interconnected nodes representing triggers, actions, and logic conditions.
	•	Extensibility & Custom Nodes:
Built on an open modular architecture, allowing easy creation of custom nodes tailored to Lumi’s AI services, integrations, or client-specific business logic.
	•	Trigger & Webhook Support:
Rich webhook functionality, enabling event-driven workflows from external APIs, SaaS products, and Lumi’s AI services (e.g., Ascend, Redrocks).
	•	REST API & Programmatic Control:
Offers comprehensive REST API capabilities, making integration seamless with Lumi’s existing services or client applications, allowing for automated workflow management, execution, and monitoring.
	•	Credential Management:
Secure management of API credentials and secrets, stored encrypted and accessed at runtime to ensure security in production environments.
	•	Error Handling & Logging:
Detailed logging and error-handling capabilities to enable debugging, monitoring, and ensuring reliability of automated workflows.


## How Lumiflow Builds on n8n:

1. Branding & UI Customization:
	•	Rebranded UI (Vue.js) to align with Lumi’s visual identity and brand guidelines.
	•	Customized templates and workflows pre-loaded into the Lumiflow interface, specific to industry use-cases and Lumi’s AI offerings.

2. AI-Powered Extensions:
	•	Creation of custom nodes and connectors specifically for Lumi’s platforms, including:
	•	Ascend: AI-assistant-driven workflows.
	•	LumiX: Infrastructure automation integrations (e.g., Terraform state triggers).
	•	Redrocks: AI model performance validation and monitoring nodes.
	•	Adding proprietary AI logic directly into workflow execution, differentiating Lumiflow from standard automation offerings.

3. Infrastructure & Scalability:
	•	Cloud-native deployments leveraging LumiX’s Terraform-managed AI environments, providing scalability and robust performance.
	•	Containerized via Docker and orchestrated through Kubernetes to support high availability and enterprise-level deployments.
