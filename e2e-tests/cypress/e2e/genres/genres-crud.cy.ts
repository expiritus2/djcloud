import { addNewGenre, updateGenre, deleteGenre } from '../../common/genres';
import domains from '../../common/domain';

context('Genres', () => {
    beforeEach(() => {
      cy.visit(domains.frontend);
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
