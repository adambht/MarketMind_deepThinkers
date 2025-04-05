const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User"); // Import du modèle User
const bcrypt = require('bcryptjs'); // Pour la gestion du mot de passe
const jwt = require('jsonwebtoken'); // Pour la création du token

const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json()); // Permet de parser les requêtes en JSON

// 🔹 Connexion à MongoDB avec gestion des erreurs
mongoose
  .connect("mongodb://127.0.0.1:27017/users_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 🔹 Route pour l'inscription
app.post("/register", async (req, res) => {
    try {
      const { name, email, password, birthDate, phone } = req.body;
  
      // Vérifier que tous les champs sont bien remplis
      if (!name || !email || !password || !birthDate || !phone) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hasher le mot de passe avant de le stocker
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Création d'un nouvel utilisateur
      const newUser = new User({
        name,
        email,
        password: hashedPassword, // Stocker le mot de passe haché
        birthDate,
        phone
      });
  
      await newUser.save();
      
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  app.get("/check-session", (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.json({ valid: false });
  
    jwt.verify(token, "your-secret-key", (err, user) => {
      if (err) return res.json({ valid: false });
      res.json({ valid: true });
    });
  });
  


  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});




























// 🔹 Démarrage du serveur
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
