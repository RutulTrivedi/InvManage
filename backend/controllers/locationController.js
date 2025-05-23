const Location = require("../models/Location");

// Create Location
exports.createLocation = async (req, res) => {
  const { name, address, userId } = req.body;

  try {
    const newLocation = await Location.create({ name, address, userId });
    res.status(201).json({ message: "Location created", location: newLocation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Location
exports.updateLocation = async (req, res) => {
  const locationId = req.params.id;
  const { name, address } = req.body;

  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      locationId,
      { name, address },
      { new: true, runValidators: true }
    );

    if (!updatedLocation) return res.status(404).json({ message: "Location not found" });

    res.status(200).json({ message: "Location updated", location: updatedLocation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Location
exports.deleteLocation = async (req, res) => {
  const locationId = req.params.id;

  try {
    const deletedLocation = await Location.findByIdAndDelete(locationId);

    if (!deletedLocation) return res.status(404).json({ message: "Location not found" });

    res.status(200).json({ message: "Location deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Locations for a User
exports.getLocationsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const locations = await Location.find({ userId });
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One Location by ID
exports.getLocationById = async (req, res) => {
  const locationId = req.params.id;

  try {
    const location = await Location.findById(locationId);

    if (!location) return res.status(404).json({ message: "Location not found" });

    res.status(200).json({ location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};