describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Ranger Lee',
      username: 'rangerl',
      password: 'somepassword'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#login-button').should('exist')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('rangerl')
      cy.get('#password').type('somepassword')
      cy.get('#login-button').click()

      cy.contains('Ranger Lee logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpass')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'rangerl', password: 'somepassword' })
      cy.createBlog({ title: 'New Blog', author: 'Anonymous', url: 'newblogurl.com' })
    })

    it('A blog can be created', function() {
      cy.contains('New Blog Anonymous')
      cy.contains('view').should('exist')
    })

    it('Users can like a blog', function() {
      cy.get('.setVisible').click()
      cy.contains('like').click()
      cy.contains('likes: 1')
    })

    it('User who created the blog can delete it', function() {
      cy.get('.setVisible').click()
      cy.contains('remove').click()
      cy.contains('New Blog by Anonymous has been removed')
    })

    it('Only the blog creator can see the delete button', function() {
      cy.get('.setVisible').click()
      cy.contains('remove').should('exist')
      cy.contains('logout').click()
      const user = {
        name: 'Roland',
        username: 'roland',
        password: 'password'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
      cy.login({ username: 'roland', password: 'password' })
      cy.get('.setVisible').click()
      cy.contains('remove').should('not.exist')
    })

    describe('When multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Blog One', author: 'One', url: 'one.com' })
        cy.createBlog({ title: 'Blog Two', author: 'Two', url: 'two.com' })
        cy.createBlog({ title: 'Blog Three', author: 'Three', url: 'three.com' })
      })
      it('Blogs are ordered according by descending likes', function() {
        cy.get('.setVisible').each($el => cy.wrap($el).click())
        cy.contains('Blog One').parent().contains('like').click().click().click()
        cy.contains('Blog Two').parent().contains('like').click().click()
        cy.contains('Blog Three').parent().contains('like').click()

        cy.get('.blog').eq(0).should('contain', 'Blog One')
        cy.get('.blog').eq(1).should('contain', 'Blog Two')
        cy.get('.blog').eq(2).should('contain', 'Blog Three')
      })
    })
  })
})