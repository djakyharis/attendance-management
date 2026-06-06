# AttendSecure — Product Overview

> A cloud-native attendance management system with photo proof, role-based access control, and end-to-end security built on AWS.

---

## Table of Contents

1. [Product Summary](#1-product-summary)
2. [User Roles &amp; Hierarchy](#2-user-roles--hierarchy)
3. [Core Features](#3-core-features)
4. [System Architecture](#4-system-architecture)
5. [AWS Services Deep Dive](#5-aws-services-deep-dive)
6. [Security Design](#6-security-design)
7. [Data Models](#7-data-models)
8. [API Endpoints](#8-api-endpoints)
9. [User Flows](#9-user-flows)
10. [Environment &amp; Configuration](#10-environment--configuration)
11. [Project Structure](#11-project-structure)
12. [Known Constraints &amp; Trade-offs](#12-known-constraints--trade-offs)

---

## 1. Product Summary

**AttendSecure** is a serverless web application that allows organizations to record employee attendance with a selfie photo as proof of presence. Built entirely on AWS, it enforces strict role-based access so that employees can only see their own records, managers can only see their department, and super admins have full visibility across the organization.

### What makes it a Cloud Security project

Every layer of the product has a deliberate security decision:

* Photos are stored **encrypted at rest** using AWS KMS-managed keys and are **never publicly accessible** — they are served through short-lived pre-signed URLs.
* Every API call is **authenticated** via Cognito JWT tokens and **authorized** by Lambda reading the caller's role from the token claims.
* The entire frontend is delivered over **HTTPS via CloudFront** — there is no plain HTTP access.
* All traffic between services stays within AWS — no data ever leaves to a third-party backend.

---

## 2. User Roles & Hierarchy

AttendSecure has three roles, managed as  **Cognito User Groups** .

| Role                  | Group Name      | What they can do                                                          |
| --------------------- | --------------- | ------------------------------------------------------------------------- |
| **Super Admin** | `super-admin` | View all departments, all employees, all attendance records; manage users |
| **Manager**     | `manager`     | View attendance and photos for employees in their own department only     |
| **Employee**    | `employee`    | Submit check-in + selfie; view their own attendance history               |

### How roles are enforced

When a user logs in, Cognito issues a **JWT ID token** that contains a `cognito:groups` claim listing which groups the user belongs to. Every Lambda function reads this claim and filters the data accordingly before returning a response. A Manager who tries to query another department's records will receive a `403 Forbidden` — the filter happens server-side, not client-side.

### Department field

Each user in Cognito has a custom attribute: `custom:department` (e.g. `engineering`, `marketing`). Managers are only allowed to query records where `department` matches their own `custom:department` attribute.

---

## 3. Core Features

### Employee

* **Check-in** : One button press records a timestamp, the user's ID, and their department into DynamoDB.
* **Photo upload** : After check-in, the backend returns a **pre-signed S3 URL** valid for 5 minutes. The frontend uploads the selfie directly to S3 using that URL — the photo never passes through Lambda or API Gateway.
* **History view** : Employees can see a list of their own check-in records with thumbnails of their selfie photos (loaded via separate pre-signed URLs, valid 15 minutes).

### Manager

* **Department dashboard** : A table showing all check-ins for the current day (or a selectable date range) for employees in the manager's department.
* **Photo review** : Clicking a record expands the selfie proof inline.
* **Export** : Download attendance data for their department as CSV.

### Super Admin

* **Organization-wide dashboard** : Same as manager but for all departments, with a department filter dropdown.
* **User management** : Create/deactivate users and assign them to a department and role via the Cognito admin API (called from a dedicated Lambda function with elevated IAM permissions).
* **Audit log access** : View recent CloudTrail events (API calls) for governance purposes.

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        End Users                            │
│         Super Admin       Manager        Employee           │
└──────────────┬────────────────┬───────────────┬────────────┘
               │                │               │
               ▼                ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                   CloudFront + S3 (Frontend)                │
│              HTTPS only · React SPA · Static assets         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     AWS Cognito                             │
│     User Pools · User Groups (roles) · JWT tokens          │
│     Custom attribute: custom:department                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ JWT token in Authorization header
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway                             │
│     REST API · Cognito Authorizer on all routes             │
│     Throttling: 100 req/s · CORS configured                 │
└───────┬───────────────────┬──────────────────┬─────────────┘
        │                   │                  │
        ▼                   ▼                  ▼
┌──────────────┐  ┌──────────────────┐  ┌───────────────────┐
│   Lambda     │  │     Lambda       │  │      Lambda       │
│  checkIn()   │  │ getAttendance()  │  │  manageUsers()    │
│              │  │                  │  │  (admin only)     │
└──────┬───────┘  └────────┬─────────┘  └────────┬──────────┘
       │                   │                      │
       ▼                   ▼                      ▼
┌──────────────────────────────────────────────────────────┐
│                    Amazon DynamoDB                       │
│              Table: attendance-records                   │
│   PK: userId · SK: timestamp · GSI: department-date      │
└──────────────────────────────────────────────────────────┘
       │
       │ Pre-signed URL (upload & download)
       ▼
┌──────────────────────────────────────────────────────────┐
│                     Amazon S3                            │
│              Bucket: attendsecure-photos                 │
│   SSE-KMS encryption · Block all public access          │
│   Object path: photos/{userId}/{timestamp}.jpg           │
└──────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                      AWS KMS                             │
│   Customer Managed Key (CMK) · Key policy restricts      │
│   access to specific IAM roles only                      │
└──────────────────────────────────────────────────────────┘
```

### Request lifecycle (check-in)

1. Employee clicks **Check In** on the frontend.
2. Frontend sends `POST /attendance/checkin` with the Cognito JWT in the `Authorization` header.
3. **API Gateway** validates the JWT against the Cognito User Pool. If invalid → `401`.
4. **Lambda `checkIn`** extracts `userId`, `custom:department`, and `cognito:groups` from the token claims.
5. Lambda writes a record to  **DynamoDB** : `{ userId, timestamp, department, status: "pending_photo" }`.
6. Lambda calls **S3 `createPresignedPost`** to generate a 5-minute upload URL for `photos/{userId}/{timestamp}.jpg`.
7. Lambda returns `{ recordId, uploadUrl }` to the frontend.
8. Frontend uploads the selfie **directly to S3** using the pre-signed URL (bypasses API Gateway entirely).
9. S3 stores the object encrypted with the  **KMS CMK** .
10. Frontend calls `PATCH /attendance/{recordId}` to mark the record as `complete`.

---

## 5. AWS Services Deep Dive

### AWS Cognito

**Purpose:** Authentication and identity management.

**Configuration:**

* **User Pool** with email + password sign-in. Password policy: min 8 chars, requires uppercase, number, and symbol.
* **App Client** with `USER_PASSWORD_AUTH` flow enabled (no client secret — it's a public SPA).
* **User Groups:** `super-admin`, `manager`, `employee`. Each user belongs to exactly one group.
* **Custom Attributes:**
  * `custom:department` — set on user creation, readable in JWT claims.
* **JWT tokens** used: ID Token (contains claims used for authorization). Access Token is not used.
* **Token expiry:** ID Token 1 hour · Refresh Token 30 days.

**What Cognito does NOT handle:**

* Cognito does not enforce data-level access — that is done by Lambda reading the token claims. Cognito only answers "who is this user and what group are they in?"

---

### API Gateway

**Purpose:** Secure, managed entry point for all backend operations.

**Configuration:**

* REST API (not HTTP API — REST API needed for request validation and usage plans).
* **Cognito Authorizer** attached to every route. Any request without a valid, non-expired JWT is rejected before Lambda is invoked.
* **CORS** enabled: `Access-Control-Allow-Origin` set to the CloudFront domain only (not `*`).
* **Throttling:** 100 requests/second burst, 50 requests/second steady-state per stage.
* **Request validation:** Body schema validation on `POST /attendance/checkin` to reject malformed requests early.

**Routes:**

| Method | Path                             | Lambda            | Who can call                      |
| ------ | -------------------------------- | ----------------- | --------------------------------- |
| POST   | `/attendance/checkin`          | `checkIn`       | employee, manager, super-admin    |
| GET    | `/attendance`                  | `getAttendance` | all roles (filtered by role)      |
| GET    | `/attendance/{recordId}/photo` | `getPhotoUrl`   | all roles (filtered by ownership) |
| GET    | `/users`                       | `listUsers`     | super-admin only                  |
| POST   | `/users`                       | `createUser`    | super-admin only                  |
| PATCH  | `/users/{userId}`              | `updateUser`    | super-admin only                  |

---

### AWS Lambda

**Purpose:** Business logic layer.

**Runtime:** Node.js 20.x (or Python 3.12 — either works).

**Key functions:**

#### `checkIn`

* Reads `userId` and `custom:department` from JWT claims.
* Validates the user has not already checked in today (query DynamoDB by userId + today's date prefix).
* Writes attendance record with `status: "pending_photo"`.
* Generates pre-signed S3 POST URL (5 minutes, max 5 MB, `image/jpeg` only).
* Returns `{ recordId, uploadUrl, fields }`.

#### `getAttendance`

* Reads `cognito:groups` from JWT claims.
* If `employee`: queries DynamoDB by `userId` only.
* If `manager`: queries DynamoDB GSI `department-date-index` filtered to `custom:department`.
* If `super-admin`: queries the full GSI, optionally filtered by `department` query param.
* For each record, generates a 15-minute pre-signed GET URL for the photo.

#### `getPhotoUrl`

* Fetches the record from DynamoDB to verify the caller owns the record (or is manager/admin).
* If unauthorized → `403`.
* Generates and returns a fresh 15-minute pre-signed GET URL.

#### `manageUsers`

* Only callable by `super-admin` — Lambda checks claims and returns `403` if not.
* Calls Cognito Admin API: `adminCreateUser`, `adminDisableUser`, `adminAddUserToGroup`.
* Uses a separate IAM role with `cognito-idp:Admin*` permissions scoped to the specific User Pool ARN.

**IAM Execution Roles:**
Each Lambda function has its own IAM role with least-privilege permissions:

| Function          | Permissions                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `checkIn`       | `dynamodb:PutItem`on attendance table ·`s3:PutObject`presign on photos bucket                     |
| `getAttendance` | `dynamodb:Query`on attendance table ·`s3:GetObject`presign on photos bucket                       |
| `manageUsers`   | `cognito-idp:AdminCreateUser`·`cognito-idp:AdminAddUserToGroup`·`cognito-idp:AdminDisableUser` |

---

### Amazon DynamoDB

**Purpose:** Store attendance records.

**Table name:** `attendance-records`

**Key schema:**

* **Partition key (PK):** `userId` (String)
* **Sort key (SK):** `timestamp` (String, ISO 8601 format: `2024-06-06T08:32:11Z`)

**Global Secondary Index (GSI):** `department-date-index`

* **PK:** `department` (String)
* **SK:** `date` (String, `YYYY-MM-DD` — denormalized from timestamp on write)
* Used by managers and admins to query by department + date range.

**Item attributes:**

| Attribute       | Type   | Description                                     |
| --------------- | ------ | ----------------------------------------------- |
| `userId`      | String | Cognito `sub`(UUID)                           |
| `timestamp`   | String | ISO 8601 check-in time                          |
| `date`        | String | `YYYY-MM-DD`— for GSI                        |
| `department`  | String | e.g.`engineering`                             |
| `photoKey`    | String | S3 object key for the photo                     |
| `status`      | String | `pending_photo`or `complete`                |
| `displayName` | String | User's display name (denormalized from Cognito) |

**Billing mode:** On-demand (pay-per-request) — appropriate for a project with unpredictable/low traffic.

**TTL:** Not set for this project. In production, records older than 2 years would be expired automatically.

---

### Amazon S3

**Purpose:** Store selfie photo proofs.

**Bucket name:** `attendsecure-photos-{accountId}-{region}` (globally unique)

**Security configuration:**

* **Block Public Access:** All four settings enabled — no public access ever.
* **Bucket Policy:** Explicit Deny on `s3:GetObject` for any principal that is not the Lambda execution role or the KMS key policy. This means even if someone had an AWS account in the same org, they could not access the photos without the specific IAM role.
* **Server-Side Encryption:** SSE-KMS using the AttendSecure Customer Managed Key (CMK).
* **Versioning:** Disabled (not needed — each photo is write-once).
* **Lifecycle rule:** Transition objects to S3 Glacier after 365 days (cost optimization, optional).

**Object key structure:**

```
photos/{userId}/{YYYY-MM-DD}/{timestamp}.jpg
```

Example: `photos/a1b2c3d4-uuid/2024-06-06/2024-06-06T08-32-11Z.jpg`

**Pre-signed URL behaviour:**

* **Upload URL** (generated by `checkIn` Lambda): Valid 5 minutes. Restricted to `Content-Type: image/jpeg` and max size 5 MB via `s3:PutObject` conditions.
* **Download URL** (generated by `getAttendance` / `getPhotoUrl`): Valid 15 minutes. Generated on-demand per request — never stored or cached.

---

### AWS KMS

**Purpose:** Encryption key management for S3 photos.

**Key type:** Customer Managed Key (CMK), symmetric, AES-256.

**Key policy highlights:**

* Root account has full access (emergency access only).
* `checkIn` Lambda role has `kms:GenerateDataKey` permission (needed to encrypt on upload).
* `getAttendance` Lambda role has `kms:Decrypt` permission (needed to generate pre-signed download URLs).
* `manageUsers` Lambda role has no KMS permissions.
* All other principals are implicitly denied.

**Why not SSE-S3?** Using KMS gives you an audit trail in CloudTrail of every encryption and decryption event, which is a security requirement for sensitive data like biometric proof photos.

---

### CloudFront + S3 (Frontend)

**Purpose:** Serve the React frontend globally over HTTPS.

**Setup:**

* A second S3 bucket hosts the built React app (HTML, JS, CSS).
* **Origin Access Control (OAC)** is used — CloudFront can read the bucket, but the bucket itself blocks all direct public access.
* **HTTPS only** — HTTP requests are redirected to HTTPS (301).
* **Custom error pages:** 404 and 403 both serve `index.html` with a 200 response (required for React Router to work correctly).
* **Cache behaviour:** Static assets (`/static/*`) cached 1 year with content-hash filenames. `index.html` cached 0 seconds (always fetches the latest).

---

## 6. Security Design

### Authentication flow

```
User enters email + password
        │
        ▼
Cognito User Pool validates credentials
        │
        ▼
Cognito issues: ID Token (1hr) + Refresh Token (30 days)
        │
        ▼
Frontend stores tokens in memory only (NOT localStorage)
        │
        ▼
Every API request: Authorization: Bearer {idToken}
        │
        ▼
API Gateway Cognito Authorizer validates signature + expiry
        │
        ▼
Lambda reads claims from the validated token
```

**Why not localStorage?** Storing JWTs in localStorage exposes them to XSS attacks. Storing in memory means the token is lost on page refresh — acceptable trade-off for a security-focused project. In production, an HttpOnly cookie would be ideal.

### Authorization model (RBAC)

```
Token claim: cognito:groups → ["manager"]
Token claim: custom:department → "engineering"

Lambda getAttendance():
  if groups includes "super-admin":
    → query all records (optional dept filter)
  else if groups includes "manager":
    → query by department == custom:department
  else:  // employee
    → query by userId == sub
```

### Encryption at rest

| Data              | Encryption                     |
| ----------------- | ------------------------------ |
| Photos in S3      | SSE-KMS (Customer Managed Key) |
| DynamoDB records  | SSE (AWS-owned key, default)   |
| Cognito user data | Managed by AWS                 |

For a production system, DynamoDB would also use a CMK. For this project, the AWS-owned key for DynamoDB is an acceptable simplification.

### Encryption in transit

All communication uses TLS 1.2+:

* Browser ↔ CloudFront: enforced by CloudFront (minimum TLS 1.2)
* CloudFront ↔ S3 (frontend): internal AWS
* Browser ↔ API Gateway: API Gateway enforces HTTPS
* Lambda ↔ DynamoDB: internal AWS, always encrypted
* Lambda ↔ S3: internal AWS, always encrypted

### Photo access control

Photos are the most sensitive data in the system. The access path is:

```
User requests photo → Lambda verifies ownership → Lambda generates presigned URL (15min)
                                                         │
                                          URL expires automatically
                                          URL is single-use-window (not revocable mid-window)
                                          URL is HTTPS only
```

The photo URL is never stored anywhere — it is generated fresh on every request and expires 15 minutes later. An attacker who intercepts a URL has a 15-minute window before it becomes useless.

### What is NOT covered (honest scope limits)

| Gap                            | Why it's out of scope                                              |
| ------------------------------ | ------------------------------------------------------------------ |
| Photo liveness / anti-spoofing | Requires Amazon Rekognition — adds complexity beyond 3-day scope  |
| MFA on login                   | Cognito supports TOTP MFA but is not enabled in this build         |
| WAF on API Gateway             | AWS WAF adds cost; not included in free tier                       |
| VPC for Lambda                 | Lambdas run outside a VPC (default), acceptable for a project      |
| CloudTrail alerting            | GuardDuty / CloudTrail analysis not connected to SNS in this build |

---

## 7. Data Models

### DynamoDB: `attendance-records`

```json
{
  "userId": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "timestamp": "2024-06-06T08:32:11Z",
  "date": "2024-06-06",
  "department": "engineering",
  "displayName": "Budi Santoso",
  "photoKey": "photos/a1b2c3d4-5678.../2024-06-06/2024-06-06T08-32-11Z.jpg",
  "status": "complete"
}
```

### Cognito User attributes

```
sub (UUID)                    — immutable, used as userId
email                         — login identifier
name                          — display name
custom:department             — engineering | marketing | hr | etc.
cognito:groups                — super-admin | manager | employee
```

### API response: `GET /attendance`

```json
{
  "records": [
    {
      "recordId": "a1b2c3d4_2024-06-06T08:32:11Z",
      "userId": "a1b2c3d4-...",
      "displayName": "Budi Santoso",
      "department": "engineering",
      "timestamp": "2024-06-06T08:32:11Z",
      "status": "complete",
      "photoUrl": "https://attendsecure-photos.s3.amazonaws.com/photos/...?X-Amz-Expires=900&..."
    }
  ],
  "count": 1
}
```

---

## 8. API Endpoints

All endpoints require `Authorization: Bearer {cognitoIdToken}` header.

### `POST /attendance/checkin`

**Who:** Any authenticated user (all roles).

**Request body:**

```json
{}
```

(No body needed — user identity comes from the JWT token.)

**Response `200`:**

```json
{
  "recordId": "a1b2c3d4_2024-06-06T08-32-11Z",
  "uploadUrl": "https://attendsecure-photos.s3.amazonaws.com/",
  "uploadFields": {
    "key": "photos/a1b2c3d4/.../2024-06-06T08-32-11Z.jpg",
    "Content-Type": "image/jpeg",
    "X-Amz-Credential": "...",
    "X-Amz-Signature": "...",
    "Policy": "..."
  },
  "uploadExpiresIn": 300
}
```

**Error `409`:** Already checked in today.

---

### `GET /attendance`

**Who:** All roles (response is filtered by role).

**Query params:**

* `date` (optional, `YYYY-MM-DD`) — defaults to today.
* `department` (optional) — super-admin only; ignored for other roles.

**Response `200`:** Array of attendance records with photo URLs (see Data Models).

---

### `GET /attendance/{recordId}/photo`

**Who:** Owner (employee), manager of the same dept, super-admin.

**Response `200`:**

```json
{
  "photoUrl": "https://...",
  "expiresIn": 900
}
```

**Error `403`:** Caller does not have access to this record.

---

### `POST /users` (admin only)

**Request body:**

```json
{
  "email": "jane@company.com",
  "name": "Jane Doe",
  "department": "marketing",
  "role": "employee"
}
```

**Response `201`:**

```json
{
  "userId": "new-uuid",
  "temporaryPassword": "TempPass123!"
}
```

---

## 9. User Flows

### Employee check-in flow

```
1. Open app → redirected to Cognito Hosted UI if not logged in
2. Enter email + password → Cognito issues JWT
3. Frontend shows "Check In" button (greyed out if already checked in today)
4. Click "Check In" → POST /attendance/checkin
5. Camera opens → user takes selfie
6. Frontend uploads photo directly to S3 using pre-signed URL
7. Frontend calls PATCH /attendance/{recordId} to mark complete
8. UI shows "✓ Checked in at 08:32" + thumbnail
```

### Manager views department attendance

```
1. Log in as manager
2. Dashboard loads → GET /attendance?date=today
3. Lambda filters records to manager's department only
4. Table renders with employee names, timestamps, status
5. Manager clicks a row → GET /attendance/{recordId}/photo
6. Selfie photo loads inline via pre-signed URL
```

---

## 10. Environment & Configuration

### Environment variables (Lambda)

| Variable                  | Value                                |
| ------------------------- | ------------------------------------ |
| `ATTENDANCE_TABLE`      | DynamoDB table name                  |
| `PHOTOS_BUCKET`         | S3 bucket name                       |
| `KMS_KEY_ID`            | ARN of the CMK                       |
| `COGNITO_USER_POOL_ID`  | Cognito User Pool ID                 |
| `COGNITO_APP_CLIENT_ID` | App Client ID                        |
| `ALLOWED_ORIGIN`        | CloudFront domain (for CORS headers) |

### Frontend environment variables (build-time)

| Variable                            | Value                  |
| ----------------------------------- | ---------------------- |
| `REACT_APP_API_URL`               | API Gateway invoke URL |
| `REACT_APP_COGNITO_REGION`        | e.g.`ap-southeast-1` |
| `REACT_APP_COGNITO_USER_POOL_ID`  | Cognito User Pool ID   |
| `REACT_APP_COGNITO_APP_CLIENT_ID` | App Client ID          |

### Recommended AWS region

**`ap-southeast-1` (Singapore)** — lowest latency for Indonesian users.

---

## 11. Project Structure

```
attendsecure/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CheckInButton.jsx
│   │   │   ├── AttendanceTable.jsx
│   │   │   ├── PhotoModal.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── pages/
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── ManagerDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js          ← Cognito token management
│   │   └── utils/
│   │       └── api.js              ← Axios wrapper with auth header
│   └── package.json
│
├── backend/
│   ├── functions/
│   │   ├── checkIn/
│   │   │   └── index.js
│   │   ├── getAttendance/
│   │   │   └── index.js
│   │   ├── getPhotoUrl/
│   │   │   └── index.js
│   │   └── manageUsers/
│   │       └── index.js
│   └── package.json
│
└── infrastructure/
    └── setup-notes.md              ← Manual AWS Console setup steps
```

---

## 12. Known Constraints & Trade-offs

| Decision                                          | Trade-off                                                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Pre-signed URL instead of Lambda proxy for photos | Faster & cheaper (no Lambda memory for binary data), but URL can be shared within 15-min window                                 |
| JWT stored in memory, not HttpOnly cookie         | Simpler setup (no backend session management), but token lost on page refresh — user must re-login                             |
| DynamoDB with SSE-AWS-owned key                   | Simpler than CMK, but no per-key audit trail in KMS                                                                             |
| No VPC for Lambda                                 | Lambdas can reach the internet (needed for Cognito API calls). In production, a VPC with NAT Gateway would isolate them further |
| On-demand DynamoDB billing                        | Zero cost at zero traffic, but more expensive than provisioned at high, predictable load                                        |
| Cognito Hosted UI for login                       | Fast to set up, but styling is limited. A custom login form calling Cognito SDK directly would look better                      |
| Single AWS region                                 | No disaster recovery. Acceptable for a course project                                                                           |

---

*AttendSecure — Cloud Computing Security course project*
*AWS Services: Cognito · API Gateway · Lambda · DynamoDB · S3 · KMS · CloudFront*
