import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";

const API_KEY = "a89a03a56a901b35deff24ddb58f5468";

export default function App() {
  const [city, setCity] = useState("Pristina");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current weather
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("City not found or API error");

      const data = await response.json();
      console.log("Current Weather Data:", data);
      setWeather(data);
    } catch (err) {
      console.error("Error fetching weather:", err.message);
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch 5-day forecast
  const fetchForecast = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Forecast fetch error");

      const data = await response.json();
      console.log("Forecast Raw Data:", data);

      const daily = data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .map((item) => ({
          date: item.dt_txt.split(" ")[0],
          temp: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        }));

      console.log("Parsed Daily Forecast:", daily);
      setForecast(daily);
    } catch (err) {
      console.error("Error fetching forecast:", err.message);
      setForecast([]);
    }
  };

  // Load weather + forecast
  const loadWeatherData = async () => {
    await fetchWeather(city);
    await fetchForecast(city);
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Weather App</Text>
      </View>

      {/* Input + Button */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          placeholderTextColor="#6b7280"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={loadWeatherData}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#93C572" />
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Current Weather */}
      {weather && (
        <View style={styles.card}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{weather.main.temp}°C</Text>
          <Text style={styles.description}>
            {weather.weather[0].description}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Humidity:</Text>
            <Text style={styles.infoValue}>{weather.main.humidity}%</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wind:</Text>
            <Text style={styles.infoValue}>{weather.wind.speed} m/s</Text>
          </View>
        </View>
      )}

      {/* 5-day Forecast */}
      {forecast.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.forecastTitle}>5-Day Forecast</Text>
          <FlatList
            data={forecast}
            keyExtractor={(item) => item.date}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View style={styles.forecastCard}>
                <Text style={styles.forecastDate}>{item.date}</Text>
                <Image
                  source={{
                    uri: `http://openweathermap.org/img/wn/${item.icon}@2x.png`,
                  }}
                  style={styles.forecastIcon}
                />
                <Text style={styles.forecastTemp}>{item.temp}°C</Text>
                <Text style={styles.forecastDesc}>{item.description}</Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f5f0", // very light green
    padding: 20,
  },
  header: {
    backgroundColor: "#93C572",
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#e6f0e6",
    color: "#374151",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#93C572",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  city: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
  },
  temp: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#93C572",
    textAlign: "center",
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  infoLabel: {
    color: "#6b7280",
    fontSize: 16,
  },
  infoValue: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    color: "#93C572",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
  },
  forecastTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  forecastCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    alignItems: "center",
    width: 120,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  forecastDate: {
    color: "#374151",
    fontWeight: "600",
    marginBottom: 5,
    fontSize: 14,
    textAlign: "center",
  },
  forecastTemp: {
    color: "#93C572",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 5,
  },
  forecastDesc: {
    color: "#6b7280",
    textAlign: "center",
    fontSize: 12,
  },
  forecastIcon: {
    width: 50,
    height: 50,
  },
});

