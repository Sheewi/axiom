
# Axiom 2.5 Firebase Studio Environment

## Overview
This workspace is designed for the Axiom 2.5 multi-bot AI/robotics ecosystem, supporting:
- Multi-language development (Node.js, Python, Go)
- AI/ML, compliance, and automation workflows
- Secure, reproducible, and scalable environments using Nix
- Integration with Firebase Extensions (Gemini API, Secret Manager, etc.)

## Quick Start
1. Open the workspace in Firebase Studio or a Nix-enabled environment.
2. The environment is defined in `.idx/dev.nix` for full reproducibility.
3. On first start, dependencies for Node.js, Python, and Go will be available.
4. Use the provided VS Code extensions for code quality, security, and Firebase integration.

## Compliance & Security
- Use Firebase Secret Manager for all sensitive keys (API, Stripe, etc.)
- Enable these Firebase Extensions for best results:
	- Secret Manager
	- Detect Offensive Content
	- Mask Data in Firestore
	- Multimodal Tasks with Gemini API
	- Export Collections to BigQuery
- Follow best practices for GDPR, EU AI Act, and other compliance needs.

## Development & Testing
- Use `npm run dev`, `flask run`, or `go run .` as appropriate for your service.
- Automated install hooks are provided in `dev.nix` for Node, Python, and Go projects.
- Use the included extensions for linting, formatting, and security scanning.

## Monitoring & Scaling
- Integrate with Prometheus/Grafana for monitoring if needed.
- Use Docker and Kubernetes for scalable deployment (see prompts for details).

## References
- See the `prompts` files for detailed architecture, compliance, and orchestration guidance.
- For Nix usage: https://developers.google.com/idx/guides/customize-idx-env
- For package search: https://search.nixos.org/packages

---
_This environment is aligned with the Axiom 2.5 ecosystem architecture and compliance requirements._
