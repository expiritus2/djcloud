import { addNewGenre, updateGenre, deleteGenre } from '../../common/genres';

context('Categories', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      cy.login();
      cy.get('#genresMenuItem').click();
      cy.url().should('include', '/admin/genres');
    });

    it('should create/read/update/delete genres', () => {
      addNewGenre('Dance')
      cy.get('tbody tr').should('have.length', 1);
      addNewGenre('Hip-Hop');
      cy.get('tbody tr').should('have.length', 2);

      updateGenre(0, 'Dance Updated');
      cy.get('tbody tr').contains('Dance Updated');
      updateGenre(1, 'Hip-Hop Updated');
      cy.get('tbody tr').contains('Hip-Hop Updated');

      deleteGenre(0)
      cy.get('tbody tr').should('have.length', 1);
      deleteGenre(0);
      cy.get('tbody tr').should('have.length', 0);
    });
});
