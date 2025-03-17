# The Morning Paper

Created by Mario and Azim.

## 🚀 Mission statement

Our application, The Morning Paper is for anyone. It allows users to browse through morning news, check the weather in their city or any other city in the world, and play a mini game.

## API & React Router

This application will use the  API. Below are the documentation and specific endpoints we intend to use and the front-end pages that will use them.
- Link to API documentation:
- https://weather.algobook.info/forecast/London
  - This will fetch two objects in the array, city object with the city information, and forcast with the 10 day forecast. 
  - For each city, I want the city `name`, `formattedDay`, `minTempFarenheit`, `maxTempFarenheit`, and `forecastText`

- https://saurav.tech/NewsAPI/
  - This will fetch three objects in the api the title of the news article, its URL, and the catagories the article fits into
  - Each catagory will be kept to specify the articles they are `business`, `entertainment`, `general`, `health`, `science`, `sports`, `technology`
    
- https://random-word-api.herokuapp.com/home
  - This will fetch one object witch is a random word generator 
  - Each word fetched would have to follow the `length` we wish from it

[If your API requires an API key, say so here.]

**Example:**
- https://api.artic.edu/api/v1/artworks
  - This will fetch an array of artwork objects
  - For each artwork, I want the `id`, `title`, and `image_id`
- https://api.artic.edu/api/v1/artworks/{id}
  - This will fetch a single artwork object
  - I will use the `id`, `title`, `short_description`, `medium_display`, `place_of_origin` and `image_id`
- https://api.artic.edu/api/v1/artworks/search?q={query}
  - This will fetch a list of artworks that relate to the search query
  - For each artwork, I will use the `id` and `title`

## 👩‍💻 MVP User Stories & Frontend Routes

The application will feature the following frontend routes and core features:

* On the `/home` page, users can open a news article URL wich will send them to that article's source
* On the `/home` page, users can check the weather of a specific location they wish
* On the `/wordle` page, users can play a mini game

**Example:**
- On the `/artworks` page, users can view a grid of all artwork
- On the `/artworks` page, users can click on a piece of art in the grid, taking them to the details page for that piece of art.
- On the `/artworks/:artworkId` page, users can view additional details for a single piece of art
- On the `/` page, users can search for artwork titles related to a search term.

## 🤔 Stretch User Stories

If time permits, the following stretch features will be implemented in order of priority:

* Users will be able to sort each news article via catagory
* Users will be able to save the cities to have quick access to them on the weather portion
* Users will be able to change the difficulty of the mini game

**Example:**
* Users will be able to save and view favorited artworks using local storage
* Users will be able to change the color scheme of the website from light mode to dark mode

## 📆 Timeline for reaching MVP in 1 week

To ensure that we can complete all core features of the application in 1 week, we will aim to complete tasks according to the following timeline:

ROUGH TIMELINE BOUND TO BE CHANGED

**Day 1**
- [ ] Create file structures/components
- [ ] Impliment Fetches
- [ ] Begin creating the framework / baseline

**Day 2**
- [ ] Render fetches on the mian page
- [ ] at least 1 / 3 base functions be complete (`news`, `weather`, `mini game`)
- [ ] Creating the style of the site

**Day 3** (MVP due by the end of the day)
- [ ] Finish all the base functionality
- [ ] 
- [ ] 

**Day 4**
- [ ] Sart styling main page
- [ ] Apply styles to weather app and wordle
- [ ] 

**Day 5**
- [ ] 
- [ ] Seeing if stretch goals can be completed
- [ ] Finishing touches for style

## Wireframes of each page in your application

Below, you can find wireframes for our project. Each wireframe shows a different page of our application as well as the key components of the application. Details such as specific text values or images are intentionally not included:

[Wireframe for page 1]

<img width="826" alt="Screenshot 2025-03-17 at 11 25 05 AM" src="https://github.com/user-attachments/assets/b04843b0-229e-476c-88e5-70b218b62fba" />



[Wireframe for page 2]
