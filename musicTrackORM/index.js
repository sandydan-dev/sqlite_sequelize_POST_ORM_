const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const { sequelize } = require("./lib/index");
const musicTrack = require("./models/musicTrack.model");
const musicTrackDatabase = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];

// middleware
app.use(express.json());
app.use(cors());

// seed the data to db
// endpoint : http://localhost:3000/seed_music_db
app.get("/seed_music_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await musicTrack.bulkCreate(musicTrackDatabase);
    res.status(200).send("Music data seeded successfully!");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all music tracks
async function fetchAllMusicTrackDetails() {
  let query = await musicTrack.findAll();
  if (!query) {
    return null;
  } else {
    return { music_tracks: query };
  }
}
app.get("/music_track", async (req, res) => {
  try {
    let result = await fetchAllMusicTrackDetails();

    if (!result) {
      return res.status(404).json({ message: "No music tracks found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// post new data into database
async function addNewTrackDetails(newTrack) {
  let query = await musicTrack.create(newTrack);
  if (!query) {
    return null;
  } else {
    return { newTrack: query };
  }
}
app.post("/music_track/new", async (req, res) => {
  try {
    let newTrack = req.body.newTrack;
    let result = await addNewTrackDetails(newTrack);
    if (!result) {
      return res.status(400).json({ message: "Failed to add new track" });
    } else {
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete track
async function deleteMusicTrackFromDB(id) {
  let query = await musicTrack.destroy({ where: { id: id } });
  if (!query) {
    return null;
  } else {
    return { musictracks: query };
  }
}
app.post("/music_track/delete", async (req, res) => {
  try {
    let id = req.body.id;
    let result = await deleteMusicTrackFromDB(id);
    if (result.musictracks.length === 0) {
      return res.status(404).json({ message: "No track found with this id" });
    } else {
      return res
        .status(200)
        .json({ message: "Track deleted successfully", deletedTrack: result });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update music track from db
async function updateMusicTrackDetails(id, updatedBody) {
  let query = await musicTrack.findOne({ where: { id } });

  if (!query) {
    return null;
  } else {
    query.set(updatedBody);
    let response = await query.save();
    return response;
  }
}
app.post("/music_track/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let updatedBody = req.body;

    let result = await updateMusicTrackDetails(id, updatedBody);

    if (!result) {
      return res.status(404).json({ message: " music track not found by id" });
    } else {
      return res.status(200).json({
        message: "Music track updated successfully",
        updatedTrack: result,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delte music track by id
async function deleteMusicTrackFromDB(id) {
  let query = await musicTrack.destroy({ where: { id } });

  if (query === 0) {
    return null;
  } else {
    return { query }; // return the deleted track
  }
}
app.post("/music_track/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let result = await deleteMusicTrackFromDB(id);

    if (!result.musictracks.length === 0) {
      return res.status(404).json({ message: "No track found with this id" });
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// listen incoming requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
