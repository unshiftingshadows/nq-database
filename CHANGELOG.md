# Changelog
All notable changes for this project will be documented in this file.

## 0.0.29 - 2018-04-12
Adding Bible translations!!

### Added
- bible-passage-reference-parser for parsing references (to be adopted on the client-side eventually as well)
- Digital Bible Platform API connection for NASB, NIV, NKJV, KJV, ASV, WEB
- bibliaapi.com API for LEB
- labs.bible.org for NET
- api.nlt.to for NLT (unfinished...need to remove extra HTML from the response)

## 0.0.28 - 2018-04-11
### Added
- builder images uploaded now can be added

### Changed
- builder search now is more efficient and properly adds type properties when all media is being returned
- builder view route for other media returns an object with a resource property to match data that would come from NQ
- Other Quotes now have a mediaid section to contain title and author to match what comes from NQ

## 0.0.27 - 2018-04-10
### Added
- Scratch item for other curriculum
- some functions and declarations in add route to fix issues adding new omedia

### Changed
- list route uses singular types rather than plural
- medium is now not required for Lyric
- mediaType is now not required for Quote

### Fixed
- view returns proper content when non-NQ user is accessing

## 0.0.26 - 2018-04-09
### Added
- search now returns other media for builder users without an nq account by searching for specific search terms across the tags, title, and text fields

### Changed
- removed unused code in resources route
- fixed nqUser check in view route
- list route now uses the correct format of types for other media
- Lyric uses 'medium' instead of 'type' to denote either song or poem

## 0.0.25 - 2018-04-08
### Added
- models for media for users that do not use Notes and Quotes
- updated add, view, update, and list routes to include the new models
- Sermon model
- updated add, view, update, and list routes to include Sermon model

## 0.0.24 - 2018-04-07
### Changed
- Illustration added to the list of mediaTypes

## 0.0.23 - 2018-04-07
### Changed
- discourse model now has a users property instead of a single user -- author is not required, but has an empty array as default
- event name and allTags were also added to discourse
- update route now prints error logs to the console

## 0.0.22 - 2018-04-06
### Changed
- discourse model now has a url field

## 0.0.21 - 2018-04-06
### Added
- view route can now return all NQ resources
- update route for updating objects

## 0.0.20 - 2018-04-06
### Added
- research route for builder to add/remove research from OLessons (eventually RLessons as well)
- remove route (blank shell - for use later)

## 0.0.19 - 2018-04-05
### Added
- resources route for builder to pull all resources connected to an olesson

### Changed
- search and list routes to send back Topics
- search for Topics now uses fuse.js

## 0.0.18 - 2018-04-04
### Changed
- adding an olesson now also initializes it in Firebase db
- updated Lesson model to reflect upcoming module system

## 0.0.17 - 2018-04-02
### Added
- Illustration snippet

### Changed
- updated add, list, resources, snippets, and update to use Illustration
- Composition can now store a url

## 0.0.16 - 2018-03-27
### Changed
- update now works properly when userData is submitted
- Article attempts to set a placeholder url as the default thumbURL value

## 0.0.15 - 2018-03-27
### Added
- Composition model

### Changed
- add, list, resources, update, and view routes now accept the new media types: Document, Discourse, and Composition

## 0.0.14 - 2018-03-23
### Added
- added all REAL Builder models and routes
- added REAL Builder firebase connection

### Changed
- edited file structure to accomodate for two systems (builder and nq)

### Notes
- big changes...but everything should work now
- needed in order to access NQ media from within the Builder without lots of duplicate code

## 0.0.13 - 2018-03-23
### Changed
- added topic as type to update in update route

## 0.0.12 - 2018-03-20
### Changed
- added chapter, chapterRange, and book to the types of bibleRefs

## 0.0.11 - 2018-03-15
### Changed
- Outline.points is now just a String array
- add and update adds catches for certain errors
- snippets now has an 'all' option for returning all quotes, outlines, and ideas at once

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