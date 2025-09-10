import React, { useState } from 'react';

const FishBreedFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFish, setSelectedFish] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fish database
  const fishData = {
    "goldfish": {
      name: "Goldfish",
      image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
      description: "Goldfish are one of the most popular aquarium fish. They're hardy, easy to care for, and come in various colors and sizes. Originally from East Asia, they can live for decades with proper care."
    },
    "betta": {
      name: "Betta Fish",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=400&h=300&fit=crop",
      description: "Also known as Siamese fighting fish, bettas are known for their vibrant colors and flowing fins. Males are territorial and should be kept alone, while females can sometimes be kept together."
    },
    "guppy": {
      name: "Guppy",
      image: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&h=300&fit=crop",
      description: "Guppies are small, colorful freshwater fish that are perfect for beginners. They're livebearers, meaning they give birth to live young rather than laying eggs."
    },
    "angelfish": {
      name: "Angelfish",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
      description: "Angelfish are elegant freshwater fish with distinctive triangular shapes. They're relatively peaceful but can be territorial during breeding. They prefer taller aquariums."
    },
    "neon tetra": {
      name: "Neon Tetra",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=400&h=300&fit=crop",
      description: "Neon tetras are small, brightly colored schooling fish with distinctive blue and red stripes. They're peaceful and do best in groups of 6 or more."
    },
    "clownfish": {
      name: "Clownfish",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
      description: "Clownfish are marine fish famous for their symbiotic relationship with sea anemones. They're hardy saltwater fish that are popular in reef aquariums."
    },
    "oscar": {
      name: "Oscar Fish",
      image: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&h=300&fit=crop",
      description: "Oscars are large, intelligent cichlids from South America. They can recognize their owners and have distinct personalities. They require large tanks and are known for rearranging decorations."
    },
    "discus": {
      name: "Discus Fish",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=400&h=300&fit=crop",
      description: "Discus are considered the 'king of aquarium fish' due to their stunning round shape and vibrant colors. They're more challenging to keep and require specific water conditions."
    },
    "molly": {
      name: "Molly Fish",
      image: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&h=300&fit=crop",
      description: "Mollies are peaceful, hardy fish that come in various colors and patterns. They're livebearers and can adapt to both freshwater and slightly brackish conditions."
    },
    "platy": {
      name: "Platy Fish",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop",
      description: "Platies are small, colorful freshwater fish that are easy to care for. They're peaceful community fish and come in many different color varieties."
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      const filtered = Object.keys(fishData).filter(key =>
        key.includes(value.toLowerCase()) || 
        fishData[key].name.toLowerCase().includes(value.toLowerCase())
      ).map(key => fishData[key]);
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    searchFish();
  };

  // Search for fish
  const searchFish = () => {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      setSelectedFish(null);
      return;
    }

    // Try exact match first
    let foundFish = fishData[term];
    
    // If no exact match, try partial match
    if (!foundFish) {
      const key = Object.keys(fishData).find(k =>
        k.includes(term) || fishData[k].name.toLowerCase().includes(term)
      );
      foundFish = key ? fishData[key] : null;
    }

    setSelectedFish(foundFish);
    setShowSuggestions(false);
  };

  // Handle suggestion selection
  const selectSuggestion = (fish) => {
    setSearchTerm(fish.name);
    setSelectedFish(fish);
    setShowSuggestions(false);
  };

  // Handle random fish selection
  const getRandomFish = () => {
    const fishKeys = Object.keys(fishData);
    const randomKey = fishKeys[Math.floor(Math.random() * fishKeys.length)];
    const randomFish = fishData[randomKey];
    
    setSearchTerm(randomFish.name);
    setSelectedFish(randomFish);
    setShowSuggestions(false);
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIyMCAxMDAgMjQwIDEyMCAyNDAgMTQwQzI0MCAx2MCAyMjAgMTgwIDIwMCAxODBDMTgwIDE4MCAxNjAgMTYwIDE2MmQt0MEN2NjAgMTIwIDE4MnExMDAgMjAwIDEwMFoiIGZpbGw9IiM5Q0E5QjAiLz4KICA8Y2lyY2xlIGN4PSIxODUiIGN5PSIxMjUiIHI9IjMiIGZpbGw9IiM2QjczODAiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZCNzM4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPkZpc2ggSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
  };

  return (
    <div className="fish-finder-container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px'
      }}>
        🐠 Fish Breed Finder
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter fish name (e.g., goldfish, betta, guppy...)"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #3498db',
              borderRadius: '8px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {suggestions.map((fish, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(fish)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {fish.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Search Fish
          </button>
          
          <button
            type="button"
            onClick={getRandomFish}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Random Fish
          </button>
        </div>
      </form>

      {/* Results */}
      {selectedFish ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            gap: '20px',
            alignItems: 'flex-start'
          }}>
            <img
              src={selectedFish.image}
              alt={selectedFish.name}
              onError={handleImageError}
              style={{
                width: window.innerWidth < 768 ? '100%' : '300px',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '8px',
                flexShrink: 0
              }}
            />
            
            <div style={{ flex: 1 }}>
              <h2 style={{
                color: '#2c3e50',
                marginBottom: '15px',
                fontSize: '24px'
              }}>
                {selectedFish.name}
              </h2>
              
              <p style={{
                color: '#555',
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                {selectedFish.description}
              </p>
            </div>
          </div>
        </div>
      ) : searchTerm && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          color: '#6c757d'
        }}>
          <h3>Fish not found</h3>
          <p>Sorry, we couldn't find "{searchTerm}" in our database.</p>
          <p>Try searching for: goldfish, betta, guppy, angelfish, neon tetra, clownfish, oscar, discus, molly, or platy</p>
        </div>
      )}

      {!selectedFish && !searchTerm && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          color: '#6c757d'
        }}>
          <h3>Welcome to Fish Breed Finder!</h3>
          <p>Enter a fish name in the search box above to learn more about different fish breeds.</p>
          <p>Available fish: Goldfish, Betta, Guppy, Angelfish, Neon Tetra, Clownfish, Oscar, Discus, Molly, Platy</p>
        </div>
      )}
    </div>
  );
};

export default FishBreedFinder;

