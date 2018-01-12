/*
 * Copyright © 2017 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import signRawTransaction from '../../../src/transactions/utils/signRawTransaction';

const time = require('../../../src/transactions/utils/time');

describe('#signRawTransaction', () => {
	const timeWithOffset = 38350076;
	let getTimeWithOffsetStub;

	beforeEach(() => {
		getTimeWithOffsetStub = sandbox
			.stub(time, 'getTimeWithOffset')
			.returns(timeWithOffset);
	});

	describe('given a raw transaction type 0', () => {
		const amount = '100';
		const recipientId = '123456789L';
		const timestamp = 12345;
		const fee = '10000000';
		const type = 0;
		const asset = {};
		let transactionType0;
		beforeEach(() => {
			transactionType0 = {
				amount,
				recipientId,
				senderPublicKey: null,
				timestamp,
				type,
				fee,
				recipientPublicKey: null,
				asset,
			};
		});

		describe('given a passphrase', () => {
			const passphrase =
				'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
			const senderPublicKey =
				'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
			const senderId = '16313739661670634666L';
			const signature =
				'd09288d22a1ac860f625db950340cd26e435d0d98a00ffb92d55c16b76d83ed4fd1acf974c28c9dede8fb15a49ccaddb6325f4e750d968e515e1f0d90e0fb30d';
			const transactionId = '9248517814265997446';
			describe('when executed', () => {
				let signedTransaction;
				let signingProperties;
				beforeEach(() => {
					signingProperties = {
						passphrase,
						transaction: transactionType0,
					};
					signedTransaction = signRawTransaction(signingProperties);
				});

				it('should have the type', () => {
					return signedTransaction.should.have.property('type').equal(type);
				});

				it('should have the amount', () => {
					return signedTransaction.should.have.property('amount').equal(amount);
				});

				it('should have the asset', () => {
					return signedTransaction.should.have.property('asset').eql(asset);
				});

				it('should have the senderPublicKey', () => {
					return signedTransaction.should.have
						.property('senderPublicKey')
						.equal(senderPublicKey);
				});

				it('should have the senderId', () => {
					return signedTransaction.should.have
						.property('senderId')
						.equal(senderId);
				});

				it('should have the recipientId', () => {
					return signedTransaction.should.have
						.property('recipientId')
						.equal(recipientId);
				});

				it('should have the fee', () => {
					return signedTransaction.should.have.property('fee').equal(fee);
				});

				it('should have the timestamp', () => {
					return signedTransaction.should.have
						.property('timestamp')
						.be.equal(timeWithOffset);
				});

				it('should have the senderSecondPublicKey', () => {
					return signedTransaction.should.have
						.property('senderSecondPublicKey')
						.equal(null);
				});

				it('should have the signature', () => {
					return signedTransaction.should.have
						.property('signature')
						.be.equal(signature);
				});

				it('should have the id', () => {
					return signedTransaction.should.have
						.property('id')
						.be.equal(transactionId);
				});

				it('should use time.getTimeWithOffset to calculate the timestamp', () => {
					return getTimeWithOffsetStub.should.be.calledWithExactly(undefined);
				});
			});

			describe('given a second passphrase', () => {
				const secondPassphrase =
					'guitar couch salmon subject review urban heavy autumn crush tribe home plunge';
				const senderSecondPublicKey =
					'c465d74511c2bfd136cf9764172acd3c1514fa7ad76475e03bc91cf679757a5c';
				const signSignature =
					'31ef8fcf4e1815def245ad32d0d0e3e86993a4029c41e8ca1dc2674c9794d31cefc2226ac539dea8049c7085fdcb29768389b96104ac05a0ddabfb8b523af409';
				const secondSignedTransactionId = '5702597341252953087';
				describe('when executed', () => {
					let signedTransaction;
					let signingProperties;
					beforeEach(() => {
						signingProperties = {
							passphrase,
							transaction: transactionType0,
							secondPassphrase,
						};
						signedTransaction = signRawTransaction(signingProperties);
					});

					it('should have the type', () => {
						return signedTransaction.should.have.property('type').equal(type);
					});

					it('should have the amount', () => {
						return signedTransaction.should.have
							.property('amount')
							.equal(amount);
					});

					it('should have the asset', () => {
						return signedTransaction.should.have.property('asset').eql(asset);
					});

					it('should have the senderPublicKey', () => {
						return signedTransaction.should.have
							.property('senderPublicKey')
							.equal(senderPublicKey);
					});

					it('should have the senderId', () => {
						return signedTransaction.should.have
							.property('senderId')
							.equal(senderId);
					});

					it('should have the recipientId', () => {
						return signedTransaction.should.have
							.property('recipientId')
							.equal(recipientId);
					});

					it('should have the fee', () => {
						return signedTransaction.should.have.property('fee').equal(fee);
					});

					it('should have the timestamp', () => {
						return signedTransaction.should.have
							.property('timestamp')
							.be.equal(timeWithOffset);
					});

					it('should have the senderSecondPublicKey', () => {
						return signedTransaction.should.have
							.property('senderSecondPublicKey')
							.equal(senderSecondPublicKey);
					});

					it('should have the signature', () => {
						return signedTransaction.should.have
							.property('signature')
							.be.eql(signature);
					});

					it('should have the second signature', () => {
						return signedTransaction.should.have
							.property('signSignature')
							.be.equal(signSignature);
					});

					it('should have the id', () => {
						return signedTransaction.should.have
							.property('id')
							.be.equal(secondSignedTransactionId);
					});

					it('should use time.getTimeWithOffset to calculate the timestamp', () => {
						return getTimeWithOffsetStub.should.be.calledWithExactly(undefined);
					});
				});

				describe('given an offset', () => {
					const timeOffset = 1000;
					let signingProperties;

					describe('when executed', () => {
						beforeEach(() => {
							signingProperties = {
								passphrase,
								transaction: transactionType0,
								secondPassphrase,
								timeOffset,
							};
							signRawTransaction(signingProperties);
						});

						it('should calculate the time with the time offset', () => {
							return getTimeWithOffsetStub.should.be.calledWithExactly(
								timeOffset,
							);
						});
					});
				});
			});
		});
	});
});