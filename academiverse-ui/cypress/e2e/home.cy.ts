describe('Course Management Page', () => {
  beforeEach(() => {
    cy.visit('/')
    // Mock session data
    cy.window().then((win) => {
      win.sessionStorage.setItem('userDetails', JSON.stringify({
        role: 'professor',
        userId: '123'
      }))
    })
  })

  it('should display course cards and allow navigation', () => {
    // Check course container exists
    cy.get('[data-testid="course-container"]').should('exist')
    
    // Verify course cards are displayed
    cy.get('[data-testid="course-card"]').should('have.length.at.least', 1)
    
    // Check course card content
    cy.get('[data-testid="course-card"]').first().within(() => {
      cy.get('h6').should('be.visible') // Course name
      cy.get('p').contains('Days:').should('be.visible')
      cy.get('p').contains('Time:').should('be.visible')
      
      // Verify navigation icons exist
      cy.get('button[title="Announcements"]').should('be.visible')
      cy.get('button[title="Modules"]').should('be.visible')
      cy.get('button[title="Assignments"]').should('be.visible')
      cy.get('button[title="Grades"]').should('be.visible')
    })
  })

  it('should handle adding a new course for professors', () => {
    // Click add course button
    cy.get('button[title="Add Course"]').click()
    
    // Verify dialog opens
    cy.get('div[role="dialog"]').should('be.visible')
    
    // Fill form fields
    cy.get('input[placeholder="Select Department"]').type('Computer Science')
    cy.get('input[placeholder="Select Course"]').type('CS101')
    cy.get('input[type="number"]').type('30')
    cy.get('input[type="checkbox"]').first().check()
    cy.get('input[type="time"]').first().type('09:00')
    cy.get('input[type="time"]').last().type('10:30')
    cy.get('select').select('Fall')
    
    // Submit form
    cy.get('button').contains('Save').click()
    
    // Verify success message
    cy.get('.MuiAlert-standardSuccess').should('be.visible')
  })

  it('should handle course editing functionality', () => {
    // Click edit button on first course
    cy.get('[data-testid="course-card"]').first()
      .find('button[title="Edit Course"]')
      .click()
    
    // Verify edit dialog opens
    cy.get('div[role="dialog"]').should('be.visible')
    
    // Edit capacity
    cy.get('input[type="number"]').clear().type('40')
    
    // Change course days
    cy.get('input[type="checkbox"]').first().click()
    
    // Update times
    cy.get('input[type="time"]').first().clear().type('10:00')
    cy.get('input[type="time"]').last().clear().type('11:30')
    
    // Save changes
    cy.get('button').contains('Save').click()
    
    // Verify success message
    cy.get('.MuiAlert-standardSuccess').should('be.visible')
  })

  it('should handle course navigation and section routing', () => {
    // Click first course card
    cy.get('[data-testid="course-card"]').first().click()
    
    // Verify URL changes to announcements section
    cy.url().should('include', 'section=announcements')
    
    // Click different section icons
    cy.get('button[title="Modules"]').click()
    cy.url().should('include', 'section=modules')
    
    cy.get('button[title="Assignments"]').click() 
    cy.url().should('include', 'section=assignments')
    
    cy.get('button[title="Grades"]').click()
    cy.url().should('include', 'section=grades')
  })
})