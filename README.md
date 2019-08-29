# Present
This application enables web designers to present a live version of a Figma project to clients in a slideshow format.

## Intention
Integrate with the Figma API and display all the images/content contained within the project frames.  

##### Timeframe
2 days

## Technologies
- HTML / CSS
- Javascript
- AJAX
- [Postman](https://www.getpostman.com/) (API development tool)

## Process
The bulk of the work for this project was in picking apart the Figma's API documentation and testing various endpoints with Postman to figure out how to pigeonhole the data that I wanted to display and manipulate it into a useable form.  

Once I'd figured out how to pull the data I wanted from the API and display the Figma slides correctly, I used event listeners to build a slideshow and make the app more interactive. I've borrowed some code from my previous project [Azureus](http://azureus.superhi.com/inspire.html) to do this.

## Challenges
Figma's API response is quite heavy and has lots of repeated object key names, so it look a while before I could understand where the information I needed was located (e.g. frame ID's). The documentation also seemed to miss a few things out, _viz_ exactly what the "key" parameter is was not explicitly mentioned in the docs.

Furthermore, when I was trying to find the image URLS for each frame using the project key I ran into this error:
`"err": "{\"params\":[\"file_key\"],\"query\":[\"ids\"]} are required."`
The API request only worked once I manually added the frame ID's to the endpoint `?ids=17:75,20:18`, which meant I had to find a way to dig out and store all of the frame ID's in the response.  

I achieved this by:
- Mapping a new array of node IDs into the object returned by `LoadFile()`: `data.document.children[0].children.map(frame => {
  return frame.id
})`
- Converting the array of ID's into a string joined with a comma.
- Manipulating the endpoint using the string of frame IDs.
- Accessing the frame image URLs based on their IDs: `data.images[id]`.
- For reference, the response looked like this: 
```
{
    "err": null,
    "images": {
        "17:75": "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/9f4f/cb6a/45391c297df3c8210443ef9b4b8dc1e2",
        "20:18": "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/2ccf/ca26/f2a76416e5ea71fc8a8aa9de1203ebb7"
    }
}
```

## Lessons learned
I didn't learn any new hard skills with this project, but I was challenged by the complexity of Figma's API responses and how I could manipulate it to present very simple bits of data. 

## Future development
- Display, then update/change the frame title when the user clicks the "Prev" and "Next" arrows.
- Add GET and POST comments for client/designer feedback by following Figma's [comments doucmentation](https://www.figma.com/developers/api#comments).
