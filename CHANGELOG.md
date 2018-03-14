# Changelog
All notable changes for this project will be documented in this file.

## 0.0.10 - 2018-03-14
### Added
- functionality to add Movies
- functionality to lookup Movies

### Changed
- fixed incorrect lookup object in snippets to be plural

## 0.0.9 - 2018-03-13
### Added
- Discourse model
- Document model
- Idea model
- Outline model
- functionality to add Ideas and Outlines
- functionality to update Ideas and Outlines

### Changed
- removed extra commented code
- renamed 'quotes' route to 'snippets' to include ideas and outlines

## 0.0.8 - 2018-03-13
### Added
- api_cred file to store api keys

## 0.0.7 - 2018-03-13
### Added
- add functionality for Articles
- added Topic model
- Topic model stores any resource type and can be populated accordingly
- added resources route - returns all populated resources from a Topic

### Changed
- changed Article model to fit data from mercury.postlight
- list now sends Notes properly
- changed all models to lowercase for ease in populating
- changed Quote to allow populating on mediaid based on mediaType
- add to include Topic
- view to include Topic
- list to include Topic
- other minor changes to clean up add, view, and list
- add can now add resources to topics

## 0.0.6 - 2018-03-12
### Added
- beginning structure for all media adds
- add functionality for Books
- add functionality for wiki Images
- add functionality for Notes
- add functionality for Youtube and Vimeo Videos

### Changed
- moved all rating and status from media to UserData object
- updated Quotes to use ObjectId for mediaid
- view and update now uses UserData for rating and status
- list and view now do not distiguish between types of media (besides quotes)
- author field in all media changed to String array
- updated all media to not include _id -- allows MongoDB to self-assign

### Notes
- re-imported from Firebase to fix ids for Books and Quotes to use ObjectId type rather than String

## 0.0.5 - 2018-03-09
### Added
- lookup route

### Changed
- add functions now use callbacks instead of passing the res variable - reduces a bit of duplicate code

## 0.0.4 - 2018-03-08
### Added
- newQuote function for add route

### Changed
- removed _id as required for Quote model

### Notes
- need to find a better solution through promises for add route server response

## 0.0.3 - 2018-03-07
### Added
- quotes route for pulling quotes of a specific resource
- quotes only lists quotes with the uid of the user
- UserData model for keeping track of a user's added data
- update route for updating all media types, including quotes
- update route now works for all media types -- updates userData separate from resource data, so it requires two calls to update both
- add route for adding all media types, including quotes

### Changed
- list now checks for uid in users array to determine which resources to return -- returns only resources that include the user's uid
- view now returns the item as "resource" and user data as "userData" in an object
- nq_config now includes "quote" and "none" as mediaTypes

### Fixed
- changed toString virtual in Author to fullName to fix errors
- changed toString value in Image and Video schemas to match Author object keys
- changed name of schema and model in Article and Note as they were improperly labeled as 'Book'

## 0.0.2 - 2018-03-06
### Added
- Author schema
- Quote schema
- nq_config to keep type names, etc. consistent
- firebase to verify user is authenticated
- mock routes for future functionality
- Movie schema
- Image schema
- Video schema
- Article schema
- Note schema
- view route -- still in progress

### Changed
- list route now returns joined Authors in Books, Movies, Articles

### Migration
- added migrate.js file to help with migration from Firebase
- Books have been migrated
- Quotes have been migrated
- No Movies
- Articles, Image, Video, and Note are all negligible, so they will be migrated manually after add route has been added

## 0.0.1 - 2018-03-06
### Added
- file structure for creating models and routes
- changelog to keep track of future updates
- readme file
- Book schema

### Missing
- credentials file is left out of this git project to ensure security of database authentication