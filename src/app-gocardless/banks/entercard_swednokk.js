import * as d from 'date-fns';

import { amountToInteger } from '../utils.js';
import { formatPayeeName } from '../../util/payee-name.js';

/** @type {import('./bank.interface.js').IBank} */
export default {
  institutionIds: ['ENTERCARD_SWEDNOKK'],

  accessValidForDays: 180,

  normalizeTransaction(transaction, _booked) {
    // GoCardless's Entercard integration returns forex transactions with the
    // foreign amount in `transactionAmount`, but at least the amount actually
    // billed to the account is now available in
    // `remittanceInformationUnstructured`.
    const remittanceInformationUnstructured =
      transaction.remittanceInformationUnstructured;
    if (remittanceInformationUnstructured.startsWith('billingAmount: ')) {
      transaction.transactionAmount = {
        amount: remittanceInformationUnstructured.substring(15),
        currency: 'SEK',
      };
    }

    return {
      ...transaction,
      payeeName: formatPayeeName(transaction),
      date: d.format(d.parseISO(transaction.valueDate), 'yyyy-MM-dd'),
    };
  },

  calculateStartingBalance(sortedTransactions = [], balances = []) {
    return sortedTransactions.reduce((total, trans) => {
      return total - amountToInteger(trans.transactionAmount.amount);
    }, amountToInteger(balances[0]?.balanceAmount?.amount || 0));
  },
};
