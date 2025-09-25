# CampusConnect Lite by Team OneView

[![SIH2025 Logo](https://img.shields.io/badge/Smart_India_Hackathon-2025-blue)](https://www.sih.gov.in/)

A low-cost, highly accessible Integrated Student Management System designed for public colleges, built for the Smart India Hackathon 2025.

---

## 🎯 Problem Statement

**ID SIH25103: ERP-based Integrated Student Management system for the Government of Rajasthan.**

Public colleges in India face a significant challenge with fragmented data and repetitive manual processes for admissions, fee collection, and hostel allocation. The primary barrier to modernization is the significant financial cost of traditional, proprietary ERP software, which leaves these essential institutions in a digital divide.

## 💡 Our Solution

**CampusConnect Lite** is our innovative solution to bridge this gap. Instead of building expensive new software, we intelligently integrate ubiquitous cloud office suites (like Google Workspace or Microsoft 365) to function as a cohesive, powerful ERP system. Our approach creates a unified, real-time "single source of truth" for all student data, eliminating the need for costly software and extensive staff training.

Our innovation is not a new technology, but a new **architectural approach**—a "Lego-block" methodology that is adaptable, affordable, and easy for existing staff to adopt.

## ✨ Key Features

* **Unified Admission Module:** A streamlined, digital-first online admission process.
* **Automated Fee Management:** Automatic generation of digital receipts and real-time tracking of fee collections.
* **Live Hostel & Library Integration:** Real-time updates to hostel and library records from the central student database.
* **Role-Based Dashboards:** Secure, customized dashboards providing a live, at-a-glance overview of key metrics for administrators.

## 📈 Solution Architecture & Workflow

Our system is built on a simple, yet powerful 4-step workflow:

1.  **Data Capture:** Institutional forms (e.g., for admissions, hostels) are created using **Google Forms** or **Microsoft Forms**. These forms include validation rules to ensure data accuracy.
2.  **Centralized Database:** Form submissions automatically populate a master spreadsheet in **Google Sheets** or **Excel Online**, which serves as the central student database.
3.  **Automation Engine:** A lightweight script using **Google Apps Script** acts as the core automation engine. It is triggered by events (like a new form submission) to perform tasks such as generating PDF receipts, sending email reminders, and syncing data across modules.
4.  **Real-Time Dashboards:** Interactive dashboards built with **Google Looker Studio** or **Microsoft Power BI** are connected to the central database, providing administrators with live key metrics.

## 🛠️ Technology Stack

* **Cloud Platform:** Google Workspace or Microsoft 365
* **Frontend (Data Entry):** Google Forms / Microsoft Forms
* **Backend (Database):** Google Sheets / Excel Online
* **Automation Logic:** Google Apps Script (JavaScript-based)
* **Data Visualization:** Google Looker Studio / Microsoft Power BI

## 🚀 Getting Started (Conceptual Setup)

To replicate this project, you would need to configure the cloud services as follows:

1.  **Prerequisites:** An active Google Workspace or Microsoft 365 institutional account.
2.  **Google Forms:** Create the necessary forms for admissions, fees, etc., with appropriate validation.
3.  **Google Sheets:** Create a master spreadsheet. Link this sheet as the destination for all your form responses. Structure it with separate tabs for different modules ('Student Demographics', 'Fee Status', etc.).
4.  **Google Apps Script:**
    * Open the Google Sheet and go to `Extensions > Apps Script`.
    * Copy the code from the `.js` or `.gs` files in this repository into the script editor.
    * Set up triggers (e.g., an `onFormSubmit` trigger) to run the relevant functions automatically when a form is submitted.
5.  **Google Looker Studio:**
    * Create a new report in Looker Studio.
    * Add the Google Sheet as the data source.
    * Build charts and dashboards to visualize the data from the sheet in real-time.

## 🤝 The Team (Team OneView)

* **Shivang Mishra:** Project Lead & Backend Architect
* **Lakshya Sahu:** Frontend & UI/UX Designer
* **Shriya Dhawan:** Database & Automation Specialist
* **Chinmay Bhardwaj:** Dashboard & Data Visualization Expert
*
