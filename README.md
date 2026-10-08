# AI-Workout and Diet Plan - Web Application

An integrated, web-based fitness and nutrition platform that leverages **Machine Learning, physical metabolic calculations (BMI, BMR, TDEE), and sports science** to deliver tailored workout routines and diet charts.

---

## 🌟 Key Features

### 1. User Authentication & Profiles

* Secure account registration with hashed passwords using Werkzeug.
* Login using username or email.
* Session-based authentication.
* Detailed profile management including:

  * Age
  * Gender
  * Height
  * Weight
  * Target Weight
  * Fitness Goal
  * Activity Level
  * Exercise Frequency
  * Dietary Preference
  * Health Considerations
* Automatic profile validation.
* Personalized recommendations are regenerated when the fitness profile is updated.

---

### 2. Accurate BMI & Metabolic Assessment

* Instant metric BMI calculation:

  **BMI = Weight (kg) / Height (m)²**

* BMI category classification:

  * Underweight
  * Normal Weight
  * Overweight
  * Obesity Class I
  * Obesity Class II
  * Obesity Class III

* Ideal healthy weight range calculation.

* BMR calculation using the **Mifflin-St Jeor formula**.

* TDEE calculation based on activity level.

* Target calorie calculation.

* Protein, carbohydrate, and fat target calculation.

* Water intake recommendation.

---

### 3. AI & Machine Learning Recommendation Engine

The project contains an AI/ML recommendation engine in `ml_engine.py`.

* Random Forest classifiers and regressors using Scikit-Learn.
* Fitness parameters are used to support personalized recommendations.
* Recommendation processing considers user-specific fitness characteristics.
* Generates personalized workout and diet plans.

#### 7-Day Workout Routine

The system can generate workout schedules such as:

* Push/Pull/Legs
* Upper/Lower
* Full Body
* Fat-Loss HIIT

Workout recommendations can contain:

* Exercise names
* Target muscles
* Sets
* Repetitions
* Rest periods
* Coaching cues
* Demonstration video links

#### 7-Day Nutrition Plan

The system generates nutrition recommendations based on the user's profile and dietary preference.

Supported diet preferences include:

* Standard Omnivore
* Vegetarian
* Vegan
* Keto
* High-Protein

The plan can include:

* Breakfast
* Morning Boost
* Lunch
* Pre/Post Workout Snack
* Dinner
* Calories
* Protein
* Carbohydrates
* Fat targets

---

### 4. Curated Fitness & Cooking Video Library

FitAI provides a dedicated video library containing curated fitness and cooking tutorials.

#### Exercise Videos

Examples include:

* Squats
* Bench Press
* Deadlifts
* Push-ups
* HIIT
* Abs/Core exercises

#### Cooking & Nutrition Videos

Examples include:

* High-protein meal preparation
* Healthy breakfast preparation
* Overnight oats
* Tofu stir-fry
* Recovery smoothie bowls

The video library includes:

* Video thumbnails
* Video titles
* Descriptions
* Categories
* Difficulty levels
* Duration
* Watch Now functionality
* Responsive video modal player

---

### 5. External Internet Video Search

FitAI is not limited to the videos stored inside the project.

If a user does not find a suitable video in the curated FitAI video library, the application provides an **Internet Video Search** option.

Users can search for any video they want, for example:

* Yoga for beginners
* Chest workout
* Home workout
* Weight loss exercise
* High-protein breakfast
* Healthy dinner recipes

The search redirects the user's query to **YouTube's internet search results** in a new browser tab.

This allows users to discover additional videos beyond the predefined FitAI video collection.

> **Note:** The current implementation uses YouTube's search page directly and does not require a YouTube API key.

---

### 6. Nearby Gym & Fitness Locator

* Interactive **Leaflet.js** map.
* OpenStreetMap tiles.
* Browser geolocation support.
* "Near Me" functionality.
* Radius visualization.
* Nearby gym cards.
* Gym ratings.
* Gym addresses.
* Distance calculation in kilometers.
* Driving directions.
* Personal favorite/bookmark functionality.

---

### 7. Progress Tracking & Interactive Charts

Users can record and monitor their fitness progress.

Progress tracking can include:

* Daily weight
* Workout completion
* Calories burned
* Water intake
* Chest measurement
* Waist measurement
* Hip measurement

Interactive visualizations use **Chart.js**.

The system provides charts such as:

* Weight vs Goal trajectory
* BMI history

The dashboard also includes a quick water logger such as:

**+250 ml**

for convenient hydration tracking.

---

### 8. Fitness & Meal Reminder Module

