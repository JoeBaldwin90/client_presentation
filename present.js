// Elements
const nextSlide = document.querySelector("a.next");
const prevSlide = document.querySelector("a.previous");
const sliderDiv = document.querySelector("div.slider");
const stepCounter = document.querySelector("span.steps");
const footer = document.querySelector("footer");
const loadingMessage = document.querySelector("header p.loading");

// API
const filesApi = "https://api.figma.com/v1/files/";
const imagesApi = "https://api.figma.com/v1/images/";
const projectKey = "LaGLDWRHVLWMMryCCFcCfe"; // Figma Project ID
const apiKey = "19110-d2b5a588-0210-468a-9c42-c2335bca6e21";
const apiHeaders = {
  method: "GET",
  headers: {
    "X-Figma-Token": apiKey,
  },
};

let currentSlide = 0;
let totalSlides = 0;

// When page loads
// 1. Load the file from figma & organise by IDs
// 2. Then use the array of IDs to generate image URLs
// 3. Then add images to the site

const loadFile = (projectKey) => {
  return fetch(filesApi + projectKey, apiHeaders)
    .then((response) => response.json())
    .then((data) => {
      // Get the frame IDs from the project
      const ids = data.document.children[2].children.map((frame) => {
        return frame.id;
      });
      // Get the frame names from the project
      const names = data.document.children[2].children.map((frame) => {
        return frame.name;
      });
      // Return a new object
      return {
        key: projectKey,
        title: data.name,
        names: names,
        ids: ids,
      };
    });
};

const loadImages = (projectData) => {
  const projectKey = projectData.key; // Project key
  const ids = projectData.ids.join(","); // Separate array items with comma for endpoint query

  return fetch(imagesApi + projectKey + "?ids=" + ids + "&scale=1", apiHeaders)
    .then((response) => response.json())
    .then((data) => {
      return projectData.ids.map((id) => {
        // Return image URLs for each frame based on the ID from loadFile
        return data.images[id];
      });
    });
};

const addImagesToSite = (urls) => {
  sliderDiv.innerHTML = "";
  totalSlides = urls.length;
  stepCounter.innerHTML = `1 / ${totalSlides}`;
  footer.classList.add("show");

  // Add urls from loadImages into an image tag to display on the screen
  urls.forEach((url) => {
    sliderDiv.innerHTML =
      sliderDiv.innerHTML +
      `
      <div>
        <img src="${url}" alt="Client Preview">
      </div>
    `;
  });
};

loadFile(projectKey)
  .then((projectData) => {
    loadingMessage.innerHTML = projectData.title;
    document.title = `${projectData.title} - Client Presentation`;
    return projectData; // Unchanged
  })
  .then((projectData) => loadImages(projectData)) // Handle image URLs from API data
  .then((imageUrls) => addImagesToSite(imageUrls)); // Add each item in image URL array to site

// Slideshow events
const next = () => {
  currentSlide = currentSlide + 1;
  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }
  moveSlider();
};

const previous = () => {
  currentSlide = currentSlide - 1;
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }
  moveSlider();
};

const moveSlider = () => {
  sliderDiv.style.transform = `translateX(${currentSlide * -100}vw)`;
  stepCounter.innerHTML = `${currentSlide + 1} / ${totalSlides}`;
};

nextSlide.addEventListener("click", () => {
  next();
});

prevSlide.addEventListener("click", () => {
  previous();
});
