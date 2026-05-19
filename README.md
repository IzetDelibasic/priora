# Priora - Medical Triage System

> An intelligent decision-support tool for triage nurses and emergency medical technicians, powered by a machine learning model trained on real emergency department data.

---

## About the Project

**Priora** is a web application that uses machine learning to assist medical staff in prioritizing patient care in emergency departments. It predicts the ESI (Emergency Severity Index) level - a standardized five-tier triage scale widely adopted in emergency medicine worldwide.

The model was trained on **558,000 real patient visits** to emergency departments in the United States (source: Kaggle dataset `5v_cleandf.rdata`), giving it a solid real-world foundation with an accuracy of **~64.8%**, improving further for critical cases (ESI 1 and 2).

The project was developed as a competition entry for the **FIT AI Agents** competition.

---

## Purpose and Use

Emergency departments see a high volume of patients daily, each with varying degrees of urgency. A triage nurse or technician must quickly determine who needs immediate care and who can wait - a decision that directly impacts patient outcomes.

**Priora** assists by:

- Accepting the patient's **vital signs** (pulse, blood pressure, temperature, oxygen saturation, respiratory rate, age, pain)
- Accepting the patient's **chief complaint** from a list of 200 recognized clinical categories
- Returning a **suggested ESI level** with a confidence percentage within seconds
- Displaying the **probability distribution** across all 5 ESI levels
- Generating a **printable triage report** with a signature line

Priora is **not** a replacement for medical expertise - it is a tool that supports and accelerates the decision-making process, especially under high-pressure, high-volume conditions.

---

## Who Uses Priora

| User                                 | How They Use It                                                                     |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| **Triage nurse / EMT**               | Enters vitals and chief complaint at patient intake, receives a suggested ESI level |
| **Emergency Medical Services (EMS)** | Can pre-triage patients in the field before hospital arrival                        |
| **Medical educators**                | Demonstrates and trains the triage process using simulated cases                    |
| **Researchers and medical students** | Analyzes factors influencing triage through an interactive interface                |

---

_Priora was developed as a prototype and academic project. It is not certified for clinical use without additional validation and medical oversight._
