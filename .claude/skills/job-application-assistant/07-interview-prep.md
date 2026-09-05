---
framework_version: 1.0.0
---

# Interview Preparation Guide

<!-- SETUP: STAR examples are personalized by running /setup based on your actual experience -->

## STAR Format

Structure answers as: **Situation** (context), **Task** (your responsibility), **Action** (what you did), **Result** (outcome).

Keep answers to 1-2 minutes. Be specific. End with what you learned or would do differently.

## Ready-Made STAR Examples

### 1. Autonomous LIDAR Vehicle (Robotics / working under pressure)
**S:** At the Hard & Soft Hackathon in Romania, teams had 48 hours to build an autonomous vehicle capable of solving a maze using only onboard sensors.
**T:** As the team member responsible for navigation and sensor fusion, I needed to get a ROS2-based system reliably detecting obstacles and replanning paths in real time, from scratch, within the deadline.
**A:** I built a ROS2-based autonomous navigation pipeline, fusing LIDAR and IMU data into a real-time obstacle map and driving dynamic path replanning as conditions changed.
**R:** The vehicle successfully navigated the maze in real time under changing conditions, and the team won 1st place.
**Use for:** "Tell me about a time you worked under a tight deadline", "Describe a technical challenge you solved from scratch"

### 2. PII Detection Pipeline at Softech (Ownership / applied ML)
**S:** During my ML internship at Softech, audio transcriptions needed to be scrubbed of personally identifiable information before further processing, but no automated system existed.
**T:** I was tasked with building an automated PII detection pipeline for audio transcriptions.
**A:** I built the pipeline using Microsoft Presidio, tuning detection across 15+ distinct PII data types, and paired it with a speech-to-text pipeline using AWS Transcribe and OpenAI Whisper with a Streamlit interface.
**R:** The system achieved 85%+ confidence scores across detected categories, reducing manual review effort on transcribed audio.
**Use for:** "Tell me about a project you built from scratch", "How do you approach data privacy in ML pipelines?"

### 3. Kubernetes Autoscaling for ML Inference (MLOps / infrastructure depth)
**S:** For a cloud computing course project, the goal was an inference-serving system for a ResNet18 image classifier that could handle variable load efficiently.
**T:** I was responsible for designing and deploying the serving infrastructure and autoscaling logic end to end.
**A:** I built a Kubernetes-based deployment with a custom autoscaling policy driven by Prometheus metrics, visualized via Grafana dashboards, and served the model through a containerized FastAPI service.
**R:** The system achieved sub-0.5s response times under concurrent inference load with automatic pod scaling - a full production-style MLOps loop at course-project scale.
**Use for:** "Walk me through an MLOps project you've built", "How do you think about scaling ML systems in production?"

### 4. KlarSluch: AI Hearing Support (Impact-driven building / working under pressure)
**S:** At HackCarpathia 2025, the team wanted to build something with direct accessibility impact within a 48-hour window.
**T:** I was responsible for the audio pipeline and real-time transcription delivery.
**A:** I built a real-time speech transcription application using OpenAI Whisper for hearing-impaired users, added an audio preprocessing stage with Librosa for noise reduction and speech enhancement, and streamed transcriptions over WebSocket for low latency.
**R:** The team delivered a working, low-latency assistive transcription tool within the hackathon timeframe.
**Use for:** "Tell me about a project you're proud of", "Describe a time you built something to solve a real user problem"

<!-- Add more STAR examples as needed. Aim for 4-6 covering different competencies. -->

## Common Tough Questions

### "Why did you leave Softech?"
> The ML internship at Softech was a fixed three-month engagement (Oct-Dec 2023) that concluded as scheduled. It gave me hands-on experience shipping a PII detection system and a speech-to-text pipeline, and I returned to full-time M.Sc. studies at TU Ilmenau afterward, where I'm now also a Research Assistant.

### "You don't have [specific skill/experience]."
> Acknowledge the gap directly, then bridge to the pattern of picking up new stacks fast under pressure - e.g. building a full ROS2 sensor-fusion pipeline in 48 hours for the LIDAR hackathon, or standing up a Kubernetes autoscaling system from scratch for a course project. Close with genuine interest in ramping up on the missing piece.

### "Where do you see yourself in 5 years?"
> Growing from a Werkstudent role into a full-time ML/MLOps engineer building production systems, ideally on a team that invests in developing its people - and eventually mentoring newer engineers the way I'd want to be mentored.

### "What's your biggest weakness?"
> [Personalize before using - candidate should pick a genuine weakness with a concrete mitigation. Draft note: most experience so far is academic/hackathon/internship scale rather than large production systems; mitigation is the demonstrated ability to learn new stacks fast and already having built a full MLOps loop (build -> containerize -> deploy -> monitor -> autoscale) end to end at smaller scale.]

### "Why this company specifically?"
> Customize per company. Must reference: specific projects, company values, market position, or team structure. Never give a generic answer.

## Questions You Should Ask Interviewers

### About the Role
- "What does a typical week look like in this role?"
- "What would success look like in the first 6 months?"
- "What's the biggest challenge the team is facing right now?"

### About the Team
- "How big is the team, and how do you divide work?"
- "What does the development/project lifecycle look like, from idea to production?"
- "How do you onboard new team members?"

### About Tech & Growth
- "What's your current tech stack for [relevant area]?"
- "Is there room to grow into more architectural or strategic decisions?"
- "How does the team stay current with new tools and methods?"

### About Culture (use these to prevent disappointment)
- "How would you describe the team culture?"
- "What does professional development look like here?"
- "Is there flexibility for remote/hybrid work?"
- "What's the balance between development/new projects and maintenance work?"
- "How would you describe the leadership style in this team?"
- "What do people who thrive here have in common?"

## Phone/Video Interview Tips
- Have STAR examples written out (use this file)
- Keep a glass of water nearby
- Smile when speaking (it changes your tone)
- Ask for clarification if a question is vague
- It's OK to take 5 seconds to think before answering
- End with: "Is there anything else you'd like to know about my background?"

## After the Application (Best Practice)

### Follow-Up Etiquette
- **Don't call to "stand out"** or to learn more about the role post-submission - this risks a negative impression
- If the employer specified a timeline, respect it and wait
- If no timeline was given and significant time has passed (2+ weeks), a brief call to ask about status is acceptable
- If you have genuinely new, relevant information to share, a short follow-up is fine

### Thank-You Notes
- When you receive any update (interview invitation, rejection, or status update), send a brief thank-you message
- Express appreciation for their time and the process
- Keep it short (2-3 sentences)

## Roleplay Guidelines
When the user asks for interview practice:
1. Ask which role/company to simulate
2. Start with easy warm-up questions ("Tell me about yourself")
3. Progress to role-specific technical questions
4. Include 1-2 behavioral questions using the competencies from the job posting
5. End with a tough question or curveball
6. After each answer, give brief feedback: what worked, what to sharpen
7. Suggest which STAR example would work best for each question
