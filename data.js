// Project data structure
const folderStructure = [
  {
    name: "AI Experiments",
    files: [
      { name: "Github Resume Maker", path: "./ai-experiments/github-profile", models: ["Claude 3.5", "GPT-4"], date: "2025-01-15" },
      { name: "Interactive Periodic Table", path: "./ai-experiments/periodic-table-claude-3.7", models: ["Claude 3.7"], date: "2025-02-10" },
      { name: "Time Tracker Pro", path: "./ai-experiments/time-tracker-pro", models: ["Claude 3.5"], date: "2025-01-25" },
      { name: "Book Nook", path: "./ai-experiments/book-nook", models: ["GPT-4", "Claude 3.5"], date: "2025-02-05" },
      { name: "AI Models Browser", path: "./ai-experiments/ai-models", models: ["Claude 3.7", "GPT-4"], date: "2025-02-20" },
      { name: "LLMs, An Interactive Guide", path: "./ai-experiments/llms-interactive-guide", models: ["Claude 3.7"], date: "2025-03-01" },
      { name: "TV Satellite Tracker", path: "./ai-experiments/satellite-tracker", models: ["Claude 3.5"], date: "2025-03-05" },
      { name: "AI Integration Profit Loss Calculator", path: "./ai-experiments/ai-integration-profit-loss-calculator", models: ["GPT-4", "Claude 3.5"], date: "2025-03-10" },
      { name: "Iran Railway History", path: "./ai-experiments/iran-railway-history", models: ["Claude 3.7"], date: "2025-03-15" },
      { name: "Interactive World Map", path: "./ai-experiments/world-map", models: ["Claude 3.7", "GPT-4"], date: "2025-03-20" },
      { name: "Visual Story Barnaby", path: "./ai-experiments/visual-story-barnaby", models: ["Gemini 2.0", "Claude 3.7"], date: "2025-03-25" },
      { name: "Top 100 Scientists", path: "./ai-experiments/top-100-scientists", models: ["Claude 3.7"], date: "2025-03-25" },
      { name: "Plan Designer Pro", path: "./ai-experiments/plan-designer-pro", models: ["Claude 3.7"], date: "2025-03-26" },
      { name: "Flow Efficiency Dashboard", path: "./ai-experiments/flow-efficiency-dashboard", models: ["Claude 3.7"], date: "2025-03-26" },
      { name: 'Iranian Sangak Bakery AI Art', path: "./ai-experiments/image-viewer/?img=iranian-sangak-bakery-llm-prompt", models: ["ChatGPT 4o"], date: "2025-03-29", type: "image", image_name: "iranian-sangak-bakery-llm-prompt" },
    ]
  }
];

// Flatten the structure for easier use in Vue
const projects = folderStructure.reduce((acc, folder) => {
  return [...acc, ...folder.files];
}, []).map(file => {
  if (file.type == 'image') {
    file.image = file.type != 'image' ? `${file.path}/image.png` : `./ai-experiments/image-viewer/assets/${file.image_name}.png`;
    file.display_path = file.image_name;
  } else {
    file.image = `${file.path}/image.png`;
    file.display_path = file.path.split('/').pop();
  }
  return file;
});