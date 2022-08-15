import { addNewCategory, updateCategory, deleteCategory } from '../../common/categories';
import domains from '../../common/domain'

context('Categories', () => {
    before(() => {
      cy.visit(domains.frontend);
      cy.login();
      const cookie = cy.getCookie('dev_session');
      cy.log(`${cookie}`);
      cy.get('#categoriesMenuItem').click();
      cy.url().should('include', '/admin/categories');
    });

    it('should create/read/update/delete categories', () => {
      addNewCategory('Mixs')
      cy.get('tbody tr').should('have.length', 1);
      addNewCategory('Created');
      cy.get('tbody tr').should('have.length', 2);

      updateCategory(0, 'Created Updated');
      cy.get('tbody tr').contains('Created Updated');
      updateCategory(1, 'Mixs Updated');
      cy.get('tbody tr').contains('Mixs Updated');

      deleteCategory(0)
      cy.get('tbody tr').should('have.length', 1);
      deleteCategory(0);
      cy.get('tbody tr').should('have.length', 0);
    });
});