FitAI provides customizable fitness and nutrition reminders.

Examples include:

* Morning workout reminder
* Hydration reminder
* Meal reminder
* High-protein dinner reminder

The reminder system supports:

* Custom schedules
* In-app notifications
* Web Notification API
* Desktop push notifications
* Reminder status management

Default reminders can be created for new users.

---

### 9. Dashboard

The FitAI dashboard provides a centralized view of the user's fitness information.

The dashboard can display:

* Current weight
* Target weight
* BMI
* BMI category
* BMR
* TDEE
* Target calories
* Macronutrients
* Water intake
* Today's workout
* Today's diet plan
* Progress information
* Workout streak
* Active reminders

The dashboard automatically selects the appropriate workout/diet plan for the current day.

---

### 10. Recipes & Nutrition Support

The application supports nutrition-related content through:

* Diet recommendations
* Meal planning
* Cooking tutorials
* High-protein meal suggestions
* Food preference-based recommendations

The recipe/cooking content complements the personalized diet plan.

---

### 11. Export & Print

FitAI provides a dedicated print-optimized recommendation page.

The `/recommendations/print` route can be used to generate a clean printable version of:

* Workout plan
* Diet plan
* Fitness information
* Nutrition information

This can be used for physical printing or browser-based PDF generation.

---

## 🛠️ Technology Stack

### Backend

* Python 3
* Flask

### Database

* SQLite3
* Foreign keys
* Cascading relationships

### Machine Learning & Analytics

* Scikit-Learn
* Pandas
* NumPy
* Joblib

### Frontend

* HTML5
* CSS3
* JavaScript ES6
* Jinja2 Templates
* Responsive UI
* Modern dark theme

### Mapping

* Leaflet.js
* OpenStreetMap

### Data Visualization

* Chart.js

### Icons & Typography

* FontAwesome 6
* Google Fonts / Inter

### External Video Search

* YouTube web search

### Testing

* Pytest

---

## 📁 Directory Structure

```text
D:\DIET PLAN\

├── app.py                  # Main Flask application entry point & routes
├── config.py               # Application configuration
├── database.py             # Database connection, schemas, and queries
├── ml_engine.py            # ML recommendation models and fitness calculations
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
├── test_app.py             # Automated unit and integration tests

├── static/
│   ├── css/
│   │   └── style.css       # Fitness UI stylesheet and print styles
│   │
│   └── js/
│       ├── main.js         # Video modal, mobile navigation, BMI calculator
│       ├── tracker.js      # Progress tracking and Chart.js charts
│       ├── map.js          # Leaflet.js gym search and geolocation
│       └── reminders.js    # Notifications and reminder schedules

└── templates/
    ├── base.html           # Base navigation layout and footer
    ├── index.html          # Landing page and quick BMI tool
    ├── login.html          # Login screen
    ├── register.html       # Registration screen
    ├── profile.html        # Profile and fitness metrics editor
    ├── dashboard.html      # User dashboard and daily plan
    ├── recommendations.html# AI workout and diet recommendations
    ├── print_plan.html     # Print/PDF-ready fitness blueprint
    ├── videos.html         # Curated videos + Internet video search
    ├── gym_search.html     # Interactive nearby gym finder
    ├── progress.html       # Progress tracker and charts
    └── reminders.html      # Reminder management and alerts
```

---

## 🔄 Application Workflow

The overall FitAI workflow is:

```text
User
  ↓
Registration
  ↓
Login
  ↓
User Profile
  ↓
Fitness Data Collection
  ↓
Data Validation & Processing
  ↓
BMI Calculation
  ↓
BMR Calculation
  ↓
TDEE Calculation
  ↓
Target Calories & Macronutrients
  ↓
AI / ML Recommendation Engine
  ↓
Personalized Workout Plan
  +
Personalized Diet Plan
  ↓
Dashboard
  ↓
 ┌─────────────────────────────────────┐
 │ Workout Plan                        │
 │ Diet Plan                           │
 │ Progress Tracking                   │
 │ Fitness & Cooking Videos            │
 │ Internet Video Search               │
 │ Recipes                             │
 │ Gym Search                          │
 │ Reminders                           │
 │ Print / Export                      │
 └─────────────────────────────────────┘
```

---

## 🤖 AI / ML Processing

The recommendation engine uses fitness-related user information as input.

### Input Features

* Age
* Gender
* Height
* Weight
* Target Weight
* BMI
* Fitness Goal
* Activity Level
* Exercise Frequency
* Dietary Preference

### Processing

