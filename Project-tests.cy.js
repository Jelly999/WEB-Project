describe('Task 1 - User can register', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/register.html')

    cy.get('input[name=email]').type('user10@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')

    cy.url().should('include', '/login')
  })
})
describe('Task 2 - User must use strong password', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/register.html')

    cy.get('input[name=email]').type('user11@mail.com')

    cy.get('input[name=password]').type('password{enter}')

    cy.url().should('include', '/register')

    cy.get('body').contains('"Password is not strong enough"')
  })
})

describe('Task 3 - Username must be email address', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/register.html')

    cy.get('input[name=email]').type('user11')

    cy.get('input[name=password]').type('P@ssword1{enter}')

    cy.url().should('include', '/register')

  })
})

describe('Task 4 - User can register and login', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/register.html')

    cy.get('input[name=email]').type('user12@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')

    cy.url().should('include', '/login')

    cy.get('input[name=email]').type('user12@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')
    
    cy.url().should('include', '/')

    cy.get('h1').contains('Private')

    cy.get('button[name=logout]').click()
  })
})

describe('Task 5 - User can post code snippet when logged in', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/register.html')

    cy.get('input[name=email]').type('user13@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')

    cy.url().should('include', '/login')

    cy.get('input[name=email]').type('user13@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')
    
    cy.url().should('include', '/')

    cy.get('input[name=items]').type('This is very nice project!{enter}')

    cy.contains('ul', 'This is very nice project!')

    cy.get('button[name=logout]').click()
  })
}) 

describe('Task 6 - Homepage should contain list of code snippets from DB ', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/')

    cy.contains('Public')

    cy.contains('ul', 'This is very nice project!')
  })
}) 

describe('Task 7 - User cannot log in with incorrect password', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/login.html')

    cy.get('input[name=email]').type('user13@mail.com')

    cy.get('input[name=password]').type('password1{enter}')
    
    cy.contains('body','"Invalid credentials"')
  })
}) 


describe('Task 8 - Username is shown in homepage when logged in', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/register.html')

    cy.get('input[name=email]').type('user14@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')

    cy.url().should('include', '/login')

    cy.get('input[name=email]').type('user14@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')
    
    cy.url().should('include', '/')

    cy.contains('user14@mail.com')

    cy.get('button[name=logout]').click()
  })
}) 

describe('Task 9 - Log out button changes text to public', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/register.html')

    cy.get('input[name=email]').type('user15@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')

    cy.url().should('include', '/login')

    cy.get('input[name=email]').type('user15@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')
    
    cy.url().should('include', '/')

    cy.contains('Private')
    
    cy.get('button[name=logout]').click()

    cy.contains('Public')
  })
}) 

describe('Task 10 - User cannot register with email that is in use', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:3000/register.html')

    cy.get('input[name=email]').type('user15@mail.com')

    cy.get('input[name=password]').type('P@ssword1{enter}')

    cy.contains('body','"Email already in use"')
  })
}) 

