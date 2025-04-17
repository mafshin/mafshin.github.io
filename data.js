// Project data structure
const folderStructure = [
  {
    name: "AI Experiments",
    files: [
      { name: "Github Resume Maker", path: "./ai-experiments/github-profile", models: ["Claude 3.5", "GPT-4"], type: 'WebApp', date: "2025-01-15" },
      { name: "Interactive Periodic Table", path: "./ai-experiments/periodic-table-claude-3.7", models: ["Claude 3.7"], type: 'WebApp',date: "2025-02-10" },
      { name: "Time Tracker Pro", path: "./ai-experiments/time-tracker-pro", models: ["Claude 3.5"], type: 'WebApp',date: "2025-01-25" },
      { name: "Book Nook", path: "./ai-experiments/book-nook", models: ["GPT-4", "Claude 3.5"], type: 'WebApp',date: "2025-02-05" },
      { name: "AI Models Browser", path: "./ai-experiments/ai-models", models: ["Claude 3.7", "GPT-4"], type: 'WebApp',date: "2025-02-20" },
      { name: "LLMs, An Interactive Guide", path: "./ai-experiments/llms-interactive-guide", models: ["Claude 3.7"], type: 'WebApp',date: "2025-03-01" },
      { name: "TV Satellite Tracker", path: "./ai-experiments/satellite-tracker", models: ["Claude 3.5"], type: 'WebApp',date: "2025-03-05" },
      { name: "AI Integration Profit Loss Calculator", path: "./ai-experiments/ai-integration-profit-loss-calculator", models: ["GPT-4", "Claude 3.5"], type: 'WebApp',date: "2025-03-10" },
      { name: "Iran Railway History", path: "./ai-experiments/iran-railway-history", models: ["Claude 3.7"], type: 'WebApp',date: "2025-03-15" },
      { name: "Interactive World Map", path: "./ai-experiments/world-map", models: ["Claude 3.7", "GPT-4"], type: 'WebApp',date: "2025-03-20" },
      { name: "Visual Story Barnaby", path: "./ai-experiments/visual-story-barnaby", models: ["Gemini 2.0", "Claude 3.7"], type: 'WebApp', date: "2025-03-25" },
      { name: "Top 100 Scientists", path: "./ai-experiments/top-100-scientists", models: ["Claude 3.7"], type: 'WebApp', date: "2025-03-25" },
      { name: "Plan Designer Pro", path: "./ai-experiments/plan-designer-pro", models: ["Claude 3.7"], type: 'WebApp', date: "2025-03-26" },
      { name: "Flow Efficiency Dashboard", path: "./ai-experiments/flow-efficiency-dashboard", models: ["Claude 3.7"], type: 'WebApp', date: "2025-03-26" },
      { name: 'Iranian Sangak Bakery AI Art', path: "./ai-experiments/image-viewer/?img=iranian-sangak-bakery-llm-prompt", models: ["ChatGPT 4o"], date: "2025-03-29", type: "Image", image_name: "iranian-sangak-bakery-llm-prompt" },
      { name: 'Chess in 2035', path: "./ai-experiments/image-viewer/?img=chess-agi-2035", models: ["ChatGPT 4o"], date: "2025-03-30", type: "Image", image_name: "chess-agi-2035" },
      { name: 'Mohsen\'s Agent Bakery', path: "./ai-experiments/image-viewer/?img=mohsen-agent-bakery", models: ["ChatGPT 4o"], date: "2025-03-30", type: "Image", image_name: "mohsen-agent-bakery" },
      { name: 'Wooden Leg - Metal Hand', path: "./ai-experiments/image-viewer/?img=wooden-leg-metal-hand", models: ["ChatGPT 4o"], date: "2025-04-01", type: "Image", image_name: "wooden-leg-metal-hand" },
      { name: 'Particle Generator with Mirrors', path: "./ai-experiments/particle-generator-with-mirrors", models: ["Gemini 2.5 Pro"], type: 'WebApp', date: "2025-04-02", },
      { name: 'Self Reflection in Mirrors', path: "./ai-experiments/image-viewer/?img=self-reflection-in-mirrors", models: ["ChatGPT 4o"], type: 'Image', date: "2025-04-01", image_name: "self-reflection-in-mirrors", image_count: 2 },
      { name: 'Balance Selfie', path: "./ai-experiments/image-viewer/?img=balance-selfie", models: ["ChatGPT 4o"], type: 'Image', date: "2025-04-02", image_name: "balance-selfie" },
      { name: 'Creative Transformation Explosion', path: './ai-experiments/image-viewer/?img=creative-transformation-explosion', models: ["ChatGPT 4o"], type: 'Image', date: "2025-04-03", image_name: "creative-transformation-explosion", image_count: 3 },
      { name: 'Rain Droplet Earth View', path: './ai-experiments/image-viewer/?img=rain-droplet-earth-view', models: ["ChatGPT 4o"], type: 'Image', date: "2025-04-04", image_name: "rain-droplet-earth-view", image_count: 4 },
      { name: 'Mind Orchestra', path: './ai-experiments/image-viewer/?img=mind-orchestra', models: ["ChatGPT 4o"], type: 'Image', date: "2025-04-07", image_name: "mind-orchestra"},
      { name: 'Sabzak and Narang’s Magical Jungle Ride', path: './ai-experiments/visual-story', models: ["ChatGPT 4o"], type: "WebApp", date: "2025-04-15"},
      { name: 'Mona Lisa in Pablo Picasso Style', path: './ai-experiments/image-viewer/?img=mona-lisa-pablo-picasso', models: ["ChatGPT o4-mini-high"], type: 'Image', date: "2025-04-17", image_name: "mona-lisa-pablo-picasso"}
    ]
  }
];

// Flatten the structure for easier use in Vue
const projects = folderStructure.reduce((acc, folder) => {
  return [...acc, ...folder.files];
}, []).map(file => {
  if (file.type == 'Image') {
    file.image = file.type != 'Image' ? `${file.path}/image.png` : `./ai-experiments/image-viewer/assets/${file.image_name}.png`;
    file.display_path = file.image_name;
  } else {
    file.image = `${file.path}/image.png`;
    file.display_path = file.path.split('/').pop();
  }
  return file;
}).sort((a, b) => new Date(b.date) - new Date(a.date));