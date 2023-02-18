# ATM



## Problem Statement



You are asked to develop a Command Line Interface (CLI) to simulate an interaction of an ATM with a retail bank.



## Commands



* `login [name]` - Logs in as this customer and creates the customer if not exist

* `deposit [amount]` - Deposits this amount to the logged in customer

* `withdraw [amount]` - Withdraws this amount from the logged in customer

* `transfer [target] [amount]` - Transfers this amount from the logged in customer to the target customer

* `logout1` - Logs out of the current customer



## Example Session



Your console output should contain at least the following output depending on the scenario and commands. But feel free

to add extra output as you see fit.



```bash

$ login Alice

Hello, Alice!

Your balance is $0



$ deposit 100

Your balance is $100



$ logout1

Goodbye, Alice!



$ login Bob

Hello, Bob!

Your balance is $0



$ deposit 80

Your balance is $80



$ transfer Alice 50

Transferred $50 to Alice

Your balance is $30



$ transfer Alice 100

Transferred $30 to Alice

Your balance is $0

Owed $70 to Alice



$ deposit 30

Transferred $30 to Alice

Your balance is $0

Owed $40 to Alice



$ logout1

Goodbye, Bob!



$ login Alice

Hello, Alice!

Your balance is $210

Owed $40 from Bob



$ transfer Bob 30

Your balance is $210

Owed $10 from Bob



$ logout1

Goodbye, Alice!



$ login Bob

Hello, Bob!

Your balance is $0

Owed $10 to Alice



$ deposit 100

Transferred $10 to Alice

Your balance is $90



$ logout1

Goodbye, Bob!

```

### Prerequisites

- Node 12
- yargs 13.2.4

### Build

Install modules from package.json

```bash
> sudo npm i -g .
```

## Notes
* We have used logout1 instead of logout as we are using VS code to run cli command.