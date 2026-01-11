# LegTalker Architecture Documentation

This document outlines the technical architecture of the **LegTalker** application (v3.2).

## 1. System Overview
LegTalker is a **Hybrid Mobile Application** built with React and wrapped natively using Capacitor. It operates entirely offline, using the device's local storage and file system.

```mermaid
graph TD
    User((User))
    
    subgraph "LegTalker App (Android)"
        UI[React UI Layer]
        Logic[Business Logic]
        
        subgraph "Capacitor Bridge"
            FS[Filesystem Plugin]
            Share[Share Plugin]
        end
        
        Storage[(LocalStorage)]
        Cache[App Cache]
    end
    
    User <-->|Touch / View| UI
    UI <-->|State / Props| Logic
    Logic <-->|Read / Write| Storage
    Logic -->|Write JSON| FS
    FS -->|Store File| Cache
    Cache -->|Share URI| Share
    Share -->|Native Sheet| User
```

## 2. Component Hierarchy
The UI is structured as a single-page application (SPA) with three main interactive zones.

```mermaid
graph TD
    App[App.jsx]
    
    Dashboard[Dashboard.jsx]
    Calendar[CalendarView.jsx]
    LogForm[LogExercise.jsx]
    
    App -->|Stats & ViewType| Dashboard
    App -->|ViewType & EditHandler| Calendar
    App -->|EditHandler| LogForm
    
    subgraph "Logic & Data"
        Storage[storage.js]
    end
    
    App -.->|Fetch Data| Storage
    Dashboard -.->|Export/Import| Storage
    Calendar -.->|Delete Log| Storage
    LogForm -.->|Add/Update Log| Storage
```

## 3. Data Schema
Data is stored as a JSON string in `localStorage` key `legwalker_logs`.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique timestamp-based ID (e.g. "1704445555555") |
| `date` | `string` | Log date (YYYY-MM-DD) based on Local Time |
| `minutes` | `number` | Duration of activity |
| `type` | `string` | 'exercise' (default) or 'meditation' |
| `timestamp` | `string` | Creation timestamp (ISO string) |

## 4. Key Workflows

### A. Logging an Activity
How data flows when a user adds a new entry.

```mermaid
sequenceDiagram
    participant U as User
    participant Form as LogExercise
    participant App as App.jsx
    participant DB as storage.js
    
    U->>Form: Selects Type (Exercise/Meditation)
    U->>Form: Enters Date & Minutes
    U->>Form: Clicks "Log"
    
    Form->>DB: addLog({ date, minutes, type })
    DB->>DB: Read Logs -> Append -> Sort -> Save
    
    Form->>App: Calls onLogAdded()
    App->>DB: getStats()
    DB-->>App: Returns updated stats
    App->>App: Updates State
    App-->>Form: Re-renders (clears form)
```

### B. Editing an Existing Log
The interaction between Calendar (Selection) and Form (Editing).

```mermaid
sequenceDiagram
    participant U as User
    participant Cal as CalendarView
    participant App as App.jsx
    participant Form as LogExercise
    participant DB as storage.js
    
    U->>Cal: Clicks "Edit" (Pencil) on a log
    Cal->>App: setEditingLog(log)
    App->>Form: Pass log as prop
    Form->>Form: Pre-fill inputs & Change Button to "Update"
    Form->>U: Scrolls to Form
    
    U->>Form: Modifies data -> Clicks "Update"
    Form->>DB: updateLog(updatedLog)
    DB->>DB: Find Index -> Merge -> Save
    
    Form->>App: setEditingLog(null)
    Form->>App: onLogAdded()
    App->>U: Refreshes UI (Calendar & Stats)
```

### C. Native Export Process
How the app exports data using Android native features.

```mermaid
sequenceDiagram
    participant U as User
    participant Dash as Dashboard
    participant DB as storage.js
    participant Cap as Capacitor (Native)
    
    U->>Dash: Clicks "Export Data"
    Dash->>DB: exportData()
    DB->>DB: getLogs() -> JSON.stringify()
    
    DB->>Cap: Filesystem.writeFile(cache/legtalker_backup.json)
    Cap-->>DB: Returns File URI
    
    DB->>Cap: Share.share(fileURI)
    Cap->>U: Opens Android Share Menu
    U->>Cap: Selects Target (Drive, Gmail, etc.)
```
