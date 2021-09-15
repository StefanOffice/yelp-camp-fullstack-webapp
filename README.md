# Welcome to YelpCamp! :)

## Info
This project features a web-app built using Node.js, express, mongoDB, mongoose, and numerous npm packages. Some of the implemented features include
full crud, authentication, authorization, image upload, geolocation, ratings and reviews...

## Features
### Full CRUD operations
The app demonstrates communication with NoSQL database(mongoDB) using mongoose.  
Users can Create, Read, Update and Delete campgrounds and reviews ( restricted to only the ones that they themselves have created)   
Any logged-in user can create a new campground, and edit any campground they have created before.
### Ratings
Users can leave a review with a 1-5 rating on any campground, which will be displayed on the camp details page.
### Authentication 
The app implements full authentication and session management allowing users to register an account and see features only logged in users can see(such as creating or editing a campground)
### Image upload
App communicates with cloud database as well as with image hosting service called cloudinary, allowing users to upload and delete their own images.
### Map Integration
Fully implemented geolocation using geoJSON, to generate latitude and longitute based on user input and use it to set the correct map display on details page.   
Two types of maps are featured.
+ cluster map on the index page showing all campgrounds with links to their details page.
+ campground location map, on the details page, showing the location as a pin


## See it in action
App is currently deployed, live.  
Click [here](https://nameless-castle-03307.herokuapp.com/) to check it out

## Thank you!
Thank you for checking out my project. :smile:

*All the best,*  
***Stefan Stefanovic***