```text
User Fitness Data
       ↓
Data Validation
       ↓
BMI / BMR / TDEE
       ↓
Fitness Parameter Processing
       ↓
ML Recommendation Engine
       ↓
Workout Recommendation
       +
Diet Recommendation
```

### Output

The system produces:

* Workout split
* Workout intensity
* Exercises
* Sets
* Repetitions
* Rest periods
* Calorie target
* Protein target
* Carbohydrate target
* Fat target
* Meal plan
* Water intake

---

## 🗄️ Database

The application uses SQLite3 for persistent data storage.

The database stores information related to:

### Users

Account and authentication information.

### User Profiles

Fitness and personal profile information.

### Recommendations

Generated workout and diet plans.

### Progress Logs

Daily fitness progress and measurements.

### Reminders

Workout, hydration, and meal reminders.

Foreign keys and cascading relationships are used to maintain database integrity.

---

## 🔐 Security

The application includes several security mechanisms:

* Password hashing using Werkzeug.
* Session-based authentication.
* Protected routes.
* Login-required decorators.
* User-specific data access.
* Registration validation.
* Duplicate username/email checking.
* Password confirmation and minimum-length validation.

---

## 🚀 How to Run the Application

### 1. Open the Project Folder

```bash
cd "D:\DIET PLAN"
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

#### Windows PowerShell

```powershell
venv\Scripts\Activate.ps1
```

#### Windows Command Prompt

```cmd
venv\Scripts\activate.bat
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the Flask Server

```bash
python app.py
```

### 6. Open the Application

Navigate to:

```text
http://127.0.0.1:5000
```

---

## 🧪 Run Automated Tests

Run:

```bash
pytest test_app.py -v
```

This executes the automated unit and integration tests available in the project.

---

## 📌 Important Project Modules

### `app.py`

Main Flask application containing:

* Authentication routes
* Registration
* Login
* Dashboard
* Profile management
* Recommendation routes
* Video library
* Progress tracking
* Reminders
* Gym search
* Print/export functionality

### `ml_engine.py`

Contains:

* BMI calculation
* BMR calculation
* TDEE calculation
* Calorie calculations
* Macronutrient calculations
* Exercise database
* Meal database
* AI/ML recommendation logic
* Workout plan generation
* Diet plan generation

### `database.py`

Responsible for:

* Database initialization
* SQLite connections
* SQL queries
* Database operations
* Data storage

### `videos.html`

Provides:

* Curated FitAI video library
* Video category filtering
* Project video search
* Video modal playback
* External internet/YouTube video search

---

## 🎯 Project Objective

The primary objective of FitAI is to create an intelligent and personalized fitness platform that combines **Artificial Intelligence, Machine Learning, metabolic calculations, nutrition planning, workout recommendations, progress tracking, reminders, fitness videos, and external internet video search** in one web application.

Instead of providing the same generic plan to every user, FitAI processes individual fitness characteristics to provide recommendations that are more relevant to each user's goals and preferences.

---

## 🔮 Future Enhancements

Possible future improvements include:

1. Direct YouTube Data API integration.
2. Displaying external video results inside FitAI.
3. Larger fitness and nutrition datasets.
4. Advanced deep-learning recommendation models.
5. Wearable device integration.
6. Smartwatch and fitness-band synchronization.
7. AI-based fitness chatbot improvements.
8. Voice-controlled fitness assistant.
9. Mobile Android/iOS application.
10. Advanced progress prediction.
11. Larger nutrition and food database.
12. Personalized AI fitness coaching.
13. Exercise form detection using computer vision.

---

## ⚠️ Disclaimer

FitAI is intended for fitness planning and educational purposes.

The generated workout and nutrition recommendations should not be considered a substitute for professional medical, nutritional, or fitness advice. Users with medical conditions or specific health requirements should consult a qualified professional before following a new exercise or nutrition program.

---

## 👨‍💻 Project Summary

**Project:** AI Workout and Diet Plan

**Application:** FitAI

**Type:** Web-Based AI/ML Fitness and Nutrition Platform

**Backend:** Python + Flask

**Database:** SQLite3

**Machine Learning:** Scikit-Learn

**Frontend:** HTML, CSS, JavaScript, Jinja2

**Mapping:** Leaflet.js + OpenStreetMap

**Charts:** Chart.js

**Video Support:** Curated video library + YouTube Internet Search

**Testing:** Pytest

The project combines fitness calculations, machine learning, personalized recommendations, nutrition planning, workout planning, progress monitoring, reminders, video learning, gym discovery, and external video searching into a single fitness management platform.
