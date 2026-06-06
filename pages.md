# AttendSecure — Frontend Pages & Navigation Specification

This document outlines the visual structure, layout requirements, and feature visibility for each page in the AttendSecure frontend application across the three user hierarchy roles: **Employee**, **Manager**, and **Super Admin**.

---

## 1. Dashboard Page

*The primary high-level summary view presented to users immediately after logging into the system.*

### 👤 Employee View

* **Today's Status Indicator**: A prominent visual card showing whether the employee has checked in today or not.
* **Personal Attendance Metric**: A brief summary section showing total present days or attendance rate for the current month.

### 👥 Manager View

* **Department Headcount Widget**: A real-time data counter showing how many employees in their specific department are present today.
* **Team Presence Chart**: A visual pie chart or percentage bar depicting today's attendance rate for their team.

### 👑 Super Admin View

* **Global Overview Cards**: Total active company users, organization-wide attendance rate, and a count of pending registrations.
* **Department Selector Dropdown**: A global filter allowing the admin to switch the dashboard statistics between organization-wide data or specific team overviews.

---

## 2. Attendance Page

*The core operational hub used for recording attendance and reviewing physical selfie proofs.*

### 👤 Employee View

* **Live Camera / Upload Module**: An interactive camera preview area or a secure file input window optimized for taking or choosing a `image/jpeg` selfie.
* **"Check In" Action Button**: The main button to execute the presence submission. *Condition: If the employee has already checked in today, this button becomes greyed out (disabled).*
* **Status Notification Bar**: A text element updating live as the background upload cycle runs (*"Requesting system access..."* $\rightarrow$ *"Uploading photo proof..."* $\rightarrow$ *"Check-in Complete!"*).
* **Personal Attendance History Table**: A chronological log of the employee's past check-ins, featuring a column with small thumbnail previews of their own submitted selfies.

### 👥 Manager View

* **Department Roster Table**: A comprehensive list restricted exclusively to employees within the manager's department, displaying Name, Check-in Timestamp, and Status.
* **"Review Photo" Button**: Located on each row, clicking this invokes the Photo Preview Modal to visually inspect the employee's selfie identity proof.
* **Photo Preview Modal**: A secure popup overlay rendering the short-lived pre-signed URL photo in high resolution.

### 👑 Super Admin View

* **Master Attendance Log Table**: A massive organization-wide log rendering every check-in record across all departments.
* **Integrated Log Filter**: Includes both a date-picker and a department dropdown to sort through large amounts of historical logs efficiently.
* **Universal Photo Access**: Full ability to click any row and pop up the Photo Preview Modal for any company employee.

---

## 3. Team Management Page

*The administrative space dedicated to managing company personnel and user access.*

### 👤 Employee View

* *Hidden*: This page is completely omitted from the sidebar menu and protected by client-side routing guardrails.

### 👥 Manager View

* *Hidden*: This page is completely omitted from the sidebar menu and protected by client-side routing guardrails.

### 👑 Super Admin View

* **User Directory Table**: Displays a list of all registered accounts showing their unique ID, Name, Email, Department, and current Role.
* **"Create New User" Drawer/Form**: An input interface for creating new accounts with the following required fields: Full Name, Email Address, Department Dropdown, and Role Selection.
* **Temporary Password Banner**: A highlighted card that displays the generated temporary password returned from the backend upon a successful user creation, allowing the admin to copy it.
* **Account Controls**: Toggles on each table row allowing the admin to instantly deactivate or disable an existing user's account.

---

## 4. Security Logs Page

*The security and governance tracking center used to ensure data compliance and integrity.*

### 👤 Employee View

* *Hidden*: This page is completely omitted from the sidebar menu and protected by client-side routing guardrails.

### 👥 Manager View

* *Hidden*: This page is completely omitted from the sidebar menu and protected by client-side routing guardrails.

### 👑 Super Admin View

* **System Audit Stream Table**: A tabular event viewer piping logs directly from AWS CloudTrail.
* **Audit Column Fields**: Detailed columns mapping the Event Timestamp, Actor Identity (Who made the request), Targeted API Route/Action, and System Response Codes.

---

## 5. Reports Page

*The analytics workspace used for historical data processing and exporting records for HR or payroll reviews.*

### 👤 Employee View

* *Hidden*: This page is completely omitted from the sidebar menu (or optionally features a simplified personal attendance calendar).

### 👥 Manager View

* **Calendar Date Range Picker**: A date input field enabling the selection of custom ranges (e.g., specific weeks, months, or quarters).
* **"Export to CSV" Action Button**: Generates and downloads a spreadsheet containing the historical attendance records for their department employees only.

### 👑 Super Admin View

* **Company-Wide Report Generator**: An enhanced version of the reporting table capable of parsing records across the entire firm.
* **Multi-Select Filters**: Allows exporting data combined from specific departments, date intervals, or individual user lookups.
