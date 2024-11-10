describe('Authentication', () => {
    beforeEach(() => {
        // Clear any existing sessions before each test
        cy.clearAllSessionStorage()
    })

    it('should successfully authenticate with Microsoft Entra ID', () => {
        cy.login()


        // Mock the user service response
        cy.intercept('GET', '**/instructs/**', {
            statusCode: 200,
            body: {
                data: [],
                isError: false,
                message: ''
            }
        }).as('instructsRequest')

        // Visit login page and trigger auth flow
        cy.visit('/')
        cy.wait(["@session", "@instructsRequest"]);
        
        cy.url().should('eq', Cypress.config().baseUrl + '/')
        cy.get('[data-testid="welcome-message"]').should('exist')
    })
})
