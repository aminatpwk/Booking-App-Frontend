# BookingBrains - Frontend Project (Angular 20)
![Angular](https://img.shields.io/badge/Angular-20.3.2-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)
![RxJS](https://img.shields.io/badge/RxJS-7.8.0-purple)
![License](https://img.shields.io/badge/License-Proprietary-red)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Architecture](https://img.shields.io/badge/Architecture-Standalone%20Components-orange)

## Overview

BookingBrains is a full-stack booking platform developed as part of an internship project at 3i Solutions Albania. The frontend leverages the latest Angular features to deliver a responsive, type-safe, and maintainable user experience.

### Key Features

- **User Authentication & Authorization**: Secure JWT-based authentication with role-based access control (User/Owner)
- **Apartment Search & Filtering**: Advanced search with pagination, sorting, and real-time filtering
- **Owner Dashboard**: Property management interface for apartments
- **Responsive Design**: Mobile-first approach ensuring seamless experience across devices
- **Real-time Notifications**: Toast-based feedback system using ngx-toastr
- **Type-Safe Development**: Comprehensive TypeScript interfaces and models

## Technical Stack

- **Framework**: Angular 20.3.2
- **Language**: TypeScript 5.8.2
- **State Management**: RxJS 7.8.0
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router with Guards
- **Forms**: Reactive Forms (FormBuilder, Validators)
- **UI Icons**: Lucide Angular 0.548.0
- **Notifications**: ngx-toastr 19.1.0
- **Authentication**: JWT Decode 4.0.0
- **Build Tool**: Angular CLI with esbuild

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core application modules
│   │   ├── guards/              # Route guards 
│   │   ├── interceptors/        # HTTP interceptors 
│   │   ├── models/              # TypeScript interfaces and DTOs
│   │   └── services/            # Business logic services
│   ├── features/                # Feature modules
│   │   ├── auth/                # Authentication feature
│   │   └── dashboard/           # User dashboards
│   ├── pages/                   # Static pages
│   ├── shared/                  # Shared components
│   └── environment/             # Environment configurations
└── assets/                      # Static assets
```

## Implementation Overview

### 1. **Standalone Components Architecture**

All components utilize Angular's standalone API, eliminating the need for NgModules.

### 2. **Reactive Forms with Strong Typing**

Extensive use of Angular's Reactive Forms for complex form handling.

### 3. **Route Guards for Authorization**

Functional route guards using Angular's modern guard API.

### 4. **RxJS and Observable Patterns**

Proper subscription management and reactive programming.

**Key Practices**:
- `takeUntil` pattern for subscription cleanup
- Avoiding memory leaks
- Subject-based cleanup strategy
- Proper Observable lifecycle management

### 5. **Type-Safe Models and DTOs**

Comprehensive TypeScript interfaces for API contracts.

### 6. **Lazy Loading Strategy**

Route-level code splitting for optimal performance.

### 7. **HTTP Interceptor Pattern**

Authentication token injection via HTTP interceptors.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

```bash
git clone https://github.com/aminatpwk/Booking-App-Frontend

cd booking-app-frontend

npm install

# Start development server
ng serve
```

The application will be available at `http://localhost:4200/`

## License

This project is proprietary software developed by Amina.

---

_treat people with kindness :)_
