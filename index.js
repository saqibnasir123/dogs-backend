/*const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = './model/dogs.json';

app.use(cors());
app.use(express.json());

// Utility functions
const loadDogs = () => fs.readJson(DATA_FILE);
const saveDogs = (data) => fs.writeJson(DATA_FILE, data);

// GET all breeds and sub-breeds
app.get('/api/breeds', async (req, res) => {
  const breeds = await loadDogs();
  res.json(breeds);
});

// POST a new breed (with optional sub-breeds)
app.post('/api/breeds', async (req, res) => {
  const { breed, subBreeds = [] } = req.body;
  if (!breed) return res.status(400).json({ error: 'Breed name is required' });

  const breeds = await loadDogs();

  if (breeds[breed]) return res.status(400).json({ error: 'Breed already exists' });

  breeds[breed] = subBreeds;
  await saveDogs(breeds);
  res.status(201).json({ breed, subBreeds });
});

// POST a new sub-breed to an existing breed
app.post('/api/breeds/:breed', async (req, res) => {
  const { subBreed } = req.body;
  const { breed } = req.params;

  const breeds = await loadDogs();

  if (!breeds[breed]) return res.status(404).json({ error: 'Breed not found' });

  if (breeds[breed].includes(subBreed))
    return res.status(400).json({ error: 'Sub-breed already exists' });

  breeds[breed].push(subBreed);
  await saveDogs(breeds);
  res.status(201).json({ breed, subBreeds: breeds[breed] });
});

// PUT rename breed
app.put('/api/breeds/:breed', async (req, res) => {
  const { newName } = req.body;
  const { breed } = req.params;

  const breeds = await loadDogs();

  if (!breeds[breed]) return res.status(404).json({ error: 'Breed not found' });

  if (breeds[newName]) return res.status(400).json({ error: 'New breed name already exists' });

  breeds[newName] = breeds[breed];
  delete breeds[breed];

  await saveDogs(breeds);
  res.json({ oldName: breed, newName });
});

// PUT rename sub-breed
app.put('/api/breeds/:breed/:subbreed', async (req, res) => {
  const { newName } = req.body;
  const { breed, subbreed } = req.params;

  const breeds = await loadDogs();

  if (!breeds[breed]) return res.status(404).json({ error: 'Breed not found' });

  const index = breeds[breed].indexOf(subbreed);
  if (index === -1) return res.status(404).json({ error: 'Sub-breed not found' });

  if (breeds[breed].includes(newName))
    return res.status(400).json({ error: 'New sub-breed name already exists' });

  breeds[breed][index] = newName;
  await saveDogs(breeds);
  res.json({ breed, oldSubBreed: subbreed, newSubBreed: newName });
});

// DELETE breed
app.delete('/api/breeds/:breed', async (req, res) => {
  const { breed } = req.params;
  const breeds = await loadDogs();

  if (!breeds[breed]) return res.status(404).json({ error: 'Breed not found' });

  delete breeds[breed];
  await saveDogs(breeds);
  res.status(204).send();
});

// DELETE sub-breed
app.delete('/api/breeds/:breed/:subbreed', async (req, res) => {
  const { breed, subbreed } = req.params;
  const breeds = await loadDogs();

  if (!breeds[breed]) return res.status(404).json({ error: 'Breed not found' });

  breeds[breed] = breeds[breed].filter(sb => sb !== subbreed);
  await saveDogs(breeds);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
*/






const express = require('express');
const cors = require('cors'); 
const fs = require('fs-extra');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'model', 'dogs.json');

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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});