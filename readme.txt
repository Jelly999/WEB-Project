Advanced web applications Project work - Code snippets

Installation guide:
    Download zip and extract it
    Goto extracted folder and npm install (presumed that npm is and node are installed already)
    Type 'npm start' and goto http://localhost:3000 to view the Webpage

Technology choices:
    I was most familiar with express and Pug so I decided to use those. Express was used in previus week task and this project could use some of those components with adjustments. 

    Wave: ...

Implemented features
Mandatory:
    Users can register and login and post new code snippets
    Code snippets can be viewed without loggin in
    Backend is done with node using express and pug is used to create views
    MongoDB is used for storing everything
    Authentication is done with JWT
    Webpage is viewable with desktop and mobile devices with responsive design

Additional points:
    Accessibility +3p
        I used Wave tool to fix any accessibility errors. With it I fixed labels, html lang attribute, page title and Aria landmarks to indicate where is the main content. Webpage is screenreadable and navigatable using keyboard.
    Cypress 10 tests +5p
        1. User can register
        2. Password must be strong
        3. Username must be email address
        4. User can register and login
        5. User can post code snippet when logged in
        6. Homepage should contain list of code snippets from DB 
        7. User cannot log in with incorrect password
        8. Username is shown in homepage when logged in
        9. Log out button changes text to public
        10. User cannot register with email that is in use

Total points 25+8 = 33 points

