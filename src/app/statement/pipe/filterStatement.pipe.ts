import {Pipe, PipeTransform} from '@angular/core';
import {Statement} from '../../shared/interfaces';

@Pipe({
    name: 'filterStatement'
})
export class FilterStatementPipe implements PipeTransform {
    transform(
        statements: Statement[],
        search = '',
        cargoOperation = '',
        customer = ''
    ): Statement[] {
        if (search.trim()) {
            statements = statements.filter(statement => {
                return statement.statementId.toString().includes(search.toLowerCase());
            });
        }

        if (cargoOperation) {
            statements = statements.filter(statement => {
                return statement.cargoOperation === cargoOperation;
            });
        }

        if (customer) {
            statements = statements.filter(statement => {
                return statement.customer.customerName === customer;
            });
        }

        return statements;
    }
}
