import Sabadell from '../bancsabadell-bsabesbbb.js';

describe('BancSabadell', () => {
  describe('#normalizeTransaction', () => {
    describe('returns the creditorName and debtorName from remittanceInformationUnstructuredArray', () => {
      it('debtor role - amount < 0', () => {
        const transaction = {
          transactionAmount: { amount: '-100', currency: 'EUR' },
          remittanceInformationUnstructuredArray: ['some-creditor-name'],
          internalTransactionId: 'd7dca139cf31d9',
          transactionId: '04704109322',
        };
        const normalizedTransaction = Sabadell.normalizeTransaction(
          transaction,
          true,
        );
        expect(normalizedTransaction.creditorName).toEqual(
          'some-creditor-name',
        );
        expect(normalizedTransaction.debtorName).toEqual(null);
      });

      it('creditor role - amount > 0', () => {
        const transaction = {
          transactionAmount: { amount: '100', currency: 'EUR' },
          remittanceInformationUnstructuredArray: ['some-debtor-name'],
          internalTransactionId: 'd7dca139cf31d9',
          transactionId: '04704109322',
        };
        const normalizedTransaction = Sabadell.normalizeTransaction(
          transaction,
          true,
        );
        expect(normalizedTransaction.debtorName).toEqual('some-debtor-name');
        expect(normalizedTransaction.creditorName).toEqual(null);
      });
    });
  });
});
