const mongoose = require('mongoose');
const { Schema } = mongoose;
const EventEmitter = require('events');

// Define the schema for wallet users
const walletUserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    balance: { type: Map, of: Number, default: {} }
});

// Define the schema for wallet transactions
const walletTransactionSchema = new Schema({
    email: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    referenceId: { type: String, required: true },
    description: { type: String, required: true },
    transactionFee: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

// Create the models
const WalletUserModel = mongoose.model('WalletUser', walletUserSchema);
const WalletTransactionModel = mongoose.model('WalletTransaction', walletTransactionSchema);

class SakshWallet extends EventEmitter {
    constructor() {
        super();
        this.adminEmail = process.env.ADMIN_EMAIL || 'walletadmin@sakshwallet.com';
    }

    setAdmin(adminEmail) {
        this.adminEmail = adminEmail || 'walletadmin@sakshwallet.com';
    }

    async sakshGetBalance(email, currency) {
        let userAccount = await WalletUserModel.findOne({ email });
        if (!userAccount) {
            userAccount = new WalletUserModel({ email });
            await userAccount.save();
        }
        const balance = userAccount.balance.get(currency) || 0;
        return { email, currency, balance };
    }

    async sakshGetBalanceSummary(email) {
        let userAccount = await WalletUserModel.findOne({ email });
        if (!userAccount) {
            userAccount = new WalletUserModel({ email });
            await userAccount.save();
        }
        return { email, balance: userAccount.balance };
    }

    async updateBalance(email, amount, currency, type, referenceId, description, transactionFee = 0) {
        let userAccount = await WalletUserModel.findOne({ email });
        if (!userAccount) {
            userAccount = new WalletUserModel({ email });
            await userAccount.save();
        }

        const currentBalance = userAccount.balance.get(currency) || 0;
        const totalAmount = amount + transactionFee;
        const newBalance = type === 'debit' ? currentBalance - totalAmount : currentBalance + amount;

        if (type === 'debit' && totalAmount > currentBalance) {
            return { message: 'Insufficient funds' };
        }

        userAccount.balance.set(currency, newBalance);
        await userAccount.save();

        const transaction = new WalletTransactionModel({
            email,
            type,
            amount,
            currency,
            referenceId,
            description,
            transactionFee
        });
        await transaction.save();

        if (transactionFee > 0) {
            await this.sakshCredit(this.adminEmail, transactionFee, currency, referenceId, `Transaction fee for ${description}`);
        }

        this.emit(type, { email, amount, currency, newBalance, referenceId, description, transactionFee });

        return { message: `${type === 'debit' ? 'Debited' : 'Credited'} ${amount} ${currency}.`, balance: newBalance, transaction };
    }

    async sakshDebit(email, amount, currency, referenceId, description, transactionFee = 0) {
        return this.updateBalance(email, amount, currency, 'debit', referenceId, description, transactionFee);
    }

    async sakshCredit(email, amount, currency, referenceId, description, transactionFee = 0) {
        return this.updateBalance(email, amount, currency, 'credit', referenceId, description, transactionFee);
    }
}

module.exports = SakshWallet;