const loadingTag = document.querySelector("header p.loading")// Loading message
const filesApi = "https://api.figma.com/v1/files/"          // Files endpoint
const imagesApi = "https://api.figma.com/v1/images/"        // Images endpoint
const project = "Rc9MpQo5whSUaAJV8ifwW6KU"                  // Figma project ID
const apiKey = "19110-d2b5a588-0210-468a-9c42-c2335bca6e21" // Figma API key
const apiHeaders = {                                        // Headers for auth
  method: "GET",
  headers: {
    "X-Figma-Token": apiKey
  }
}

// When page loads
// 1. Load the file from figma & organise by IDs
// 2. Then use the array of IDs to generate image URLs
// 3. Then add images to the site

const loadFile = function(key) {
  return fetch(filesApi + key, apiHeaders)
    .then(response => response.json())
    .then(data => {
      // Get the frame IDs from the project
      const ids = data.document.children[0].children.map(frame => {
        return frame.id
      })
      // Return a new object
      return {
        key: key,
        title: data.name,
        ids: ids  // This value is an array of frame IDs returned by map
      }
    })
}

const loadImages = function(object) {
  const key = object.key           // Project key
  const ids = object.ids.join(",") // Seperate array items with comma for endpoint query

  return fetch(imagesApi + key + "?ids=" + ids + "&scale=0.75", apiHeaders)
    .then(response => response.json())
    .then(data => {
      return object.ids.map(id => {
        // Return image URLs for each frame based on the ID from loadFile
        return data.images[id]
      })
    })
}

const addImagesToSite = function(urls) {
  const sectionTag = document.querySelector("section")
  sectionTag.innerHTML = ""

  // Add urls from loadImages into an image tag to display on the screen
  urls.forEach(url => {
    sectionTag.innerHTML = sectionTag.innerHTML + `
      <div>
        <img src="${url}">
      </div>
    `
  })
}

loadFile(project)                                // Load files from chosen project, return a new object
  .then(file => {                                // Change loading message
      loadingTag.innerHTML = file.title
    return file                                  // Data is unchanged
  })
  .then(file => loadImages(file))                // Handle image URLs from API data
  .then(imageUrls => addImagesToSite(imageUrls)) // Add each item in image URL array to site
