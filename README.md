🌦️ Interactive Weather App

A modern, responsive, and user-friendly weather application powered by the WeatherAPI.
Users can search any city, view current weather conditions, air quality index (AQI), and even use their current location for automatic weather detection.


✨ Features

🔍 Search weather by city name

📍 Use device location to get current weather

☀️ Dynamic day/night background

🌡️ Real-time temperature, wind, humidity, pressure, visibility

🪁 Air Quality Index (AQI) with color-coded severity badges

🎨 Glassmorphism UI with smooth animations

📱 Fully responsive for mobile and desktop screens

⚡ Fast API calls using WeatherAPI.com

🖥️ Preview

<img width="988" height="594" alt="image" src="https://github.com/user-attachments/assets/06ef35a3-c910-432d-837b-b01cf5b32afa" />


📂 Project Structure
weather-app/
│
├── index.html     # Main UI layout
├── styles.css     # App styling & animations
├── app.js         # API logic & interactions
└── README.md      # Project documentation

🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

2️⃣ Add your WeatherAPI key

Open app.js and replace this line:

const API_KEY = "YOUR_API_KEY_HERE";


with your actual WeatherAPI key:

const API_KEY = "4527bc2c6e824164b5974300250512";

3️⃣ Run the project

Simply open:

index.html


in any browser — no server needed.

🔧 Technologies Used

HTML5

CSS3 (Glassmorphism + Responsive Design)

Vanilla JavaScript

WeatherAPI (current weather + AQI)

🌬️ API Used

This project uses the free tier of:
🔗 https://www.weatherapi.com/

Example request:

http://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=London&aqi=yes

🧩 Future Improvements (optional)

7-day forecast section

Hourly weather timeline

Animated weather icons

Theme selector (light/dark)

Save favorite cities

PWA (installable mobile app)

🤝 Contributing

Pull requests are welcome!
If you have ideas to improve UI or features, feel free to open an issue.

📄 License

MIT License © Anurag Thakur
