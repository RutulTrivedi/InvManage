const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "invmanage@jwt";

// api/users/signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// api/users/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// api/users/update/:id
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Incorrect password" });

        // Update user info
        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// api/users/:id
exports.getUserById = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId).select("-password"); // exclude password
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  