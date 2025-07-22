const express = require('express');
const cors = require('cors'); 
const fs = require('fs-extra');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'model', 'dogs.json');
const filePath= path.join(__dirname,'model', 'login-credentials.json')

app.use(cors());
app.use(express.json());

// Utility functions using fs-extra
const loadDogs = async () => {
  
    await fs.ensureDir(path.dirname(DATA_FILE));
    const fileExists = await fs.pathExists(DATA_FILE);
    if (!fileExists) {

      await fs.writeJson(DATA_FILE, {});
      return {};
    }
    const data = await fs.readJson(DATA_FILE);
    return data;
  
};

const saveDogs = (data) => fs.writeJson(DATA_FILE, data, { spaces: 2 });

// --- Utility functions for login-credentials.json ---
// Load login credentials
const loadLoginCredentials = async () => {
  
    // Ensure the 'model' directory exists
    const data = await fs.readJson(filePath);
    return data;
   
};

// Save login credentials
const saveLoginCredentials = async (data) => {
    await fs.writeJson(filePath, data, { spaces: 2 });
  
};





// GET all breeds and sub-breeds
app.get('/api/breeds', async (req, res) => {
  try {
    const breeds = await loadDogs();
    res.json(breeds);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch breed data.' });
  }
});

// POST a new breed (with optional sub-breeds)
app.post('/api/breeds', async (req, res) => {
  const { breed, subBreeds = [] } = req.body;
  if (!breed) return res.status(400).json({ error: 'Breed name is required' });

  try {
    const breeds = await loadDogs();

    if (breeds[breed]) return res.status(400).json({ error: 'Breed already exists' });

    breeds[breed] = subBreeds;
    await saveDogs(breeds);
    res.status(201).json({ breed, subBreeds });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add breed data.' });
  }
});

// PUT update sub-breeds for a given breed (replaces existing sub-breeds)
// This endpoint handles adding, editing, or deleting sub-breeds by replacing the array.
app.put('/api/breeds/:breed/subbreeds', async (req, res) => {
  const { subBreeds } = req.body; // Expect an array of sub-breeds
  const { breed } = req.params;

  // Validate input
  if (!Array.isArray(subBreeds)) {
    return res.status(400).json({ error: 'Sub-breeds must be an array.' });
  }

  try {
    const breeds = await loadDogs();

    if (!breeds[breed]) return res.status(404).json({ error: 'Breed not found.' });

    // Replace the existing sub-breeds with the new array
    breeds[breed] = subBreeds;
    await saveDogs(breeds);
    res.json({ breed, updatedSubBreeds: subBreeds });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update sub-breeds.' });
  }
});

// DELETE breed
app.delete('/api/breeds/:breed', async (req, res) => {
  const { breed } = req.params;
  try {
    const breeds = await loadDogs();

    if (!breeds[breed]) return res.status(404).json({ error: 'Breed not found.' });

    delete breeds[breed];
    await saveDogs(breeds);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete breed.' });
  }
});

// POST Login Endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    let userData = await loadLoginCredentials();

    if (userData.email === email && userData.password === password) {
      
      userData.isLoggedIn = true;
      await saveLoginCredentials(userData);

      return res.status(200).json({ message: 'Login successful!', isLoggedIn: true });
    } else {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error during login.' });
  }
});

// POST Logout Endpoint
app.post('/api/logout', async (req, res) => {
  try {
    let userData = await loadLoginCredentials();
    userData.isLoggedIn = false;
    await saveLoginCredentials(userData);

    return res.status(200).json({ message: 'Logout successful!', isLoggedIn: false });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error during logout.' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});