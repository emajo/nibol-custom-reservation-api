# Change Log

## [1.0.1] - 2022-04-24
  
Here we would have the update steps for 1.2.4 for people to follow.
 
### Added

- **GET /user** new endpoint for getting user info.
 
### Changed
  
- **GET /colleagues**: now accepts an array of dates (**days** query param) and returns all the colleagues in the office simultaneously (space=**all** query param) excluding the signed in user.

- **GET /reservations**: now requires a start and end date (**start** & **end** query params) and returns only the reservations in the specified range.
 
### Fixed
 
- **NOTHING**: everything was on point even on version 1.0.0 but the lazy and incompetent FE developer requested changes like he is my boss (which he is not).