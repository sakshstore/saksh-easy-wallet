# Saksh Easy Wallet: Secure and Flexible Wallet Management for Node.js

**SakshEasyWallet** empowers you to manage user wallets within your Node.js applications. It offers robust features for handling multiple currencies, transaction fees, and event-driven notifications. Additionally, it seamlessly integrates with MongoDB for reliable data storage.

## Key Features

- Manage user balances across various currencies
- Perform debit and credit operations with configurable transaction fees
- Leverage event handling to stay informed about transactions
- Maintain a detailed transaction history
- Configure an admin user to manage transaction fees

## Installation

1. **Grab the Code:** Clone the repository or download the source code.
2. **Set Up Dependencies:** Install required dependencies using npm:

   ```bash
   npm install saksh-easy-wallet
   ```

## Example Usage

Here's a practical example demonstrating the usage of the `SakshWallet` class:

```javascript
const mongoose = require('mongoose');
const { SakshWallet, connectDB } = require('saksh-easy-wallet');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sakshwallet', { useNewUrlParser: true, useUnifiedTopology: true });

const wallet = new SakshWallet();

// Example usage
async function exampleUsage() {
  try {
    // Set admin email
    wallet.setAdmin('admin@example.com');

    // Get balance for a user
    const balance = await wallet.sakshGetBalance('user@example.com', 'USD');
    console.log('Balance:', balance);

    // Get balance summary for a user
    const balanceSummary = await wallet.sakshGetBalanceSummary('user@example.com');
    console.log('Balance Summary:', balanceSummary);

    // Credit an amount to the user's wallet
    const creditResult = await wallet.sakshCredit('user@example.com', 100, 'USD', 'ref123', 'Initial deposit');
    console.log('Credit Result:', creditResult);

    // Debit an amount from the user's wallet
    const debitResult = await wallet.sakshDebit('user@example.com', 50, 'USD', 'ref124', 'Purchase');
    console.log('Debit Result:', debitResult);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

exampleUsage();
```

In this example:

- **Connect to MongoDB:** Establishes a connection to a MongoDB database.
- **Set Admin Email:** Sets the admin email address.
- **Get Balance:** Retrieves the balance for a specific user and currency.
- **Get Balance Summary:** Retrieves the balance summary for all currencies for a specific user.
- **Credit Amount:** Credits an amount to the user's wallet.
- **Debit Amount:** Debits an amount from the user's wallet.

Make sure to replace `'./path/to/sakshWallet'` with the actual path to your SakshWallet class file. This example demonstrates basic usage and can be expanded based on your application's requirements.

 

## API Reference

### `setAdmin(adminEmail)`

- Sets the admin email address used for transaction fees. If not specified, defaults to `walletadmin@sakshwallet.com`.
- **Parameters:**
    - `adminEmail` (string, optional): The admin user's email address.

### `sakshGetBalance(email, currency)`

- Retrieves a user's balance in a specific currency.
- **Parameters:**
    - `email` (string): The user's email address.
    - `currency` (string): The currency code.
- **Returns:**
    - A JSON object containing the user's email, currency, and balance.

### `sakshGetBalanceSummary(email)`

- Retrieves a summary of the user's balance across all currencies.
- **Parameters:**
    - `email` (string): The user's email address.
- **Returns:**
    - A JSON object containing the user's email and a balance summary.

### `sakshCredit(email, amount, currency, reference, description)`

- Credits an amount to the user's wallet.
- **Parameters:**
    - `email` (string): The user's email address.
    - `amount` (number): The amount to credit.
    - `currency` (string): The currency code.
    - `reference` (string): A reference ID for the transaction.
    - `description` (string): A description of the transaction.
- **Returns:**
    - A JSON object containing the transaction details, including the new balance.

### `sakshDebit(email, amount, currency, reference, description, transactionFee)`

- Debits an amount from the user's wallet.
- **Parameters:**
    - `email` (string): The user's email address.
    - `amount` (number): The amount to debit.
    - `currency` (string): The currency code.
    - `reference` (string): A reference ID for the transaction.
    - `description` (string): A description of the transaction.
    - `transactionFee` (number, optional): The transaction fee to apply (if any).
- **Returns:**
    - A JSON object containing the transaction details, including the new balance.

### `sakshGetTransactionReport(email, startDate, endDate)`

- Retrieves a report of transactions for a specific user within a date range.
- **Parameters:**
    - `email` (string): The user's email address.
    - `startDate` (Date): The start date for the report.
    - `endDate` (Date): The end date for the report.
- **Returns:**
    - An array of transaction objects containing details of each transaction within the specified date range.
 

## Support

If you encounter any issues or have questions regarding **Saksh Easy Wallet**, please consider the following options for support:

### Documentation

- Refer to the [Documentation](https://github.com/sakshstore/saksh-easy-wallet) for detailed information on installation, usage, and API references.

### Issues

- If you find a bug or have a feature request, please open an issue in the [Issues section](https://github.com/sakshstore/saksh-easy-wallet/issues) of this repository. Be sure to provide as much detail as possible, including steps to reproduce the issue.

### Discussions

- Join the conversation in the [Discussions section](https://github.com/sakshstore/saksh-easy-wallet/discussions) to ask questions, share ideas, or seek help from the community.

### Contact

- For direct inquiries, you can reach out via email at [support@sakshwallet.com](mailto:support@sakshwallet.com).

### Contributing

- We welcome contributions! If you would like to contribute to **Saksh Easy Wallet**, please check out our [Contributing Guidelines](https://github.com/sakshstore/saksh-easy-wallet/blob/main/CONTRIBUTING.md) for more information.

Thank you for using **Saksh Easy Wallet**! Your support and feedback are greatly appreciated.
